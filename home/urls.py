from django.conf.urls import patterns, url

from home import views

urlpatterns = patterns('',
    url(r'^$',views.mainpage, name='Main'),
    url(r'^register$', views.register, name='register'),
    url(r'^login$', views.login, name='login'),
    url(r'^verify/(?P<mainstring>.+)/$', views.verifymail, name='Verify Email'),
)  
