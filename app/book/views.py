# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from .models import *
from django.contrib.auth.models import User
from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse,HttpResponseRedirect,JsonResponse
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger
from django.db.models import Avg,F,ExpressionWrapper,fields
from constance import config
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from .forms import BookUploadForm
from .models import Book
from urllib import request
from django.core.files.storage import default_storage
from .models import *
from django.http import JsonResponse
from django.contrib import auth
from django.shortcuts import render
from django.template.loader import render_to_string



from django.http import HttpResponse,HttpResponseRedirect,JsonResponse
from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Avg,F,ExpressionWrapper,fields
from .models import Book
from constance import config

def book_reader(request,book_slug):
    file = request.FILES['file']
    file_path = default_storage.save('temp.fb2',file)
    book = get_object_or_404(Book, book_slug=book_slug)

    # есть ли книга в формате FB2.
    if book.file.url.endswith('.fb2'):
        # откр FB2 для чтения.
        with open(book.file.url, 'r', encoding='utf-8') as fb2_file:
           # Читаем содержимое файла FB2
            book_content = fb2_file.read()

     #  вью book_reader_fb2.html с содержимым файла FB2.
        return render(request, 'book/book_reader_fb2.html', {'book_content': book_content})
    else:
        # Если не в формате FB2
        return HttpResponse("Книга не в формате FB2..")

def user_profile(request):

    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]


    username=request.user.username
    user=get_object_or_404(User,username=username)
    user_books=Book.objects.filter(uploaded_by=user)
    user_book_files=[book.file for book in user_books]

    if request.method=='POST':
        form=BookUploadForm(request.POST,request.FILES)
        if form.is_valid():
            book=form.save(commit=False)
            book.uploaded_by=request.user
            book.save()
            form.save_m2m()
            return render(request,'book/user_profile.html',{
                'otziv':otziv,
                'futured_mini':futured_mini,
                'category':category,
                'username':username,
                'user':user,
                'user_books':user_books,
                'user_book_files':user_book_files,
                'form':form
            })
    else:
        form=BookUploadForm()

    return render(request,'book/user_profile.html',{
        'otziv':otziv,
        'futured_mini':futured_mini,
        'category':category,
        'username':username,
        'user':user,
        'user_books':user_books,
        'user_book_files':user_book_files,
        'form':form
    })


@login_required
def book_upload(request):
    if request.method=='POST':
        form=BookUploadForm(request.POST,request.FILES)

        if form.is_valid():
            book=form.save(commit=False)
            book.uploaded_by=request.user
            book.save()
            form.save_m2m()
            return redirect('user_profile')  # Redirect to the user profile or any other page
    else:
        form=BookUploadForm()
    return render(request,'book/book_upload.html',{'form':form})


def logout(request):
    auth_logout(request)
    return redirect('/')


def home(request):
    return render(request,'home.html')


def blog(request):
    blog=Blog.objects.filter(active=True,).order_by('-created_at')

    paginator=Paginator(blog,12)
    page=request.GET.get('page')
    try:
        blog=paginator.page(page)
    except PageNotAnInteger:
        blog=paginator.page(1)
    except EmptyPage:
        blog=paginator.page(paginator.num_pages)

    # авторизация под админом
    username=auth.get_user(request).username
    login_error=''
    if request.method=='POST' and 'autorization' in request.POST:
        username=request.POST.get('username',)
        password=request.POST.get('password',)
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponseRedirect('/')
        else:
            login_error='Пользователь не найден'

    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]

    response=render(request,'book/blog.html',{
        'blog':blog,
        'category':category,
        'otziv':otziv,
        'futured_mini':futured_mini,
        'username':username,
        'login_error':login_error,
        'config':config
    })
    return response


def blog_full(request,slug):
    # авторизация под админом
    username=auth.get_user(request).username
    login_error=''
    if request.method=='POST' and 'autorization' in request.POST:
        username=request.POST.get('username',)
        password=request.POST.get('password',)
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponseRedirect('/')
        else:
            login_error='Пользователь не найден'

    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]

    blog=get_object_or_404(Blog.objects.filter(active=True),slug=slug,)
    blog_r=Blog.objects.filter(active=True,).order_by('?')[:20]

    response=render(request,'book/blog_full.html',{
        'blog':blog,
        'blog_r':blog_r,
        'category':category,
        'otziv':otziv,
        'futured_mini':futured_mini,
        'username':username,
        'login_error':login_error,
        'config':config
    })
    return response





def prostopages(request,slug):
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]

    # авторизация под админом
    username=auth.get_user(request).username
    login_error=''
    if request.method=='POST' and 'autorization' in request.POST:
        username=request.POST.get('username',)
        password=request.POST.get('password',)
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponseRedirect('/')
        else:
            login_error='Пользователь не найден'

    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)

    prostopages=get_object_or_404(Prostopages.objects.filter(active=True),slug=slug,)

    response=render(request,'book/prostopages.html',{
        'prostopages':prostopages,
        'category':category,
        'futured_mini':futured_mini,
        'otziv':otziv,
        'username':username,
        'login_error':login_error,
        'config':config
    })
    return response


