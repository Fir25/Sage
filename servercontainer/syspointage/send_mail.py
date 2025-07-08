
from django.core.mail import send_mail
import threading    
from pointage import settings

def send_email_template(subject, message, recipient_list ):
   def send():
    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list, fail_silently=False , html_message="<p style='line-height: 300%;'>"+str(message)+"<br>IPS Time</p>")
   thread = threading.Thread(target=send)
   thread.start()