from django.shortcuts import render
from myapps.about.models import *

def index(request):
    intro = Introduction.objects.all()[0]

    qs = {
        "intro": intro,
    }

    return render(request, 'about.html', qs)
