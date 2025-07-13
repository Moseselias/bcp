from django import forms
from .models import Message

class ReplyForm(forms.Form):
    reply_body = forms.CharField(
        widget=forms.Textarea(attrs={'rows':6}),
        label="Your Reply"
    )

class ContactForm(forms.ModelForm):
    class Meta:
        model  = Message

        fields = ['name', 'email', 'phone', 'body']

        labels = {
           'name': 'Full Name',
           'email': 'Email Address',
           'phone': 'Phone Number',
           'body': 'Message'
        }

        widgets = {
            'name': forms.TextInput(attrs={
                        'id': 'name',
                    }),
            'email': forms.EmailInput(attrs={
                        'id': 'email',
                    }),
            'phone': forms.TextInput(attrs={
                        'id': 'phone',
                    }),
            'body': forms.Textarea(attrs={
                        'id': 'message',
                        'name': 'message',
                        'class': 'reply-textarea',
                        'rows': 4,
                        'placeholder': 'Tell us about your automotive needs…'
                    }),
        }

