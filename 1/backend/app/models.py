from django.db import models
from django.contrib.auth.models import User


class SiteUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    is_manager = models.BooleanField(default=False)

    @property
    def username(self):
        return self.user.username

    def __str__(self):
        return self.user.username


# Create your models here.
class Team(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)
    description = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    members = models.ManyToManyField(SiteUser, through="Membership")

    def __str__(self):
        return self.name


class Membership(models.Model):
    user = models.ForeignKey(SiteUser, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    can_view = models.BooleanField(default=False)
    can_add = models.BooleanField(default=False)
    can_manage_documents = models.BooleanField(default=False)
    can_manage_users = models.BooleanField(default=False)

    def __str__(self):
        try:
            if self.user.is_manager:
                return f"{self.user.username} - {self.team.name}: Manager"
            else:
                return f"{self.user.username} - {self.team.name}: {'V' if self.can_view else ''} {'A' if self.can_add else ''} {'MD' if self.can_manage_documents else ''} {'MU' if self.can_manage_users else ''}".strip()
        except:
            return f"{self.user.username} - {self.team.name}"


class Tag(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    class DocumentType(models.TextChoices):
        DOCS = "docs", "Docs"
        SLIDES = "slides", "Slides"
        SHEETS = "sheets", "Sheets"
        PDF = "pdf", "PDF"
        REPO = "repo", "Repo"
        FIGMA = "figma", "Figma"
        OTHER = "other", "Other"

    title = models.CharField(max_length=100)
    doc_type = models.CharField(max_length=10, choices=DocumentType.choices)
    author = models.ForeignKey(
        SiteUser, on_delete=models.SET_NULL, null=True, blank=True
    )
    description = models.TextField(null=True, blank=True)

    # Either a file or a link is required
    file = models.FileField(upload_to="documents/", null=True, blank=True)
    link = models.URLField(null=True, blank=True)

    # Date Information
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    users = models.ManyToManyField(SiteUser, related_name="documents", blank=False)
    teams = models.ManyToManyField(Team, related_name="documents", blank=True)

    tags = models.ManyToManyField(Tag, related_name="documents", blank=True)

    def __str__(self):
        return self.title
