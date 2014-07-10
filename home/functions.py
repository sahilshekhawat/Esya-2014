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

from home.functions import *

import datetime,random,string

from home.models import *
from home.forms import *
from django.core.mail import send_mail


def sendverifymail(userid,email):
    ThisRandomString=''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(10))
    entry=emailverify()
    entry.userid=userid
    entry.randomstring=ThisRandomString
    entry.save()
    subject, from_email, to = 'Confirm Your Email Address', 'coolefieds@gmail.com', email
    text_content = 'This is a very important message.'
    html_content = "<p>Hi!<br>Thank you for signing up!</br>You are just one step away from completing the process.<br>Please <a href='http://www.coolefieds.com/verify/"+ThisRandomString+"'>go here</a> to complete the process.</p>"
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()

def isEmailVerified(uid):
    b=emailverify.objects.get(userid=uid)
    if b.isVerified == False:
        return False
    else:
        return True

def invitefriend(emails,message):
    emails=emails.split(",")
    Message=message
    subject, from_email = 'Checkout the Coolest Site in IIIT ever', 'coolefieds@gmail.com'
    text_content = 'Please go to http://www.coolefieds.com to see the best site in IIIT :P'
    html_content = "<p>Hi!<br>Check Out the new site <a href='www.coolefieds.com'>HERE</a><br>"+message+"</p>"
    msg = EmailMultiAlternatives(subject, text_content, from_email, emails)
    msg.attach_alternative(html_content, "text/html")
    try:
        msg.send()
    except:
        return False
    return True

def sendpasswordresetemail(Email):
    try:
        UserRequested=User.objects.get(email=Email)
    except:
        return False
    UserRequested=User.objects.get(email=Email)
    ThisRandomString=''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(22))
    entry=passwordresetrequest()
    entry.hashstring=ThisRandomString
    entry.userid=UserRequested.id
    entry.save()
    subject, from_email, to = 'Reset Password request', 'coolefieds@gmail.com', Email
    text_content = "To change your email please go to http://www.coolefieds.com/resetpassword/"+ThisRandomString+" . This will take you to a page where you can enter your new password"
    html_content = "<p>Hi "+UserRequested.username+"!<br>You have requested to change your password.</br>You can do it by going to .<br>Please <a href='http://www.coolefieds.com/resetpassword/"+ThisRandomString+"'>this link</a><br><br>This link will die after 24 hours.<If you were not the one who requested this. Please ignore this request.</p>"
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    return True
