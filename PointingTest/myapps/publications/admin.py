# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from myapps.publications.models import *

class PubAdmin(admin.ModelAdmin):
    list_display = ('venue', 'title',)

# register admin pages

admin.site.register(Publication, PubAdmin)
