# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest

from myapps.pointing.models import *

def index(request):
    return render(request, 'pointing/index.html')

def spatial(request):
    return render(request, 'pointing/spatial.html')

def temporal(request):
    return render(request, 'pointing/temporal.html')

def combined(request):
    return render(request, 'pointing/combined.html')

# API

def rest_load(request):
    try:
        _mode = request.GET.get("mode", None)
        _setting = Setting.objects.get(mode=_mode, activate=True)

        output = {
            'settings': _setting.env
        }

        return JsonResponse(output)
    except:
        return HttpResponseBadRequest("ERROR: rest_load failed. (Modes should be in capital letters.)")

def save_logs(request):
    pass
