from django.conf.urls import url
from myapps.pointing import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^spatial/$', views.spatial),

    # REST

    url(r'^rest/load/$', views.rest_load),
]
