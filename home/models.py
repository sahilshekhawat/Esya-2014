import datetime
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class profile(models.Model):
    user = models.CharField(max_length=100)
    college = models.CharField(max_length=50)
    mobile= models.CharField(max_length=10)
    #profile_pic = models.ImageField(default='home/profile_pics/default.png', blank=True, null= True, upload_to = 'home/profile_pics/', max_length=255)    
    #def __unicode__(self):
    #    return self.mobile

class emailverify(models.Model):
    userid=models.IntegerField()
    isVerified=models.BooleanField(default=False)
    randomstring= models.CharField(max_length=10)

class ad(models.Model):
    userid = models.IntegerField(default=-1)
    college = models.IntegerField(default=-1)
    title = models.CharField(max_length=500)
    photo = models.ImageField(blank=True, null=True, upload_to = 'home/posts/', max_length=255)
    description = models.CharField(max_length=20000)
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    category = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add = True,blank=True)
    def __unicode__(self):
        return self.userid

class college(models.Model):
	CollegeName = models.CharField(max_length=200)
	isactive=models.BooleanField(default=False)

class feedback(models.Model):
    subject = models.CharField(max_length=200)
    message = models.CharField(max_length=10000)
    from_email= models.EmailField(max_length=300)

class passwordresetrequest(models.Model):
    userid = models.IntegerField()
    hashstring = models.CharField(max_length=22)
    isactive = models.BooleanField(default=True)
    date = models.DateTimeField(auto_now_add = True,blank=True)

class EventCategory(models.Model):
    event_category_name = models.CharField(max_length=1000)

class Event(models.Model):
    description = models.TextField()
    prizes = models.CharField(max_length=500)
    contact = models.TextField()
    event_category_name = models.ManyToManyField('EventCategory')

class Registration(models.Model):
    registered_user = models.CharField(max_length=300)
    event_registered = models.CharField(max_length=300)
    team_members = models.TextField()  #A hack so that any number of team members can be registered.
    def __unicode__(self):
        return self.event_registered