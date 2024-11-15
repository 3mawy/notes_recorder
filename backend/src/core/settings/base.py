import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from .lib_settings import SIMPLE_JWT, SPECTACULAR_SETTINGS

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, os.path.join(BASE_DIR.parent, "apps"))
FRONTEND_URL = os.getenv("FRONTEND_URL", None)
SECRET_KEY = os.getenv(
    "SECRET_KEY", ""
)

DEBUG = False

ALLOWED_HOSTS = []  # type: ignore

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "src.core",
    "api_auth",
    "audio",
    "notes",
]
AUTH_USER_MODEL = "api_auth.User"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "api_auth.middleware.JWTRefreshMiddleware",
]

REST_FRAMEWORK = {
    "ORDERING_PARAM": "sort",
    "DEFAULT_AUTHENTICATION_CLASSES": ("api_auth.authenticate.CustomAuthentication",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 50,
}

JWT_SETTINGS = SIMPLE_JWT
SPECTACULAR_SETTINGS = SPECTACULAR_SETTINGS

CORS_ALLOWED_ORIGINS: list[str] = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]
CORS_ALLOW_CREDENTIALS = True

CSRF_COOKIE_HTTP_ONLY = True
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_HTTP_ONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

ROOT_URLCONF = "src.core.urls"
DEFAULT_FROM_EMAIL = "admin@notes.3mawy.com.com"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "src.core.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-gb"
TIME_ZONE = "Europe/London"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
