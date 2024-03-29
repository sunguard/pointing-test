from django.conf.urls import url
from myapps.pointing import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^spatial/$', views.spatial),
    url(r'^temporal/$', views.temporal),
    url(r'^combined/$', views.combined),

    # REST

    url(r'^rest/load/$', views.rest_load),
    url(r'^rest/save/$', views.rest_save),
    url(r'^rest/result/spatial/$', views.rest_result_spatial),
    url(r'^rest/result/temporal/$', views.rest_result_temporal),
    url(r'^rest/result/combined/$', views.rest_result_combined),
]
