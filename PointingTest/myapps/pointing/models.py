# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from jsonfield import JSONField

class Setting(models.Model):
    MODE_CHOICES = (
        ('SP', 'Spatial Pointing Task'),
        ('TP', 'Temporal Pointing Task'),
        ('STP', 'Spatial-Temporal Pointing Task')
    )

    mode = models.CharField(max_length=3, choices=MODE_CHOICES, default='SP')
    env = JSONField()
