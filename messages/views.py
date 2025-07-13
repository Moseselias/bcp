from django.shortcuts import render, redirect, get_object_or_404
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.utils import timezone

from .models import Message
from .forms import ContactForm, ReplyForm

def home(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            msg = form.save()
            # send notification to staff
            send_mail(
                subject=f"BilliCharlse - New message from {msg.name}",
                message=msg.body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=settings.EMAIL_NOTIFICATION_LIST,
            )
            return redirect('messaging:thank_you')
    else:
        form = ContactForm()
    return render(request, 'messages/index.html', {'form': form})


def thank_you(request):
    return render(request, 'messages/thank_you.html')

# @login_required
# def message_list(request):
#     show_all = request.GET.get('all') == '1'
#     qs = Message.objects.all() if show_all else Message.objects.exclude(status='deleted')
#     return render(request, 'messages/messages-dashboard.html', {'messages': qs})

@login_required
def message_list(request):
    show_all = request.GET.get('all') == '1'
    if show_all:
        qs = Message.objects.order_by('-submitted_at')
    else:
        qs = Message.objects.exclude(status='deleted').order_by('-submitted_at')

    return render(request, 'messages/messages-dashboard.html', {'messages': qs, 'show_all': show_all,})

# @login_required
# def message_detail(request, pk):
#     msg = get_object_or_404(Message, pk=pk)
#     return render(request, 'messages/message_detail.html', {'message': msg})

@login_required
def message_detail(request, pk):
    msg = get_object_or_404(Message, pk=pk)
    form = ReplyForm() # new

    # ── Auto-mark “new” → “read” on first human view
    if msg.status == 'new':
        msg.status = 'read'
        msg.save(update_fields=['status'])

    return render(request, 'messages/message-detail.html', {'message': msg, 'form': form,})


@login_required
def message_delete(request, pk):
    msg = get_object_or_404(Message, pk=pk)
    msg.soft_delete()
    return redirect('messages:message_list')

@login_required
def message_reply(request, pk):
    msg = get_object_or_404(Message, pk=pk)
    if request.method == 'POST':
        form = ReplyForm(request.POST)
        if form.is_valid():
            reply_body = form.cleaned_data['reply_body']
            # Build combined message
            full_body = (
                f"Hello {msg.name},\n\n"
                "Thank you for contacting us. Below is a copy of your original message:\n\n"
                f"――――――――――――――――――――\n"
                f"{msg.body}\n"
                "――――――――――――――――――――\n\n"
                "Our teams reply:\n\n"
                f"{reply_body}\n\n"
                "Best regards,\n"
                "Bill Charles Limited."
            )
            # send reply email
            send_mail(
                subject=f"Re: Your inquiry at Bill Charles Limited",
                message=full_body,
                from_email=settings.DEFAULT_FROM_REPLY_EMAIL,
                recipient_list=[msg.email],
            )
            # Update the message object
            msg.reply_body = reply_body
            msg.replied_at  = timezone.now()
            msg.status      = 'replied'
            msg.save(update_fields=['reply_body', 'replied_at', 'status'])

            return redirect('messages:message_detail', pk=pk)
    else:
        form = ReplyForm()

    return render(request, 'messages/message_reply.html', {'message': msg, 'form': form})