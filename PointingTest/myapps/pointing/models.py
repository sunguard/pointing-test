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
    activate = models.BooleanField(default=False)

    def __str__(self):
        return self.mode

class Result(models.Model):
    setting = models.ForeignKey(Setting, related_name='results')
    data = JSONField()
