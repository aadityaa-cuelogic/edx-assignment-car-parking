from django.shortcuts import render
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
from django.utils import timezone
from datetime import datetime
from django.utils import dateparse

from .models import Vehicle, Fare

# Create your views here.
def index(request):
	return render(request, "carparking/index.html", {})

def get_cars_parked(request):
	vehicle_list = Vehicle.objects.all()
	response_data = []
	vehicle_list_dict = {
		'vehicle_list': None
	}

	for obj in vehicle_list:
		vehicle_dict = {
			'id': obj.id,
			'name': obj.name,
			'type': obj.v_type,
			'number': obj.number,
			'intime': obj.intime.isoformat(),
			'outtime': obj.outtime.isoformat(),
		}
		response_data.append(vehicle_dict)

	vehicle_list_dict['vehicle_list'] = response_data
	return HttpResponse(json.dumps(vehicle_list_dict),
		 content_type="application/json")

def edit_car_entry(request, id=None):
	if request.method == 'GET':
		try:
			vehicle_data = Vehicle.objects.get(pk=id)
		except Vehicle.DoesNotExist:
			return HttpResponse(status=404)
		return render(request, "carparking/edit.html", {'request_id':id})
	else:
		return HttpResponse(status=400)

@csrf_exempt
def get_edit_car_entry(request, id=None):
	if request.method == "GET":
		response_data =[]
		vehicle_list_dict = {}
		try:
			vehicle_obj = Vehicle.objects.get(pk=id)
		except Vehicle.DoesNotExist:
			return HttpResponse(status=404)
		vehicle_dict = {
			'id': vehicle_obj.id,
			'name': vehicle_obj.name,
			'type': vehicle_obj.v_type,
			'number': vehicle_obj.number,
			'intime': vehicle_obj.intime.isoformat(),
			'outtime': vehicle_obj.outtime.isoformat(),
		}
		response_data.append(vehicle_dict)
		vehicle_list_dict['vehicle_list'] = response_data
		return HttpResponse(json.dumps(vehicle_list_dict), 
			content_type="application/json", status=200)
	else:
		return HttpResponse(status=400)

@csrf_exempt
def save_edit_car_entry(request):
	if request.method == "POST":
		v_id = request.POST['v_id']
		v_type = request.POST['v_type']
		v_name = request.POST['v_name']
		v_number = request.POST['v_number']
		v_intime = dateparse.parse_datetime(request.POST['v_intime'])
		v_outtime = dateparse.parse_datetime(request.POST['v_outtime'])

		v_list = { 'CAR' : 'Car',
					'TRUCK':'Truck',
					'BIKE':'Bike',
					'TAXI':'Taxi'
				}
		if v_type in v_list:
			try:
				# vehicle_obj = Vehicle.objects.get(pk=v_id)
				Vehicle.objects.filter(pk=v_id).update(v_type=v_type, name=v_name,
					 number=v_number, intime=v_intime, outtime=v_outtime)
			except Vehicle.DoesNotExist or IntegrityError as e:
				return HttpResponse(404)
			return HttpResponse(status=200)
		else:
			return HttpResponse(status=400)
	else:
		return HttpResponse(status=400)

@csrf_exempt
def delete_car_parked(request):
	if request.method == "POST":
		v_id = request.POST['v_id']
		try:
			vehicle_obj = Vehicle.objects.get(pk=v_id)
		except Vehicle.DoesNotExist:
			return HttpResponse(status=404)
		Vehicle.objects.get(pk=v_id).delete()
		return HttpResponse(status=200)
	else:
		return HttpResponse(status=400)

@csrf_exempt
def add_new_car_parked(request):
	if request.method == "GET":
		return render(request, "carparking/addnew.html", {})
	elif request.method == "POST":
		v_type = request.POST['v_type']
		v_name = request.POST['v_name']
		v_number = request.POST['v_number']
		v_intime = dateparse.parse_datetime(request.POST['v_intime'])
		v_outtime = dateparse.parse_datetime(request.POST['v_outtime'])

		v_list = { 'CAR' : 'Car',
					'TRUCK':'Truck',
					'BIKE':'Bike',
					'TAXI':'Taxi'
				}
		if v_type in v_list:
			try:
				vehicle_obj = Vehicle.objects.get(number=v_number)
			except Vehicle.DoesNotExist:
				try:
					# import pdb
					# pdb.set_trace()
					new_vehicle = Vehicle.objects.create(
						name=v_name,
						number=v_number,
						v_type=v_type,
						intime=v_intime,
						outtime=v_outtime,
					)
				except Vehicle.DoesNotExist:
					return HttpResponse(status=400)

				return HttpResponse(status=200)
		else:
			return HttpResponse(status=400)
	else:
		return HttpResponse(status=403)