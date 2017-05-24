# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from myapps.publications.models import *

def index(request):
    pubs = Publication.objects.all()

    qs = {
        "pubs": pubs
    }

    return render(request, 'publications.html', qs)
