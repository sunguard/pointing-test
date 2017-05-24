from django.conf.urls import url
from myapps.publications import views

urlpatterns = [
    url(r'^$', views.index),
]
