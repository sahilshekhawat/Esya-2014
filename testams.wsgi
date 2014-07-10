import os
import sys
sys.path.append('/home/ubuntu/coolefieds/coolefieds/')
sys.path.append('/home/ubuntu/coolefieds/')
sys.path.append('/home/ubuntu/coolefieds/static')
os.environ['DJANGO_SETTINGS_MODULE'] = 'coolefieds.settings'
import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