def book_cat(request,book_cat_slug):
    # book_cat_all = Book.objects.all()

    # book_cat = get_object_or_404(Book, book_cat_slug=book_cat_slug)
    # book = Book.objects.filter(active=True, kurs_cat=book_cat)

    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]

    book_cat=get_object_or_404(Book_cat.objects.filter(active=True,book_cat_slug=book_cat_slug))

    # tovar_all = Book.objects.filter(active=True, book_cat=book_cat).order_by('-created_at')

    tovar_all=Book.objects.filter(active=True,book_cat=book_cat).annotate(
        avg_rating=Avg('otzivbook__rayting_seredina'),
        rating_percentage=ExpressionWrapper(
            F('avg_rating') / 5 * 100,output_field=fields.DecimalField()
        )
    ).order_by('-created_at').distinct()

    paginator=Paginator(tovar_all,12)
    page=request.GET.get('page')
    try:
        tovar_all=paginator.page(page)
    except PageNotAnInteger:
        tovar_all=paginator.page(1)
    except EmptyPage:
        tovar_all=paginator.page(paginator.num_pages)

    # авторизация под админом
    username=auth.get_user(request).username
    login_error=''
    if request.method=='POST' and 'autorization' in request.POST:
        username=request.POST.get('username',)
        password=request.POST.get('password',)
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponseRedirect('/')
        else:
            login_error='Пользователь не найден'

    response=render(request,'book/book_cat.html',{
        'book_cat':book_cat,

        'tovar_all':tovar_all,
        'category':category,
        'otziv':otziv,
        'futured_mini':futured_mini,
        # 'book_cat_all':book_cat_all,
        # 'book_cat':book_cat,
        # 'tasks':tasks,
        'username':username,
        'login_error':login_error,
        'config':config
    })

    return response



def book_full_reader(request,book_cat_slug, book_slug):
    book=get_object_or_404(Book,book_slug=book_slug)
    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]

    # авторизация под админом
    username=auth.get_user(request).username
    login_error=''
    if request.method=='POST' and 'autorization' in request.POST:
        username=request.POST.get('username',)
        password=request.POST.get('password',)
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponseRedirect('/')
        else:
            login_error='Пользователь не найден'


    response=render(request,'book/book_full_reader.html',{
        'otziv':otziv,
       
        'futured_mini':futured_mini,
        'category':category,
        'book':book,
        'username':username,
        'login_error':login_error
    })
    return response


def book_full(request,book_cat_slug,book_slug):
    book=get_object_or_404(Book,book_slug=book_slug)

    book_dop=Book.objects.filter(active=True,book_cat=book.book_cat).order_by('?')[:20]
    otziv_book=OtzivBook.objects.filter(active=True,book=book)

    otziv=Otziv.objects.filter(active=True,)
    category=Book_cat.objects.filter(active=True,)
    futured_mini=Book.objects.filter(active=True,futured=True,).order_by('?')[:3]

    # авторизация под админом
    username=auth.get_user(request).username
    login_error=''
    if request.method=='POST' and 'autorization' in request.POST:
        username=request.POST.get('username',)
        password=request.POST.get('password',)
        user=auth.authenticate(username=username,password=password)
        if user is not None:
            auth.login(request,user)
            return HttpResponseRedirect('/')
        else:
            login_error='Пользователь не найден'

    if request.method=='POST' and 'otziv_add' in request.POST:
        text=request.POST.get('text')
        text2=request.POST.get('text2')
        text3=request.POST.get('text3')
        rating=request.POST.get('rating')
        rating2=request.POST.get('rating2')
        rating3=request.POST.get('rating3')
        book_id=request.POST.get('book_id')
        avtor_id=request.POST.get('avtor_id')

        print(request.POST)

        zakazchik=User.objects.get(id=avtor_id)
        book=Book.objects.get(id=book_id)

        review=OtzivBook(
            otziv_plus=text,
            otziv_minus=text2,opisanie=text3,
            rayting=rating,rayting2=rating2,
            rayting3=rating3,book=book,zakazchik=zakazchik)
        review.save()

        return JsonResponse({'message':'Отзыв сохранен успешно!'})

    rayting_sr=OtzivBook.objects.filter(
        active=True,book=book,).aggregate(Avg('rayting_seredina'))

    if rayting_sr['rayting_seredina__avg'] is not None:
        rayting_sr_int=rayting_sr['rayting_seredina__avg']
        # print(rayting_sr_int)
        rayting_sr_procent=round(rayting_sr_int / 5 * 100)
    else:
        rayting_sr_procent=''

    response=render(request,'book/book_full.html',{
        'otziv':otziv,
        'rayting_sr':rayting_sr,
        'book_dop':book_dop,
        'otziv_book':otziv_book,
        'futured_mini':futured_mini,
        'category':category,
        'book':book,
        'username':username,
        'login_error':login_error,
        'config':config
    })

    return response
