from django.urls import path
from .views import (
    PDFDocumentListCreateView,
    PDFDocumentRetrieveDestroyView,
    SharePDFView,
    SharedPDFView,
    CommentListCreateView,
    CommentDestroyView,
    CommentMarkSeenUpdateView
)

urlpatterns = [
    path('documents/', PDFDocumentListCreateView.as_view(), name='document-list'),
    path('documents/<uuid:id>/', PDFDocumentRetrieveDestroyView.as_view(), name='document-detail'),
    path('documents/<uuid:id>/share/', SharePDFView.as_view(), name='share-document'),
    path('shared/<uuid:token>/', SharedPDFView.as_view(), name='shared-document'),
    path('documents/<uuid:document_id>/comments/', CommentListCreateView.as_view(), name='comment-list'),
    path('documents/<uuid:document_id>/comments/<int:comment_id>/', CommentDestroyView.as_view(), name='comment-destroy'),
    path('documents/<uuid:document_id>/comments/<int:comment_id>/markseen/',
         CommentMarkSeenUpdateView.as_view(), name='comment-markseen-update'),
]