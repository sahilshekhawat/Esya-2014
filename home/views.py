# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.core.mail import EmailMultiAlternatives
from django.template import Context, Template
from datetime import timedelta
from django.utils.timezone import utc
from django.contrib import messages

from home.functions import *

import datetime,random,string

from home.models import *
from home.forms import *
from django.core.mail import send_mail

####################Views###################
    
def registerpage(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        if request.method == "POST":
            form = register_new(request.POST,request.FILES)
            if form.is_valid():
                uname=request.POST['username']
                password=request.POST['password']
                emailid=request.POST['email']
                emailcount=User.objects.filter(email=emailid).count()
                unamecount=User.objects.filter(username=uname).count()
                if emailcount!=0:
                    form=register_new()
                    return render(request,'home/register.html', {'form':form, 'UError': "Here"})
                if unamecount!=0:
                    form=register_new()
                    return render(request,'home/register.html', {'form':form, 'UNameError': "Here"})
                newuser = User.objects.create_user(uname,emailid,password)
                newuser.first_name=request.POST['first_name']
                newuser.last_name=request.POST['last_name']
                newuser.save()
                m=form.save(commit=False)
                m.user=newuser
                m.save()
                sendverifymail(newuser.id,newuser.email)
                user = authenticate(username=uname, password=password)
                login(request,user)
                return HttpResponseRedirect('/')
        else:
            form= register_new()
        return render(request,'home/register.html', {'form':form})

def loginpage(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        if request.method== "POST":
            username=request.POST['username']
            password=request.POST['password']
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request,user)
                    if request.method == 'GET' and 'next' in request.GET:
                        if request.GET['next']:
                            return HttpResponseRedirect(request.GET['next'])
                    return HttpResponseRedirect('/') 
                    #return render(request,'home/mainpage.html')
                    # Redirect to a success page.
    #            else:
                    # Return a 'disabled account' error message
            else:
                form=login_now()
                return render(request, 'home/login.html', {'form':form, 'message':"Incorrect Username/Password"})
        else:
            form=login_now()
            return render(request, 'home/login.html', {'form':form})

def verifymail(request,mainstring):
    b=emailverify.objects.get(randomstring=mainstring)
    if b.isVerified == False:
        b.isVerified=True
        b.save()
        return HttpResponseRedirect('/')
    else:
        return render(request,'coolefieds/index.html',{'current_date':'InvalidLink'})

def changepasswordrequest(request,flag):
    if request.method == "POST":
        form = change_password(request.POST,request.FILES)
        if form.is_valid():
            B=passwordresetrequest.objects.get(hashstring=flag)
            if B.isactive == True:
                myuser=B.userid
                u=User.objects.get(id=myuser)
                u.set_password(request.POST['password'])
                u.save()
                B.isactive=False
                B.save()
        return HttpResponseRedirect('/')
    else:
        form=change_password()
        B=passwordresetrequest.objects.get(hashstring=flag)
        d=datetime.datetime.utcnow().replace(tzinfo=utc)-B.date
        if B.isactive==False or d.seconds>86400:
            B.isactive=False
            B.save()
            return render(request,'home/changepasswordrequest.html',{'message':'RIP:The link died a while ago.'})
        return render(request,'home/changepasswordrequest.html',{'form':form})

def addcollege(request):
    if request.method == "POST":
        form = college(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            now=datetime.datetime.now()
            return render(request,'coolefieds/index.html',{'current_date':now})
    else:
        form= college()
    return render(request,'home/addcollege.html', {'form':form})

def resetpasswordrequest(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    if request.method == "POST":
        form = reset_password(request.POST,request.FILES)
        if form.is_valid():
            if sendpasswordresetemail(request.POST['email']):
                return render(request,'home/resetpasswordrequest.html', {'message':'An Email has been sent to you. Follow the instructions to reset password!'})
            else:
                form= reset_password()
                return render(request,'home/resetpasswordrequest.html',{'message':'Email ID does not exist!','form':form})

    else:
        form= reset_password()
    return render(request,'home/resetpasswordrequest.html', {'form':form})

@login_required
def mainpage(request):
    Message=""
    Adverts=""
    try:
        if isEmailVerified(request.user.id)==False:
            Message+="Psst. Don't forget to confirm your email! Just look for the message we sent you."
    except:
        pass
    #count=profile.objects.filter(userid=request.user.id).count()
    try:
        UserCollege=request.user.profile.college
        Adverts=ad.objects.filter(college=UserCollege)
    except:
        return HttpResponseRedirect('addinfo')
    return render(request,'home/mainpage.html',{'user':request.user, 'Message':Message,'Adverts':Adverts})

@login_required
def addInformation(request):
    if request.method == "POST":
        form = addinformation(request.POST,request.FILES)
        if form.is_valid():
            m=form.save(commit=False)
            m.user=request.user
            m.save()
            return HttpResponseRedirect('/')
    else:
        form=addinformation()
    return render(request,'home/addinfo.html', {'form':form})



@login_required
def logout(request):
    """Logs out user"""
    auth_logout(request)
    return HttpResponseRedirect('/')

@login_required
def invite(request):
    if request.method== "POST":
        email=request.POST['email']
        message=request.POST['message']
        if invitefriend(email,message):
            return render(request, 'home/invite.html', {'message':'User Invited Successfully. Hope to see them here soon!'})
        else:
            return render(request, 'home/invite.html', {'message':'Failed'})
    else:
        return render(request, 'home/invite.html')

@login_required
def ad1(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        if request.method== "POST":
            print "reached here"
            form=ad_new(request.POST,request.FILES)
            form.userid = request.user.id
            print "it reached here "
            if form.is_valid():
                userinfo=request.user.profile
                collegeid=userinfo.college
                form.college=collegeid
                m=form.save()
                m.userid=request.user.id
                m.college=collegeid
                m.save()
                #b=ad.objects.get(userid=-1)
                #b.userid = request.user.id
                #b.save()
                print "it reached here also"
                return HttpResponseRedirect('/')
           
                
        else:
            #form=login_now(), {'form':form}
            form= ad_new()
        return render(request, 'home/add_ad.html',{'form':form})

@login_required
def feedback1(request):
    if request.method == "POST":
        form = feedback(request.POST,request.FILES)
        if form.is_valid():
            form.save()
            now=datetime.datetime.now()
            messages.success(request, 'Thanks for your Feedback. :) We\'ll surely look into it and be more awesome! ')
    else:
        form= feedback()
    return render(request,'home/feedback.html', {'form':form})

@login_required
def category(request,flag):
    Message=""
    if isEmailVerified(request.user.id)==False:
        Message+="Psst. Don't forget to confirm your email! Just look for the message we sent you."
    UserCollege=request.user.profile.college
    cat=-1;
    print flag
    if(flag=="sell"):
        cat=1
    elif(flag=="buy"):
        cat=0
    elif(flag=="rent"):
        cat=2
    if(cat!=-1):
        Adverts=ad.objects.filter(college=UserCollege).filter(category=cat)
    else:
        return HttpResponseRedirect('/')
    return render(request,'home/mainpage.html',{'user':request.user,'Message':Message,'Adverts':Adverts})

@login_required
def userprofile(request):
    #print request.user.id
    i=request.user.id
    #b=profile.objects.get(userid=request.user.id)
    b=request.user.profile
    print request.user.id
    print b.college
    c=User.objects.get(id=request.user.id)
    print "first name is " + c.first_name
    return render(request,'home/userprofile.html',{'b':b,'c':c})

@login_required
def search(request):
    if request.method == "POST":
        Message=""
        searchquery=request.POST['searchquery']
        if searchquery.lower() in ["buy","sell","rent"]:
            return HttpResponseRedirect('/category/'+searchquery.lower())
        if isEmailVerified(request.user.id)==False:
            Message="Psst. Don't forget to confirm your email! Just look for the message we sent you."
        UserCollege=profile.objects.get(userid=request.user.id).college
        Adverts=ad.objects.filter(college=UserCollege).filter(title__icontains=searchquery)
        if not Adverts:
            Message="No Result Found! :("
        return render(request,'home/mainpage.html',{'user':request.user, 'Message':Message,'Adverts':Adverts})
    else:
        return HttpResponseRedirect('/')

@login_required
def post(request,id):
    Message=""
    POST=ad.objects.get(id=id)
    if not POST:
        Message="Invalid URL"
    return render(request,'home/post.html',{'user':request.user, 'Message':Message, 'Post':POST})
