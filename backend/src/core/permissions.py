from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a note to view or edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the note
        return obj.user == request.user
