
from django.http import HttpRequest, HttpResponse
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import User
from django.urls import resolve
from syspointage.models import NewUser

from syspointage.serializers import LogSerializer
class Refermiddle(object):

    def __init__(self, get_response):
        
        self.get_response = get_response

    def __call__(self, request):
        r=self.get_response(request)
        
           
        
        if  "Authorization" in request.headers.keys():
            if request.path_info=='/api/token/':
               tokkeen= r.data['access']
            else:
               tokkeen = request.headers['Authorization'].replace('Bearer ' , '')
            
            access_token_obj = AccessToken(tokkeen)
            userr=NewUser.objects.filter(id= access_token_obj['id']).values('matricule','user_name','last_name')[0]
            matricule=userr.get('matricule')
            nomprenom=str(userr.get('user_name'))+" "+str(userr.get('last_name'))

            data={}
            data['name_path']=resolve(request.path_info).url_name
            data['path_info']=request.path_info
            data['host']=request.META.get('HTTP_X_FORWARDED_FOR', '')
            data['method']=request.META['REQUEST_METHOD']
            data['matricule']=matricule
            data['nomprenom']=nomprenom
            serializer = LogSerializer(data=data)
            
            if serializer.is_valid():
                log = serializer.save()
             
                if log:
                    json = serializer.data
              

        elif request.user : 
           print(request.user) 
        else:
            pass

        
        
        return r


