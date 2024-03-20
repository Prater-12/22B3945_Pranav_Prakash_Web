from rest_framework.permissions import BasePermission


class HasSiteUserPermission(BasePermission):
    def has_permission(self, request, view):
        # Check if the user has an associated SiteUser
        try:
            siteuser = request.user.siteuser
            return siteuser is not None
        except:
            return False
