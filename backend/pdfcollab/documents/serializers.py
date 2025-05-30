from rest_framework import serializers
from .models import PDFDocument, SharedAccess, Comment
from accounts.models import CustomUser

class PDFDocumentSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = PDFDocument
        fields = ['id', 'title', 'file', 'owner', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def validate_file(self, value):
        if not value.name.lower().endswith('.pdf'):
            raise serializers.ValidationError("Only PDF files are allowed.")
        return value

class SharedAccessSerializer(serializers.ModelSerializer):
    document = serializers.PrimaryKeyRelatedField(queryset=PDFDocument.objects.all())
    
    class Meta:
        model = SharedAccess
        fields = ['id', 'document', 'token', 'created_at', 'expires_at', 'allow_comments']
        read_only_fields = ['id', 'token', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), required=False, allow_null=True)
    shared_access = serializers.SlugRelatedField(
        queryset=SharedAccess.objects.all(),
        slug_field='token',
        required=False,          # now optional
        allow_null=True          # allow null values
    )

    class Meta:
        model = Comment
        fields = ['id', 'document', 'shared_access', 'author', 'guest_name', 'content', 
                  'page_number', 'x_position', 'y_position', 'created_at', 'parent_comment', 'marked_seen']
        read_only_fields = ['id', 'created_at', 'document']

    def validate(self, data):
        return data