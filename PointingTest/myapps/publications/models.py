# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

class Publication(models.Model):
    title = models.CharField(max_length=1000)
    abstract = models.TextField()
    authors = models.CharField(max_length=200)
    venue = models.CharField(max_length=100)
    link = models.CharField(max_length=1000)
