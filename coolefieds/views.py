from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django_ajax.decorators import ajax
from home.views import *
from django.contrib.auth.models import User
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.core.mail import EmailMultiAlternatives
from django.template import Context, Template
from datetime import timedelta
from django.utils.timezone import utc
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.core.context_processors import csrf
from home.models import Registration
import datetime
import simplejson


def index(request):
    now= datetime.datetime.now()
    return render(request,'coolefieds/index.html', {'current_date':now})


def hello(request):
    return HttpResponse("Hello world")


def index1(request):
    #if request.user.is_authenticated():
    #    return render(request, 'home/index_login.html', {'user': request.user})
    #else:
    #    try:
    #        if isEmailVerified(request.user.id)==False:
    #            Message+="Psst. Don't forget to confirm your email! Just look for the message we sent you."
    #    except:
    #        Message=""
    return render(request,'home/index.html')

def allevents(request):
    return render(request, 'home/allevents.html')

def individualevents(request):
    return render(request, 'home/individualevents.html')

@csrf_exempt
@ajax
def ajaxlogin(request):
    if request.method== "POST" and request.is_ajax():
        data = {}
        data['error'] = ""
        username=request.POST['username']
        password=request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request,user)
                if not request.POST.get('rem', None):
                    request.session.set_expiry(0)
                data['success'] = "You have logged in"
            else:
                data['error'] = "There was an error, please try again"
        else:
            data['error']  = "Authentication failure! Incorrect username or password"

        data['username'] = username
        return HttpResponse(simplejson.dumps(data), content_type='application/json')

                #return render(request,'home/mainpage.html')
                # Redirect to a success page.
            #else:
                # Return a 'disabled account' error message
@csrf_exempt
@ajax
def ajaxregister(request):
    if request.method == "POST" and request.is_ajax():
        data = {}
        data['error'] = ""
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        #college = request.POST['college']
        a = request.POST.get('firstname', False)
        b = request.POST.get('lastname', False)
        c = request.POST.get('college', False)
        #print username, password, email, a,b,c
        emailcount=User.objects.filter(email=email).count()
        usernamecount=User.objects.filter(username=username).count()
        if usernamecount != 0:
            data['error'] = "username already taken"
        if emailcount != 0:
            data['error'] = "email already registered"

        newuser = User.objects.create_user(username,email,password)

        if a and b:
            newuser.first_name = a
            newuser.last_name = b
            newuser.save()


            print "profile saved"
        else:
            data['error_name'] = "please provide your name details"


        if c:
            newprofile = User.objects.create_user(username,email,password)
            p = profile(user=newprofile,college=c,mobile=None)
            p.save()
        #newuser.college = request.POST['college']
        #user = authenticate(username=username, password=password)
        #if user is not None:
        #    login(request,user)
        data['success'] = "You have successfully registered and logged in"
        data['username'] = username
        #else:
        #    data['error'] = "An Error has occured please try again"
        return HttpResponse(simplejson.dumps(data), content_type='application/json')

@ajax
@csrf_exempt
def ajaxlogout(request):
    data = {}
    data['error'] = ""
    auth_logout(request)
    data['success'] = "You have been successfully loggedout"
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


@ajax
@csrf_exempt
def eventregister(request):
    if request.method== "POST" and request.is_ajax():
        data = {}
        data['error'] = ""

        usermail = request.user.email
        print usermail
        event = request.POST['event']
        register_data = request.POST['register_data']
        try:
            r = Registration(registered_user=usermail, event_registered=event,team_members=register_data)
            r.save()
            data['success']="You have successfully registered"
        except:
            data['error'] = "Please Register and Login before registering"

    return HttpResponse(simplejson.dumps(data), content_type='application/json')





    #eventregister()