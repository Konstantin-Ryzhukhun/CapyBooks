#coding: utf-8

from django.urls import path, re_path
from app.book import views
from .views import *

urlpatterns = [
    path('profile/', views.user_profile, name='user_profile'),
    path('blog/', views.blog, name='blog'),
    path('blog/<slug>/', views.blog_full, name='blog_full'),
    path('catalog/<book_cat_slug>/', views.book_cat, name='book_cat'),
    path('catalog/<book_cat_slug>/<book_slug>/', views.book_full, name='book_full'),
	path('catalog/<book_cat_slug>/<book_slug>/prewie/', views.book_full_reader, name='book_full_reader'),
    path('<slug>/', views.prostopages, name='prostopages'),
]
