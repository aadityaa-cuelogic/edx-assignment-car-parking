from rest_framework import serializers, viewsets
from carparking.models import Vehicle, Fare
from django.contrib.auth.models import User

class VehicleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Vehicle
		fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username')