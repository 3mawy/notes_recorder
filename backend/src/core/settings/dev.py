from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# for dev only apps
INSTALLED_APPS += ["drf_spectacular"]
DJANGO_ENV = os.getenv("DJANGO_ENV", "dev")
CORS_ALLOWED_ORIGINS += [
    "http://localhost:5173",
]

REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"] = "drf_spectacular.openapi.AutoSchema"

AUTH_ENABLED = os.getenv("AUTH_ENABLED", "False") == "True"

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

if not AUTH_ENABLED:
    # Disable auth for local development
    MIDDLEWARE.append("api_auth.middleware.DevUserMiddleware")
    REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = []
    REST_FRAMEWORK["DEFAULT_PERMISSION_CLASSES"] = [
        "rest_framework.permissions.AllowAny"
    ]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DEFAULT_FROM_EMAIL = "admin@notes.3mawy.com.com"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DATABASE", "notes_recorder"),
        "USER": os.getenv("POSTGRES_USER", "notes_recorder"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "notes_recorder"),
        "HOST": os.getenv("POSTGRES_HOST", "localhost"),
        "PORT": os.getenv("DATABASE_PORT", "5432"),
        "OPTIONS": {
            "sslmode": "disable",
        },
    }
}

# LOGGING = {
#     "version": 1,
#     "disable_existing_loggers": False,
#     "handlers": {
#         "console": {
#             "class": "logging.StreamHandler",
#         },
#     },
#     "loggers": {
#         "django.db.backends": {
#             "level": "DEBUG",
#             "handlers": ["console"],
#             "propagate": False,
#         },
#     },
# }
