from django.conf.urls import url, include

from rest_framework.routers import DefaultRouter
from rest_framework import renderers
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
# Create a router and register our viewsets with it.
# router = DefaultRouter()
# router.register(r'vehicle', VehicleViewSet)
# router.register(r'users', UserViewSet)

urlpatterns = [
	# url(r'^', include(router.urls)),
	url('^accounts/', include('django.contrib.auth.urls')),
	url(r'^vehicle/$', views.VehicleList.as_view()),
	url(r'^vehicle/(?P<pk>[0-9]+)/$', views.VehicleDetail.as_view()),

	url(r'^$', views.index, name="index"),
	url(r'^getparking', views.get_cars_parked, name="getparking"),
	url(r'^edit/(?P<id>[0-9]+)/$', views.edit_car_entry, name="editcarentry"),
	url(r'^saveedit/$', views.save_edit_car_entry, name="editcarentry"),
	url(r'^getedit/(?P<id>[0-9]+)/$', views.get_edit_car_entry, name="geteditcarentry"),
	url(r'^delete/$', views.delete_car_parked, name="parked_car_delete"),
	url(r'^addnew/$', views.add_new_car_parked, name="add_parked_car"),
]

urlpatterns = format_suffix_patterns(urlpatterns)