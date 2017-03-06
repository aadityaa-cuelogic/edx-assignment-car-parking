from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Fare(models.Model):
	vehicle_type = models.CharField(max_length=100, unique=True)
	fare = models.IntegerField()

class Vehicle(models.Model):
	vehicle_type = (
	    ('CAR', 'Car'),
	    ('TRUCK', 'Truck'),
	    ('BUS', 'Bus'),
	    ('BIKE', 'Bike'),
	)

	name = models.CharField(max_length=100)
	number = models.CharField(max_length=100)
	v_type = models.CharField(
				max_length=5,
		        choices=vehicle_type,
		        default='CAR',
		    )
	owner = models.ForeignKey('auth.User', related_name='vehicle',
							  on_delete=models.CASCADE)
	intime = models.DateTimeField()
	outtime = models.DateTimeField()
	created_on = models.DateTimeField(auto_now_add=True)
	updated_on = models.DateTimeField(auto_now=True)

		