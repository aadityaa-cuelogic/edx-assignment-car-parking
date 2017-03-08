from carparking.models import Vehicle
from carparking.serializers import VehicleSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ListVehicle(APIView):

	def get(self, request, pk=None, format=None):
		if pk:
			vehicle = Vehicle.objects.get(pk=pk)
			serializer = VehicleSerializer(vehicle)
		else:
			vehicle = Vehicle.objects.all()
			serializer = VehicleSerializer(vehicle, many=True)
		return Response(serializer.data)

	def post(self, request, format=None):
		serializer = VehicleSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def put(self, request, pk=None):
		if pk:
			vehicle = Vehicle.objects.get(pk=pk)
			serializer = VehicleSerializer(vehicle, data=request.data)
			if serializer.is_valid():
				serializer.save()
				return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		