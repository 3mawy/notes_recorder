from .base import *

DEBUG = False

ALLOWED_HOSTS = ["notes-recorder.3mawy.com"]
CORS_ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", ""),
]
DJANGO_ENV = os.getenv("DJANGO_ENV", "prod")
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DATABASE"),
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("POSTGRES_HOST"),
        "PORT": os.getenv("POSTGRES_PORT"),
        "OPTIONS": {
            "sslmode": "require",
        },
    }
}
SIMPLE_JWT["AUTH_COOKIE_DOMAIN"] = "notes-recorder"
SIMPLE_JWT["AUTH_COOKIE_SECURE"] = True


# Enable secure cookies and HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
#         'LOCATION': '127.0.0.1:11211',
#     }
# }

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.mailgun.org'
# EMAIL_PORT = 587
# EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
# EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
# EMAIL_USE_TLS = True
