from rest_framework.routers import DefaultRouter

from src.apps.notes.views.notes_views import NoteViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')

urlpatterns = router.urls

