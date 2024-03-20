from rest_framework import serializers
from .models import SiteUser, Team, Membership, Document, Tag


class SiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = ["user", "is_manager", "username"]


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["user", "can_add", "can_manage_documents", "can_manage_users"]


class TeamSerializer(serializers.ModelSerializer):
    members = MembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ["name", "color", "description", "created_at", "updated_at", "members"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["name", "color"]


class DocumentSerializer(serializers.ModelSerializer):
    author = SiteUserSerializer(read_only=True)
    users = SiteUserSerializer(many=True, read_only=True)
    teams = TeamSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = [
            "title",
            "doc_type",
            "author",
            "description",
            "file",
            "link",
            "created_at",
            "updated_at",
            "tags",
            "users",
            "teams",
        ]


class PartialDocumentSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    author = SiteUserSerializer(read_only=True)
    tags = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), allow_empty=True, required=False
    )
    file = serializers.FileField(max_length=None, use_url=True, required=False)

    class Meta:
        model = Document
        fields = [
            "id",
            "title",
            "doc_type",
            "author",
            "description",
            "file",
            "link",
            "created_at",
            "updated_at",
            "tags",
        ]

    def create(self, validated_data):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            site_user = SiteUser.objects.get(user=request.user)
            validated_data["author"] = site_user

        file = validated_data.get("file")
        link = validated_data.get("link")
        if not file and not link:
            raise serializers.ValidationError("Both file and link cannot be empty.")

        return super().create(validated_data)
