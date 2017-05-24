# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from myapps.about.models import *

class IntroAdmin(admin.ModelAdmin):
    list_display = ('id', 'content',)

# register admin pages

admin.site.register(Introduction, IntroAdmin)
admin.site.unregister(User)
admin.site.unregister(Group)
