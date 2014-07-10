from django import forms

from django.forms.widgets import *
from home.models import *

from django.contrib.auth.models import User


colleges = [(-1,'Select you college'),(0,'IIIT-D')]
TYPE = (
        (0,'Buy'),
        (1,'Sell'),
        (2,'rent'),
        )

b=college.objects.all()
for i in b:
    if i.isactive:
        colleges+=[(i.id,i.CollegeName)]

class register_new(forms.ModelForm):
    username = forms.CharField(widget=forms.TextInput(attrs = {'size':'40','class':'form-control'}))
    first_name= forms.CharField(widget=forms.TextInput(attrs = {'size':'40','class':'form-control'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs = {'size':'40','class':'form-control'}))
    email = forms.EmailField(widget=forms.TextInput(attrs = {'class':'form-control'}))
    college = forms.ChoiceField(choices=colleges)
    password = forms.CharField(widget=forms.PasswordInput(attrs = {'class':'form-control'}))
    mobile=forms.CharField(widget=forms.TextInput(attrs = {'class':'form-control', 'maxlength':'10'}));
    #retype_password = forms.CharField(widget=forms.PasswordInput)
    profile_pic = forms.ImageField(required=False)

    def clean_username(self):
        uname = self.cleaned_data['username']
        unamecount=User.objects.filter(username=uname).count()
        if unamecount!=0:
            raise forms.ValidationError("Username already exists")
    class Meta:
        model = profile
        fields = ('username','first_name','last_name','email','password','college','mobile', 'profile_pic')


class addinformation(forms.ModelForm):
    college = forms.ChoiceField(choices=colleges)
    #retype_password = forms.CharField(widget=forms.PasswordInput)
    profile_pic = forms.ImageField(required=False)
    mobile=forms.CharField(widget=forms.TextInput(attrs = {'class':'form-control', 'maxlength':'10'}));

    class Meta:
        model = profile
        fields = ('college','profile_pic')

class login_now(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs = {'class':'form-control','placeholder':'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs = {'class':'form-control','placeholder':'Password'}))
#    class Meta:
#        model = register

class ad_new(forms.ModelForm):
    title= forms.CharField(required=True,widget=forms.TextInput(attrs = {'size': 50,'class':'form-control'}))

    photo = forms.ImageField()
    description = forms.CharField(widget=forms.Textarea(attrs = {'class':'form-control'}))
    price = forms.CharField(widget=forms.TextInput(attrs = {'class':'form-control'}))
    category = forms.ChoiceField(choices = TYPE)
    class Meta:
        model = ad
        fields = ('title','photo','description','price','category')
    
    
class college(forms.ModelForm):
    CollegeName = forms.CharField(widget=forms.TextInput(attrs = {'size':'40'}))        
    class Meta:
        model = college
        #widget={'isactive': HiddenInput()}]
        fields=('CollegeName',)

class feedback(forms.ModelForm):
	subject= forms.CharField(widget=forms.TextInput(attrs = {'size': 30 ,'class' : 'form-control'}))	
	message= forms.CharField(widget=forms.Textarea(attrs = {'class' : 'form-control'}))
  	email = forms.EmailField(widget=forms.TextInput(attrs = {'class':'form-control'}))
	class Meta:
		model = feedback
		fields = ('subject','message','email')

class reset_password(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs = {'class':'form-control'}))

class change_password(forms.Form):
    password = forms.CharField(widget=forms.PasswordInput(attrs = {'class':'form-control'}))
    retype_password = forms.CharField(widget=forms.PasswordInput(attrs = {'class':'form-control'}))