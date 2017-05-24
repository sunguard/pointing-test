# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from myapps.pointing.models import *

from jsonfield import JSONField
from jsoneditor.forms import JSONEditor

class SettingAdmin(admin.ModelAdmin):
    list_display = ('mode', 'activate',)

    formfield_overrides = {
        JSONField: { 'widget': JSONEditor },
    }

class ResultAdmin(admin.ModelAdmin):
    list_display = ('setting',)

    formfield_overrides = {
        JSONField: { 'widget': JSONEditor },
    }

# register admin pages

admin.site.register(Setting, SettingAdmin)
admin.site.register(Result, ResultAdmin)
