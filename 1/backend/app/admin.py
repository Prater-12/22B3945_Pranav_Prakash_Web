from django.contrib import admin
from .models import SiteUser, Team, Membership, Tag, Document

# Register your models here.
admin.site.register(SiteUser)
admin.site.register(Team)
admin.site.register(Membership)
admin.site.register(Tag)
admin.site.register(Document)
