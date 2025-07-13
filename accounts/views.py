from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.shortcuts import redirect, render

from .forms import StaffSignUpForm

class StaffLoginView(LoginView):
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True

    def form_valid(self, form):
        # on successful login
        messages.success(self.request, "Successful! Redirecting…")
        return super().form_valid(form)

    def form_invalid(self, form):
        # on failed login
        messages.error(self.request, "Login failed: Please check your credentials or wait for approval.")
        return super().form_invalid(form)

def signup(request):
    if request.method == 'POST':
        form = StaffSignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_staff  = True
            user.is_active = False
            user.save()
            messages.success(
                request,
                "Registration submitted! Await Admin's approval."
            )
            return redirect('accounts:login')
    else:
        form = StaffSignUpForm()
    return render(request, 'accounts/signup.html', {'form': form})




from django.http import Http404

def test_404(request):
    return render(request, '500.html', {})
    # raise Http404("Page not found on purpose")