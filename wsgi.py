import os
import sys
sys.path.append('/home/ubuntu/coolefieds/')
sys.path.append('/home/ubuntu/coolefieds/coolefieds/')
sys.path.append('/home/ubuntu/coolefieds/home/')
sys.path.append('/home/ubuntu/coolefieds/home/static/')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "coolefieds.settings")

# This application object is used by the development server
# as well as any WSGI server configured to use this file.
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
