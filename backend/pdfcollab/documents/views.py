from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import PDFDocument, SharedAccess, Comment
from .serializers import PDFDocumentSerializer, SharedAccessSerializer, CommentSerializer
from accounts.models import CustomUser
import uuid
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings

class PDFDocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = PDFDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PDFDocument.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PDFDocumentRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = PDFDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return PDFDocument.objects.filter(owner=self.request.user)

class SharePDFView(generics.CreateAPIView):
    serializer_class = SharedAccessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        document_id = request.data.get('document')
        document = get_object_or_404(PDFDocument, id=document_id, owner=request.user)
        
        # Check if sharing already exists
        shared_access, created = SharedAccess.objects.get_or_create(
            document=document,
            defaults={'token': uuid.uuid4()}
        )
        
        if not created:
            # Regenerate token if needed
            shared_access.token = uuid.uuid4()
            shared_access.save()
        
        # Generate shareable link
        share_link = f"{settings.FRONTEND_URL}/shared/{shared_access.token}"
        
        # Send email if email provided
        recipient_email = request.data.get('recipient_email')
        if recipient_email:
            send_mail(
                'You have been shared a PDF document',
                f'You can access the shared PDF here: {share_link}',
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                fail_silently=False,
            )
        
        return Response({
            'share_link': share_link,
            'token': str(shared_access.token)
        }, status=status.HTTP_201_CREATED)

class SharedPDFView(generics.RetrieveAPIView):
    serializer_class = PDFDocumentSerializer
    lookup_field = 'token'
    lookup_url_kwarg = 'token'

    def get_queryset(self):
        token = self.kwargs.get('token')
        shared_access = get_object_or_404(SharedAccess, token=token)
        return PDFDocument.objects.filter(id=shared_access.document.id)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        return Comment.objects.filter(document_id=document_id)

    def perform_create(self, serializer):
        document_id = self.kwargs.get('document_id')
        document = get_object_or_404(PDFDocument, id=document_id)
        
        if self.request.user.is_authenticated:
            serializer.save(document=document, author=self.request.user)
        else:
            serializer.save(document=document, shared_access_id=self.request.data.get('shared_access'))