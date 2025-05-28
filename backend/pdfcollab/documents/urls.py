from django.urls import path
from .views import (
    PDFDocumentListCreateView,
    PDFDocumentRetrieveDestroyView,
    SharePDFView,
    SharedPDFView,
    CommentListCreateView
)

urlpatterns = [
    path('documents/', PDFDocumentListCreateView.as_view(), name='document-list'),
    path('documents/<uuid:id>/', PDFDocumentRetrieveDestroyView.as_view(), name='document-detail'),
    path('documents/<uuid:id>/share/', SharePDFView.as_view(), name='share-document'),
    path('shared/<uuid:token>/', SharedPDFView.as_view(), name='shared-document'),
    path('documents/<uuid:document_id>/comments/', CommentListCreateView.as_view(), name='comment-list'),
]