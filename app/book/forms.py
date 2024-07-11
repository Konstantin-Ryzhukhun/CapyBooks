from django import forms 
from django.contrib.auth.models import User 
from django.contrib.auth.forms import UserCreationForm 
from django.core.exceptions import ValidationError 
from django.forms.fields import EmailField 
from django.forms.forms import Form 
from .models import Book
import os
from bs4 import BeautifulSoup

class book_reader:
    def __init__(self, file):
        self.file = file
        self.book = []
        with open(self.file, 'r', encoding='utf-8') as file:
            file = file.readlines()
            _book = []
            for line in file:
                _book.append(line.lstrip())
            for line in file:
                _book.append(line.replace('<p>', '').replace('</p>','\n'))
            for line in _book:
                self.book.append(line.strip('\n'))

    @property
    def get_description(self):
        _description = []
        for line in self.book:
            if line.startswith('<description>'):
                line_index = self.book.index(line)
                for line in self.book[line_index:]:
                    _description.append(line)
                    if line.startswith('</description>'):
                        break

        description = {}
        for line in _description:
            if line.startswith('<book-name>'):
                description['book-title'] = line.lstrip('<book-name>').rstrip('</book-name>')
            elif line.startswith('<book-title>'):
                description['book-title'] = line.lstrip('<book-title>').rstrip('</book-title>')
            elif line.startswith('<author>'):
                a = _description.index(line)
                for i in self.book[a:]:
                    if i.startswith('<first-name>'):
                        description['autor-first-name'] = i.lstrip('<first-name>').rstrip('</first-name>')
                    if i.startswith('<middle-name>'):
                        description['autor-middle-name'] = i.lstrip('<middle-name>').rstrip('</middle-name>')
                    if i.startswith('<last-name>'):
                        description['autor-last-name'] = i.lstrip('<last-name>').rstrip('</last-name>')
                    if i.startswith('</author>'):
                        break
            elif line.startswith('<annotation>'):
                annotation = []
                line_index = self.book.index(line)
                for line in self.book[line_index:]:
                    annotation.append(line)
                    if line.startswith('</annotation>'):
                        break
                description['annotation'] = ''.join(annotation).replace('<empty-line/>', '\n').replace('<annotation>', '').replace('</annotation>', '')

        return description

    def get_chapters_title(self):
        chapters = []
        for index, value in enumerate(self.book):
            if value.startswith('<title>'):
                a = {index : self.book[index+1].lstrip('<p>').rstrip('</p>').lstrip('strong>').rstrip('</strong')}
                chapters.append(a)

        return chapters
class BookUploadForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['name_block', 'book_slug', 'book_cat', 
                   
                     'image','image2', 
                     'opisanie_mini',
                    #  'price', 'old_price', 
                     'file']
        
        # opisanie_mini = forms.CharField(widget=forms.Textarea(attrs={
        #     'rows': 3,
        #     # 'cols': 80,
        #     'class' : 'form-control',
        # }))

        # name_block = forms.CharField(widget=forms.TextInput(attrs={
        #     'class' : 'form-control',
        # }))
        # book_slug = forms.CharField(widget=forms.TextInput(attrs={
        #     'class' : 'form-control',
        # }))


class UserForm(UserCreationForm):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)

    class Meta:
        model = User
        fields = ('first_name','last_name', 'username', 'email', 'password1' ,'password2' )



