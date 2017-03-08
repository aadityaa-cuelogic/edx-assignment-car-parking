from rest_framework import serializers, viewsets
from carparking.models import Vehicle, Fare
from django.contrib.auth.models import User

# class VehicleSerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = Vehicle
# 		fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username')


class VehicleSerializer(serializers.Serializer):
	vehicle_type = (
	    ('CAR', 'Car'),
	    ('TRUCK', 'Truck'),
	    ('BUS', 'Bus'),
	    ('BIKE', 'Bike'),
	)
	id = serializers.IntegerField()
 	name = serializers.CharField(max_length=100)
 	number = serializers.CharField(max_length=100)
	v_type = serializers.ChoiceField(choices=vehicle_type)
 	#owner = serializers.ReadOnlyField()
 	owner_id = serializers.CharField()
	intime = serializers.DateTimeField()
	outtime = serializers.DateTimeField()

	def create(self, validated_data):
		vehicle = Vehicle.objects.create(**validated_data)
		vehicle.save()
		return vehicle

	def update(self, instance, validated_data):
		instance.__dict__.update(**validated_data)
		instance.save()
		return instance