"""
Django settings for healthcare_project project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
from rest_framework.settings import api_settings

load_dotenv()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG')

ALLOWED_HOSTS = ['*']

# Allows interaction between the frontend and backend
CORS_ALLOWED_ORIGINS = [ 
    'http://localhost:3000',
    'http://10.50.0.197:3000'
]

CORS_ALLOWED_CREDENTIALS = True

CORS_ALLOW_ALL_ORIGINS = True
CORS_ORIGIN_ALLOW_ALL = True


# Application definition
INSTALLED_APPS = [
    'django_celery_beat',
    'jazzmin',
    'channels',
    'django.contrib.admin',
    'chat',
    'HealthManagementApp',
    'daphne',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework.authtoken',
    'djoser',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'drf_spectacular',
    "django_celery_results",

]



MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'csp.middleware.CSPMiddleware',  

]

# Content Security Policy - Prevent Cross Site Scripting (XSS) attacks
CSP_DEFAULT_SRC = ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net")
CSP_IMG_SRC = ("'self'", "data:", "'unsafe-inline'", "cdn.jsdelivr.net")
CSP_STYLE_SRC = ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net")
CSP_FRAME_SRC = ("'self'", "www.nhs.uk")


ROOT_URLCONF = 'healthcare_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join( BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'healthcare_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': os.getenv('DB_NAME'),
#         'USER': os.getenv('DB_USER'),
#         'PASSWORD': os.getenv('DB_PASSWORD'),
#         'HOST': os.getenv('DB_HOST'),
#         'PORT': os.getenv('DB_PORT'),
#     }
# }

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db1.sqlite3',
    }
}


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.environ.get('EMAIL_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD')
EMAIL_USE_TLS = True

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'jazzmin'),

]

# Media files (User-uploaded content)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'knox.auth.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',

        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],

    'DEFAULT_RENDERER_CLASSES': ('rest_framework.renderers.JSONRenderer',),
    'DEFAULT_PARSER_CLASSES': ('rest_framework.parsers.JSONParser',),

    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    # 'EXCEPTION_HANDLER': 'healthcare_project.HealthManagementApp.views.custom_exception_handler',

}
SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Django-React Healthcare App',
    'DESCRIPTION': 'Management application for type 2 diabetics',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    
}

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'HealthManagementApp.CustomUser'
DOMAIN = "localhost:3000"
SITE_NAME = "localhost:3000"

DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'auth/setPassword/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': '#/username/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': '#/activate/{uid}/{token}',
    'password_changed_confirmation': 'djoser.email.PasswordChangedConfirmationEmail',
    'SEND_ACTIVATION_EMAIL': True,
    "EMAIL": {
        # 'password_reset': 'HealthManagementApp.emails.password_reset',
        # "activation": "api.api_accounts.serializers.ActivationEmail",
        #         "confirmation": "djoser.email.ConfirmationEmail",
        #         # "password_reset": "api.api_accounts.serializers.PasswordResetEmail",
        #         "password_changed_confirmation": "djoser.email.PasswordChangedConfirmationEmail",
        #         "username_changed_confirmation": "djoser.email.UsernameChangedConfirmationEmail",
        #         "username_reset": "djoser.email.UsernameResetEmail",
    },
    # 'TEMPLATES': {
    #     'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': True,  # Optional: Show or not show the email not found error
    # },
    # "EMAIL": {
    #     "activation": "HealthManagementApp.Te",
    #
    # },
    # 'TOKEN_MODEL': 'knox.models.AuthToken',
    'SERIALIZERS': {
        'token_create': 'HealthManagementApp.serialisers.CustomTokenCreateSerializer',

    },

}

ASGI_APPLICATION = "healthcare_project.asgi.application"


CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)],
        },
    },
}


JAZZMIN_SETTINGS = {
    "site_title": "GlucoCare Admin",
    "site_header": "GlucoCare",
    "site_brand": "GlucoCare",
    "login_logo": None,
    "login_logo_dark": None,
    "site_logo_classes": "img-circle",
    "site_icon": None,
    "welcome_sign": "Admin Access Portal",
    "search_model": ["auth.User", "auth.Group"],
    "user_avatar": None,

    "topmenu_links": [

        # Url that gets reversed (Permissions can be added)
        {"name": "Home",  "url": "admin:index", "permissions": ["auth.view_user"]},

        # model admin to link to (Permissions checked against model)
        {"model": "auth.User"},

    ],

    # Additional links to include in the user menu on the top right ("app" url type is not allowed)
    "usermenu_links": [
        {"model": "auth.user"}
    ],

    "show_sidebar": True,

    "navigation_expanded": True,
    "hide_apps": [],

    "hide_models": [],

    # List of apps (and/or models) to base side menu ordering off of (does not need to contain all apps/models)
"order_with_respect_to": [
    "HealthManagement.CustomUser",
    "auth.Group",
    "auth.User",
    "HealthManagementApp.patient",  
    "HealthManagementApp.appointment",
    "HealthManagementApp.prescription",
    "HealthManagementApp.supportinquiry",
    "HealthManagementApp.doctor", 
    "HealthManagementApp.MedicalLicense",
    "HealthManagementApp.WeeklyAvailability",
    "HealthManagementApp.TimeSlot",
    "HealthManagementApp.Section",
    "HealthManagementApp.Field",
    "HealthManagementApp.FieldChoice",
    "HealthManagementApp.Form",
    "HealthManagementApp.Symptoms",
    "HealthManagementApp.Tests",
    "HealthManagementApp.Vitals",
    "HealthManagementApp.Diagnoses",
    "HealthManagementApp.Histories",
    "HealthManagementApp.Advices",
    "HealthManagementApp.FollowUps",
    "HealthManagementApp.Prescription",

    "books.author",
    "books.book",
  ],
    "custom_links": {
    "HealthManagementApp": [
        {
            "name": "Manage Doctors",
            "url": "admin:HealthManagementApp_doctor_changelist",
            "icon": "fas fa-user-md",
            "permissions": ["HealthManagementApp.view_doctor"]
        },
        {
            "name": "Manage Patients",
            "url": "admin:HealthManagementApp_patient_changelist",
            "icon": "fas fa-user-injured",
            "permissions": ["HealthManagementApp.view_patient"]
        },
    ]
},
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user",
        "auth.Group": "fas fa-users",
        "default_icon_parents": "fas fa-chevron-circle-right",
        "default_icon_children": "fas fa-circle",
        "HealthManagementApp.CustomUser": "fas fa-user",
        "HealthManagementApp.doctor": "fas fa-user-md",
        "HealthManagementApp.patient": "fas fa-user-injured",
        "HealthManagementApp.supportinquiry": "fas fa-question-circle",
        "chat.message": "fas fa-envelope",
        "HealthManagementApp.MedicalLicense": "fas fa-id-card",
        "HealthManagementApp.Section": "fas fa-list",
        "HealthManagementApp.Field": "fas fa-list",
        "HealthManagementApp.FieldChoice": "fas fa-list",
        "HealthManagementApp.Form": "fas fa-file-alt",
        "HealthManagementApp.Symptoms": "fas fa-notes-medical",
        "HealthManagementApp.Tests": "fas fa-vials",
        "HealthManagementApp.Vitals": "fas fa-heartbeat",
        "HealthManagementApp.Diagnoses": "fas fa-diagnoses",
        "HealthManagementApp.Histories": "fas fa-history",
        "HealthManagementApp.Advices": "fas fa-comment-medical",
        "HealthManagementApp.FollowUps": "fas fa-calendar-check",
        "HealthManagementApp.Prescription": "fas fa-prescription-bottle-alt",

        "chat.message": "fas fa-envelope",
        "HealthManagementApp.PatientAppointment": "fas fa-calendar-alt",
        "HealthManagementApp.DoctorAppointment": "fas fa-calendar-alt",
        "HealthManagementApp.WeeklyAvailability": "fas fa-calendar-alt",
        "HealthManagementApp.TimeSlot": "fas fa-clock",
        "HealthManagementApp.location": "fas fa-map-marker-alt",
        
    },

    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
  
    "related_modal_active": False,

    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,

    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {"auth.user": "collapsible", "auth.group": "vertical_tabs"},
    "language_chooser": False,
}

DEFAULT_FROM_EMAIL = 'Celery <ngalahd@gmail.com>'
CELERY_BROKER_URL = 'redis://127.0.0.1:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Europe/London'
CELERY_RESULT_BACKEND = 'django-db'
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
