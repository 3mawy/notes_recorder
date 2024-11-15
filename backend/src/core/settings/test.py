from typing import Any

from .base import *

DEBUG = False

DJANGO_ENV = os.getenv("DJANGO_ENV", "test")

# AUTH_ENABLED = os.getenv("AUTH_ENABLED", "False") == "True"
#
# if not AUTH_ENABLED:
#     # Disable auth for local development
#     MIDDLEWARE.append("api_auth.middleware.DevUserMiddleware")
#     REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = []  # type:ignore
#     REST_FRAMEWORK["DEFAULT_PERMISSION_CLASSES"] = [  # type:ignore
#         "rest_framework.permissions.AllowAny"
#     ]
#     REST_FRAMEWORK = {
#         "TEST_REQUEST_DEFAULT_FORMAT": "json",
#         "DEFAULT_AUTHENTICATION_CLASSES": [],
#         "DEFAULT_PERMISSION_CLASSES": [],
#     }

# Use a faster, in-memory database for testing, if appropriate
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}


# Disable migrations for faster setup (if using a SQLite in-memory database)
class DisableMigrations:
    def __contains__(self, item: Any) -> bool:
        return True

    def __getitem__(self, item: Any) -> str:
        return "notmigrations"


# Disable migrations for faster setup by setting MIGRATION_MODULES to an empty dictionary
MIGRATION_MODULES = {app_label: None for app_label in INSTALLED_APPS}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django.db.backends": {
            "level": "DEBUG",
            "handlers": ["console"],
            "propagate": False,
        },
    },
}

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"
DEFAULT_FILE_STORAGE = "django.core.files.storage.InMemoryStorage"
