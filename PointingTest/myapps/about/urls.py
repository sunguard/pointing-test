from django.conf.urls import url
from myapps.about import views

urlpatterns = [
    url(r'^$', views.index),
]
