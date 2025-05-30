import uuid
from django.db import models
from accounts.models import CustomUser

def pdf_upload_path(instance, filename):
    return f'pdfs/{instance.owner.id}/{filename}'

class PDFDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=pdf_upload_path)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owned_documents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class SharedAccess(models.Model):
    document = models.ForeignKey(PDFDocument, on_delete=models.CASCADE, related_name='shared_access')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    allow_comments = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.document.title} - {self.token}"

class Comment(models.Model):
    document = models.ForeignKey(PDFDocument, on_delete=models.CASCADE, related_name='comments')
    shared_access = models.ForeignKey(SharedAccess, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    guest_name = models.CharField(max_length=100, null=True, blank=True)
    content = models.TextField()
    page_number = models.PositiveIntegerField()
    x_position = models.FloatField()
    y_position = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    marked_seen = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.author or self.guest_name} on page {self.page_number}"