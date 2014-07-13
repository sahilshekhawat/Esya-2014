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
from home.models import *


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
    events=""
    #if request.user.is_authenticated():
    #    events = Registration.objects.all().filter(registered_user=request.user.email)


    return render(request,'home/index.html',{'events':events})

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
                event_list=[]
                myString=""
                events_list =Registration.objects.all().filter(registered_user=user.email)
                for poll in events_list:
					if poll.registered_user == request.user.email:
						event_list.append(poll.event_registered)
                myString = "\n".join(item for item in event_list)
                data['events'] = myString
            else:
                data['error'] = "There was an error, please try again"
        else:
            data['error']  = "Authentication failure! Incorrect username or password"

        data['username'] = username
        
        return HttpResponse(simplejson.dumps(data), content_type='application/json')

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
        #print username, password, email, a,b,c
        emailcount=User.objects.filter(email=email).count()
        usernamecount=User.objects.filter(username=username).count()
        if usernamecount != 0:
            data['error'] = "username already taken"
            return HttpResponse(simplejson.dumps(data), content_type='application/json') #changes made
        if emailcount != 0:
            data['error'] = "email already registered"
            return HttpResponse(simplejson.dumps(data), content_type='application/json')  #changes made
        newuser = User.objects.create_user(username,email,password)
        if a and b:
            newuser.first_name = a
            newuser.last_name = b
            newuser.save()


            print "profile saved"
        else:
            data['error_name'] = "please provide your name details"

        college = request.POST['college']
        phone = request.POST['phone']
        print "college==" + str(college)
        print "phone==" + str(phone)

        abc = profile(user_firstname=str(a), user_lastname=str(b), user=str(email),college=str(college),mobile=str(phone))
        abc.save()
        #newuser.college = request.POST['college']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request,user)
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
    data['events']=""
    return HttpResponse(simplejson.dumps(data), content_type='application/json')


@ajax
@csrf_exempt
def eventregister(request):
    if request.method== "POST" and request.is_ajax():
        data = {}
        data['error'] = ""
        if request.user.is_authenticated():
            user = request.user
            if request.user.email:
                usermail = request.user.email
                print user.first_name
                print user.last_name
                print usermail
                event = request.POST['event']
                register_data = request.POST['register_data']
                            #w = []
                q = list(Registration.objects.all().filter(registered_user=usermail))
                for i in range(len(q)):
                    q[i] = q[i].event_registered
                if event not in q: 
                    try:
                        r = Registration(user_fname=user.first_name, user_lname=user.last_name, registered_user=usermail, event_registered=event,team_members=register_data)
                        r.save()
                        event_list=[]
                        myString=""
                        events_list =Registration.objects.all().filter(registered_user=usermail)
                        for poll in events_list:
                            if poll.registered_user == usermail:
                                event_list.append(poll.event_registered)
                        myString = " ".join(item for item in event_list)
                        data['events'] = myString
                        data['success']="You have successfully registered"
                    except:
                        data['error'] = "Please Register and Login with Website before registering for event"
                else:
                    data['error'] = "You have already Registered for this Event"

            else:
                data['error'] = "Please register or login (with a Email address"
        else:
            data['error']="Please register or Login"
    else:
        data = {}
        data['error'] = "please register or login"

    print data
    return HttpResponse(simplejson.dumps(data), content_type='application/json')