from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.shortcuts import redirect
from django.contrib import admin

urlpatterns = [
    # apps
    url(r'^$', lambda x: redirect('/about/')),
    url(r'^about/', include('apps.about.urls')),
    url(r'^publications/', include('apps.publications.urls')),
    url(r'^test/', include('apps.pointing.urls')),

    # admin
    url(r'^admin/', admin.site.urls),
]

#urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
