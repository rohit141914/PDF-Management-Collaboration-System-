from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import PDFDocument, SharedAccess, Comment
from .serializers import PDFDocumentSerializer, SharedAccessSerializer, CommentSerializer
from accounts.models import CustomUser
import uuid
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
import logging
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

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
        document_id = request.data.get('document_id')
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
        email_sent = False

        if recipient_email:
            try:
                validate_email(recipient_email)
            except ValidationError:
                return Response({
                    'error': 'Invalid email address format'
                }, status=status.HTTP_400_BAD_REQUEST)
            try:
                send_mail(
                    'You have been shared a PDF document',
                    f'You can access the shared PDF here: {share_link}',
                    settings.DEFAULT_FROM_EMAIL,
                    [recipient_email, "rohitnain2603@gmail.com"],
                    fail_silently=False,
                )
                email_sent = True
            except Exception as e:
                logger.error(f"Failed to send email to {recipient_email}: {str(e)}")

        response_data = {
            'share_link': share_link,
            'token': str(shared_access.token)
        }

        if recipient_email:
            response_data['email_sent'] = email_sent

        return Response(response_data, status=status.HTTP_201_CREATED)

class SharedPDFView(generics.RetrieveAPIView):
    serializer_class = PDFDocumentSerializer

    def get_object(self):
        token = self.kwargs.get("token")
        shared_access = get_object_or_404(SharedAccess, token=token)
        return shared_access.document

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
            # Convert token string to SharedAccess object and pass it to the serializer
            shared_access_token = self.request.data.get('shared_access')
            shared_access_obj = get_object_or_404(SharedAccess, token=shared_access_token)
            serializer.save(document=document, shared_access=shared_access_obj)

class CommentDestroyView(generics.DestroyAPIView):
    serializer_class = CommentSerializer
    # permission_classes = [permissions.IsAuthenticated]
    lookup_field = "id"                   # model field name
    lookup_url_kwarg = "comment_id"        # URL parameter name

    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        return Comment.objects.filter(document_id=document_id)

class CommentMarkSeenUpdateView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['put']

    def put(self, request, document_id, comment_id):
        comment = get_object_or_404(Comment, document_id=document_id, id=comment_id)
        marked_seen_status = request.data.get("marked_seen_status")
        if marked_seen_status is None:
            return Response(
                {"error": "marked_seen_status is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Convert marked_seen_status to boolean taking care of string values, e.g., "false"
        if isinstance(marked_seen_status, str):
            comment.marked_seen = marked_seen_status.lower() in ["true", "1", "yes"]
        else:
            comment.marked_seen = bool(marked_seen_status)
        comment.save()
        return Response(
            {"message": "Comment marked_seen status updated.",
             "marked_seen": comment.marked_seen},
            status=status.HTTP_200_OK
        )