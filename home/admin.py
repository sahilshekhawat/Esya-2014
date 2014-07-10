from django.contrib import admin
from home.models import profile, emailverify, ad, college
from home.models import feedback, passwordresetrequest
from home.models import EventCategory, Event, Registration

admin.site.register(Event)
admin.site.register(EventCategory)
admin.site.register(ad)
admin.site.register(emailverify)
admin.site.register(profile)
admin.site.register(Registration)
admin.site.register(feedback)
admin.site.register(college)
admin.site.register(passwordresetrequest)