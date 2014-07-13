import sys
# Django settings for coolefieds project.
import os.path
PROJECT_DIR = os.path.dirname(__file__)
path = sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

DEBUG = True
TEMPLATE_DEBUG = DEBUG


ADMINS = (
     ('Aman Chahar', 'amaniiitd@gmail.com'),
     ('sahil', 'sahilshekhawat01@gmail.com')
)

EMAIL_HOST='smtp.gmail.com'
EMAIL_PORT='587'
EMAIL_HOST_USER='coolefieds@gmail.com'
EMAIL_HOST_PASSWORD='amanchahar'
EMAIL_USE_TLS=True

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'C:/Users/win 8/Pictures/esy/prac.db',                      # Or path to database file if using sqlite3.
        # The following settings are not used with sqlite3:
        'USER': '',
        'PASSWORD': '',
        'HOST': '', # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '', # Set to empty string for default.
    }
}

LOGIN_URL          = '/login'
LOGIN_REDIRECT_URL = '/'
LOGIN_ERROR_URL    = '/error/'


# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ['www.coolefieds.com','coolefieds.com']

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'Asia/Kolkata'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = 'home/templates/home'

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATIC_ROOT = ''

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"

STATIC_URL = '/s/'

# Additional locations of static files
STATICFILES_DIRS = ( 'C:/Users/win 8/Pictures/Esya-2014/home/static/home',

    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
)

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
#    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
SECRET_KEY = '_-h8c9%sxn^!i0hst-7&g2#ik*er$*6z(*5&$owo431if1f^+%'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
                    
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    #'django_ajax.middleware.AJAXMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'coolefieds.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'coolefieds.wsgi.application'

TEMPLATE_DIRS = (
                 '/home/ubuntu/coolefieds/coolefieds/templates/',
                 '/home/sid/coolefieds/coolefieds/templates/',
                 '/Users/chahar/Documents/IIIT-D/3rd Year/Software Engineering/coolefieds/coolefieds/templates/',
                 os.path.join(PROJECT_DIR, '../templates'),
    # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    # For Anant  '/home/anant/coolefieds/coolefieds/templates/',
    # For Sid  '/home/sid/coolefieds/coolefieds/templates/',
    # For shivangi '/home/shivangi/coolefieds/coolefieds/templates/',
    # For Aman '/Users/chahar/Documents/IIIT-D/3rd Year/Software Engineering/coolefieds/coolefieds/templates/',
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
	'home',
    'social_auth',
)

LOGIN_URL = '/login'
LOGIN_ERROR_URL = '/login-error/'

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

AUTHENTICATION_BACKENDS = (
  'social_auth.backends.google.GoogleOAuth2Backend',
  'social_auth.backends.contrib.github.GithubBackend',
  'django.contrib.auth.backends.ModelBackend',
  'social_auth.backends.facebook.FacebookBackend',
  'social_auth.backends.twitter.TwitterBackend',

)

TEMPLATE_CONTEXT_PROCESSORS = (
  "social_auth.context_processors.social_auth_by_type_backends",
  'django.contrib.auth.context_processors.auth',
  'django.core.context_processors.static'
)

SOCIAL_AUTH_DEFAULT_USERNAME = 'new_social_auth_user'
SOCIAL_AUTH_UID_LENGTH = 256
SOCIAL_AUTH_ASSOCIATION_HANDLE_LENGTH = 64
SOCIAL_AUTH_NONCE_SERVER_URL_LENGTH = 64
SOCIAL_AUTH_ASSOCIATION_SERVER_URL_LENGTH = 64
SOCIAL_AUTH_ASSOCIATION_HANDLE_LENGTH = 64

SOCIAL_AUTH_ENABLED_BACKENDS = ('google','facebook','twitter')

GOOGLE_OAUTH2_CLIENT_ID = '376421605037.apps.googleusercontent.com'
GOOGLE_OAUTH2_CLIENT_SECRET = 'KmIPhqhZ-qqmvPb3vId3sl74'

FACEBOOK_APP_ID = '738101539537117'
FACEBOOK_API_SECRET = '39cd71a310082748b5107991ce20eb1f'

TWITTER_CONSUMER_KEY = 'cwvRSkLjqGp9fe41iiOXA'
TWITTER_CONSUMER_SECRET = '0RZKHlN28L3ywoy5KhXpuSq407sh89S0Zzo04NQhKds'

FACEBOOK_EXTENDED_PERMISSIONS = ['email']

SOCIAL_AUTH_PIPELINE = (
    'social_auth.backends.pipeline.social.social_auth_user',
    'social_auth.backends.pipeline.associate.associate_by_email',
    'social_auth.backends.pipeline.user.get_username',
    'social_auth.backends.pipeline.user.create_user',
    'social_auth.backends.pipeline.social.associate_user',
    'social_auth.backends.pipeline.social.load_extra_data',
    'social_auth.backends.pipeline.user.update_user_details'
)
