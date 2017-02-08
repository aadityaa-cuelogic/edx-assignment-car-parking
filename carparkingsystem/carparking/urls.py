from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name="index"),
	url(r'^getparking', views.get_cars_parked, name="getparking"),
	url(r'^edit/(?P<id>[0-9]+)/$', views.edit_car_entry, name="editcarentry"),
	url(r'^saveedit/$', views.save_edit_car_entry, name="editcarentry"),
	url(r'^getedit/(?P<id>[0-9]+)/$', views.get_edit_car_entry, name="geteditcarentry"),
	url(r'^delete/$', views.delete_car_parked, name="parked_car_delete"),
	url(r'^addnew/$', views.add_new_car_parked, name="add_parked_car"),
]