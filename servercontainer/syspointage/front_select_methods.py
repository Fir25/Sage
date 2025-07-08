
from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from . calcul_func import *
from datetime import datetime
from django.http import HttpResponse,JsonResponse
from rest_framework.permissions import AllowAny
from django.db import connection
class ligneselect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="SELECT id, lignename from syspointage_ligne "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listligne=[]
       if data : 
        for obj in data:
          
             listligne.append({"label":obj[1] ,"value":obj[0]})
        return JsonResponse(listligne, safe=False) 
class superviseurselect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="SELECT id, superviseurname from syspointage_superviseur "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listsuperviseur=[]
       if data : 
        for obj in data:
          
             listsuperviseur.append({"label":obj[1] ,"value":obj[0]})
        return JsonResponse(listsuperviseur, safe=False) 
class skillselect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="SELECT id, skillname from syspointage_skill "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listskill=[]
       if data : 
        for obj in data:
          
             listskill.append({"label":obj[1] ,"value":obj[0]})
        return JsonResponse(listskill, safe=False)
class SuperviseurDelete(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, id):
        """
        Supprime un superviseur par son ID.
        """
        try:
            cursor = connection.cursor()
            q = "DELETE FROM syspointage_superviseur WHERE id = %s RETURNING id"
            cursor.execute(q, [id])
            deleted_id = cursor.fetchone()

            if deleted_id:
                return JsonResponse({"message": "Superviseur supprimé avec succès."}, status=200)
            else:
                return JsonResponse({"error": "Superviseur non trouvé."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
class SkillDelete(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, id):
        """
        Supprime un skil par son ID.
        """
        try:
            cursor = connection.cursor()
            q = "DELETE FROM syspointage_skill WHERE id = %s RETURNING id"
            cursor.execute(q, [id])
            deleted_id = cursor.fetchone()

            if deleted_id:
                return JsonResponse({"message": "Skill supprimé avec succès."}, status=200)
            else:
                return JsonResponse({"error": "Skill non trouvé."}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
class UserlistForSelect(APIView):
   permission_classes = [AllowAny]
   def get(self,request):
       q="SELECT u.id, u.user_name , u.last_name , u.matricule from syspointage_newuser as u  "
       cursor = connection.cursor()
       cursor.execute(q)
       data = cursor.fetchall()  
       listuser=[]
       if data : 
        for obj in data:
           if obj[2] :
             listuser.append({"label":obj[1] +' '+ obj[2] + ' ' + obj[3],"value":obj[0]})
           else : 
             listuser.append({"label":obj[1] + ' ' + obj[3] ,"value":obj[0]})
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