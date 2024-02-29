
from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from . calcul_func import *
from datetime import datetime
from django.http import HttpResponse,JsonResponse
from rest_framework.permissions import AllowAny
from django.db import connection

class UserlistForSelect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="SELECT u.id, u.user_name , u.last_name from syspointage_newuser as u  "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listuser=[]
       if data : 
        for obj in data:
           if obj[2] :
             listuser.append({"label":obj[1] +' '+ obj[2] ,"value":obj[0]})
           else : 
             listuser.append({"label":obj[1] ,"value":obj[0]})
       return JsonResponse(listuser, safe=False) 
class motiflistForSelect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="SELECT m.id  , m.motif  from syspointage_motif_abs as m "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listuser=[]
       if data : 
        for obj in data:
           listuser.append({"label":obj[1] ,"value":obj[0]})
       return JsonResponse(listuser, safe=False) 
   
class ListSite_ForSelect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="select s.nomsite,s.id  from syspointage_site as s"#select sites 
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listsSites=[]
       for obj in data:
           listsSites.append({"label":obj[0],"value":obj[1]})#remplir la liste of sites
       return JsonResponse(listsSites, safe=False)   
class user_equipe_ForSelect(APIView):
   permission_classes = [AllowAny]
   def get(self,request,idequipe,**kwargs):
       q="SELECT u.id, u.user_name , u.last_name from syspointage_newuser as u where equipe_id = %s"%idequipe
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listuser=[]
       if data : 
        for obj in data:
           listuser.append({"label":obj[1] +' '+ obj[2] ,"value":obj[0]})
       return JsonResponse(listuser, safe=False)      

class equipeselect(APIView):
   permission_classes = [AllowAny]
   def get(self,request,**kwargs):
       q="SELECT e.id, e.nomequipe from syspointage_equipe as e "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listuser=[]
       if data : 
        for obj in data:
           listuser.append({"label":obj[1] ,"value":obj[0]})
       return JsonResponse(listuser, safe=False)     

class managersbyid(APIView):
   permission_classes = [AllowAny]
   def get(self, request,dep ):
       cursor = connection.cursor()
       iddep=self.kwargs['dep']    
       cursor.execute("select nu.id , nu.user_name , nu.last_name  from syspointage_newuser as nu  inner join syspointage_arborescence_chefs as aw on nu.id = aw.newuser_id where aw.arborescence_id=%s"%(iddep))
       data = cursor.fetchall()
       json_data = []
       for obj in data:
          
                json_data.append({"value": obj[0], "label": obj[1] + obj[2]})
       return JsonResponse(json_data, safe=False)       