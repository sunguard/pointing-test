from django.shortcuts import render

def index(request):
    qs = {
    }

    return render(request, 'about.html', qs)
