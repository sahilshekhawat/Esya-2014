#from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
#from django.contrib import admin
#admin.autodiscover()

    #urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'coolefieds.views.home', name='home'),
    # url(r'^coolefieds/', include('coolefieds.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    #url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
#url(r'^admin/', include(admin.site.urls)),
#)


from django.conf.urls import patterns, include, url
from coolefieds import views
from coolefieds.views import *
from home.views import *
from django.conf.urls.static import static
import settings


from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', views.index1),
    #url(r'^$', mainpage),
    url(r'^logout$', logout),
    url(r'^search$', search),
    url(r'^register$', registerpage),
    url(r'^invite$', invite),
    url(r'^addcollege$', addcollege),
    url(r'^verify/(?P<mainstring>.+)/$', verifymail),
    url(r'^add-ad$',ad1),
    url(r'^feedback$',feedback1),
    url(r'^category/(?P<flag>.+)$',category),
    url(r'^category/$',mainpage),
    url(r'^forgotpassword$',resetpasswordrequest),
    url(r'^resetpassword/(?P<flag>.+)$',changepasswordrequest),
    url(r'^userprofile$',userprofile),
    url(r'^post/(?P<id>.+)$',post),
    url(r'^post$',mainpage),
    url(r'', include('social_auth.urls')),
    url(r'^login$', loginpage),
    url(r'^ajaxlogin/$', ajaxlogin),
    url(r'^ajaxregister/$', ajaxregister),
    url(r'^addinfo$', addInformation),
    url(r'^ajaxlogout/$', ajaxlogout),
    #url(r'^register$', include('home.urls',namespace="registration")),
    #url(r'^index$', views.index1),
    url(r'^allevents$', views.allevents),
    url(r'^individualevents', views.individualevents),
    url(r'^eventregister)', views.eventregister),
)