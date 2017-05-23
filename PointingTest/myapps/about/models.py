# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class Introduction(models.Model):
    image = models.ImageField(upload_to='about')
    zipfile = models.FileField(upload_to='about', null=True, blank=True)
    content = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-id']
