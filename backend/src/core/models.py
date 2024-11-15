from django.db import models


class BaseSqlModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Here to help with code completion
    objects = models.Manager()

    class Meta:
        abstract = True
