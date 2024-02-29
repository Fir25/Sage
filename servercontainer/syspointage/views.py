from rest_framework import generics
from django.http import HttpResponse,JsonResponse
from syspointage.resources import EmployeResource
from .models import *
from rest_framework.permissions import AllowAny
from syspointage.serializers import *
from django.core.mail import send_mail
from pointage import settings
from itertools import chain
from rest_framework.response import Response 
from rest_framework.views import APIView
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Prefetch
from django.core import serializers
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenVerifyView)
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer)
from django.db.models import Q
from rest_framework.permissions import AllowAny 
from django.db.models import F
import json
from datetime import date, timedelta
from datetime import datetime
import calendar
import itertools
from django.core.cache import cache
from datetimerange import DateTimeRange
from dateutil.relativedelta import relativedelta
import threading    
import time 
from schedule import Scheduler
from dateutil import rrule
from rest_framework.permissions import AllowAny 
import jwt
import xlwt
from django.utils.html import format_html
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.template import loader
from django.utils import timezone, dateparse
import threading
from . calcul_func import * 
from . rapport_journalier import Rapportunjour 
from . rapport_mensuel import rapportmensul
from . send_mail import send_email_template
from . valideurs_emails import get_validators_for_conge_and_department
class UsersOfChef(generics.ListAPIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        listEmployes=[]
        a=arborescence.objects.values().all()#get list of departments
        u=False
        c=NewUser.objects.select_related('role').filter(role__DRH=True,id=self.kwargs['pk'])#quand utilisateur est connecté est un DRH  =>c est non vide
        pp=NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['pk'])#quand utilisateur est connecté est un admin => utilisateur est non vide 
        if pp or c :# admin or DRH
                 #select all employees 
                 querr="SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.email,u.datedemarrage,u.last_name,u.activite ,s.nomsite,is_active , u.sex , u.matriculecnss ,u.datedemarrage,  u.datedenaissance,u.CIN, u.nbEnfants, u.tel,u.commentaire, u.situation_sociale, u.teletravail,u.activite, u.matriculepaie, u.solde from syspointage_newuser as u left join syspointage_role as r on r.id=u.role_id  left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on a.id=ua.arborescence_id LEFT JOIN syspointage_site as s on s.id=u.site_id"
                 #is_active=1 c'a dire emlpoyés non partis ont un compte active
                 ccc=connection.cursor()
                 ccc.execute(querr)
                 employes=ccc.fetchall()
                 json_data = []
                 for objj in employes:
                      #remplir la liste d'employés 
                    json_data.append({"matricule":objj[0],"user_name":objj[1],"role":objj[2],"Nomarbo":objj[3],'id':objj[4],"email":objj[5],"datedemarrage":objj[6],"last_name":objj[7],"activite":objj[8],"site":objj[9],"is_active":objj[10],"sex":objj[11],"matriculecnss":objj[12],"datedemarrage":objj[13],"datedenaissance":objj[14],"CIN":objj[15],"nbEnfants":objj[16],"tel":objj[17],"commentaire":objj[18],"situation_sociale":objj[19],"teletravail":objj[20],"activite":objj[21],"matriculepaie":objj[22] , "solde":objj[23]})
                 listEmployes.extend(list(json_data))
                
                 return JsonResponse(listEmployes, safe=False)
        else:
          
      
                  
                     #query pour parccourir la liste children of departement
                     query = 'SELECT u.matricule,u.user_name,r.rolename,a.nom,u.id,u.email,u.datedemarrage,u.last_name,u.activite ,s.nomsite,is_active , u.sex , u.matriculecnss ,u.datedemarrage,  u.datedenaissance,u.CIN, u.nbEnfants, u.tel,u.commentaire, u.situation_sociale, u.teletravail,u.activite, u.matriculepaie, u.solde FROM syspointage_newuser AS u LEFT JOIN   syspointage_role AS r ON r.id = u.role_id LEFT JOIN syspointage_newuser_arborescence AS ua ON ua.newuser_id = u.id LEFT JOIN syspointage_arborescence AS a ON a.id = ua.arborescence_id LEFT JOIN syspointage_arborescence_chefs AS uo ON a.id = uo.arborescence_id LEFT JOIN syspointage_site as s on s.id=u.site_id WHERE uo.newuser_id= %s'%pk
                  
                     cursor = connection.cursor()
                     cursor.execute(query)
                     data = cursor.fetchall()
                     json_data=[]
                     for objj in data:
                           #remplir la liste des employés dans département et sous départements
                           json_data.append({"matricule":objj[0],"user_name":objj[1],"role":objj[2],"Nomarbo":objj[3],'id':objj[4],"email":objj[5],"datedemarrage":objj[6],"last_name":objj[7],"activite":objj[8],"site":objj[9],"is_active":objj[10]})
                     listEmployes.extend(list(json_data))  
        return JsonResponse(listEmployes, safe=False)
class EmployesPartis(generics.ListAPIView):
  queryset=NewUser.objects.filter(is_active=False).all()#is_active false==>utilisateur non connecté=> employé parti 
  serializer_class=CustomUserSerializer
  permission_classes = [AllowAny]

class QuitterEmploye(generics.RetrieveUpdateAPIView):
  def get(self,request,**kwargs):
      NewUser.objects.filter(id=kwargs['id']).update(is_active=False,motifparti=kwargs['motif'])#modification is_active=false=> utilisateur non connecté=>utilisateur parti
      return JsonResponse({"status":"success"}, safe=False)      
class SetEquipeView(APIView):
    def post(self, request):
        user_ids = request.data.get('userIds', [])  # Use request.data to access JSON data
        equipe_id = request.data.get('equipeId')

        # Delete the existing team for the given equipe_id
        NewUser.objects.filter(equipe_id=equipe_id).update(equipe=None)

        users = NewUser.objects.filter(id__in=user_ids)
        equipe = Equipe.objects.get(id=equipe_id)

        for user in users:
            user.equipe = equipe
            user.save()

        # Return a response if needed
        return Response({"message": "Equipe updated successfully"})
       
class UsersOfDepartement(APIView):
    permission_classes = [AllowAny]

    def get(self, request, **kwargs):
        listEmployes = []
        listids = request.query_params.getlist('id')[0].split(',')
        activite = request.query_params.getlist('idactivite')[0].split(',')

        for idd in listids:
            if idd:
                idarboresence = int(idd)
                query = 'WITH children AS (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id' % str(idarboresence)

                cursor = connection.cursor()
                cursor.execute(query)
                data = cursor.fetchall()

                for obj in data:
                    if activite and any(activite):  # Check if activite is not empty and contains non-None values
                        quer = "SELECT u.user_name, u.id, u.last_name, u.email, u.datedemarrage, u.activite, u.site_id FROM syspointage_newuser_arborescence AS ua, syspointage_arborescence AS a, syspointage_newuser AS u LEFT JOIN syspointage_role AS r ON r.id=u.role_id WHERE ua.arborescence_id=%s AND ua.newuser_id=u.id AND a.id=ua.arborescence_id AND u.activite IN (%s)" % (str(int(''.join(map(str, obj)))), (','.join(activite)))
                    else:
                        quer = "SELECT u.user_name, u.id, u.last_name, u.email, u.datedemarrage, u.activite, u.site_id FROM syspointage_newuser_arborescence AS ua, syspointage_arborescence AS a, syspointage_newuser AS u LEFT JOIN syspointage_role AS r ON r.id=u.role_id WHERE ua.arborescence_id=%s AND ua.newuser_id=u.id AND a.id=ua.arborescence_id" % str(int(''.join(map(str, obj))))

                    cc = connection.cursor()
                    cc.execute(quer)
                    employes = cc.fetchall()

                    json_data = []
                    for objj in employes:
                        if objj[2] is not None:
                            label = objj[0] + " " + objj[2]
                        else:
                             label = objj[0]

                        json_data.append({
                               "label": label,
    "value": objj[1],
    "email": objj[3],
    "datedemarrage": objj[4],
    "activite": objj[5],
    "site": objj[6]
})

                    listEmployes.extend(list(json_data))
        return JsonResponse(listEmployes, safe=False)
class Usersdepequipe(APIView):
    permission_classes = [AllowAny]
    
    def get(self,request,**kwargs):
        listEmployes=[]
        listids=request.query_params.getlist('id')[0].split(',')#ids of id departement(url) (choisi dans le front par l'utlisateur)
     
        for idd in listids:
            
            if idd:
               idarboresence=int(idd)
               #parcourir la liste des sous départements de département sélectionné
               query = 'WITH children  AS  (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
               
               cursor = connection.cursor()
               cursor.execute(query)
               data = cursor.fetchall()
         
               l=[]
               for obj in data:
                  
                  
                  #quer="SELECT u.user_name,u.id,u.last_name,u.démarrageContrat,u.email,u.datedemarrage,u.datefin,u.rappel1,u.rappel2,u.activite,u.site_id from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id and u.activite in (%s) and u.site_id in (%s)"%(str(int(''.join(map(str, obj)))),(','.join(activite)),(','.join(site)))
                  quer="SELECT u.user_name,u.id,u.last_name,u.email,u.datedemarrage,u.activite,u.site_id from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id "%(str(int(''.join(map(str, obj)))))
            
                  cc=connection.cursor()
                  cc.execute(quer)
                  employes=cc.fetchall()

                  json_data = []
                  for objj in employes:
                     json_data.append({"label":str(objj[0]+" "+objj[2]),"value":objj[1],"email":objj[3],"datedemarrage":objj[4],"activite":objj[5],"site":objj[6]})

                  listEmployes.extend(list(json_data))
        return JsonResponse(listEmployes, safe=False)                
               
class TestUsersOfDepartement(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        listEmployes=[]
        listids=request.query_params.getlist('id')[0].split(',')
        
        for idd in listids:
            
            
            idarboresence=int(idd)
            query = 'WITH children  AS  (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
             
            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            for obj in data:
                  
                quer="SELECT u.user_name,u.id,u.last_name,u.email,u.datedemarrage from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u   left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id"%str(int(''.join(map(str, obj))))
                cc=connection.cursor()
                cc.execute(quer)
                employes=cc.fetchall()

                json_data = []
                for objj in employes:
                    json_data.append({"label":str(objj[0]+" "+objj[2]),"value":objj[1],"email":objj[3],"datedemarrage":objj[4]})

                listEmployes.extend(list(json_data))
        return JsonResponse(listEmployes, safe=False)                 
class Userlist(generics.ListAPIView):
      queryset =NewUser.objects.all()
      serializer_class = CustomUserSerializer
      permission_classes = [AllowAny]

class ManagersCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        with transaction.atomic():
            departement_id = int(request.data[0]['departement_id'])
            arborescence.chefs.through.objects.filter(arborescence_id=departement_id).delete()

            arbo = arborescence.objects.get(id=departement_id)
            arbo.chefs.clear()

            for data in request.data:
                departement_id = int(data['departement_id'])
                new_users = NewUser.objects.filter(id=int(data['value']))
                arbo.chefs.add(*new_users)

        return Response(status=status.HTTP_201_CREATED)
               
class UserDelete(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = NewUser.objects.all()
    serializer_class = CustomUserSerializer  
    permission_classes = [AllowAny] 
def jwt_payload_handler(user=None):
    return {     
        'user': CustomUserSerializer(user).data
    } 
class UpdateUser(APIView):
   permission_classes = [AllowAny]
   def get_object(self, todo_id):

       try:
          return NewUser.objects.get(id=todo_id)
       except NewUser.DoesNotExist:
          return None    
   def put(self, request, *args, **kwargs):

        todo_instance = self.get_object(kwargs['pk'])
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
      
        serializer = CustomUserSerializer(instance = todo_instance, data=request.data, partial=True)
        
        if serializer.is_valid():
           user = serializer.save()
           data={}
           #get the data of contrats from front with request
           data['datefin']=request.data.get('ajoutcontrats')['datefin']
           data['rappel1']=request.data.get('ajoutcontrats')['rappel1']
           data['rappel2']=request.data.get('ajoutcontrats')['rappel2']
           data['démarrageContrat']=request.data.get('ajoutcontrats')['démarrageContrat']

           data['employe']=int(kwargs['pk'])
           data['typecontrat']=request.data.get('ajoutcontrats')['typecontrat']
           print(data)
           ser=DetailsContratsEmployesSerializer(data=data)
           if ser.is_valid():
              ser.save()
           for oo in request.data.get('contrat'):#pour modifier les contrats (on fait une boucle parce que il y a plusieurs contrats)
              
               DetailsContratsEmployes.objects.filter(id=int(oo.get('id'))).update(datefin=str(oo.get('datefin')),rappel1=str(oo.get('rappel1')),rappel2=str(oo.get('rappel2')),démarrageContrat=str(oo.get('démarrageContrat')),employe=kwargs['pk'],typecontrat=oo.get('typecontrat_id'))
     
           if user:
              jsonn = serializer.data
      
              payload = jwt_payload_handler(user)#quand on modifie l'utilisateur il faut que le mot de passe  devient crypté (jwt)
              token = jwt.encode(payload, settings.SECRET_KEY)
              
           return Response(jsonn, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 
class CustomUserCreate(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format='json'):
        
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
          
            if user:
                json = serializer.data
                data={}
                
                data['datefin']=request.data.get('datefin')
                data['rappel1']=request.data.get('rappel1')
                data['rappel2']=request.data.get('rappel2')
                data['démarrageContrat']=request.data.get('démarrageContrat')
       
                data['employe']=json.get('id')
                data['typecontrat']=request.data.get('idcontrat')
                #when save user, save contrat in the table many to many DetailsContratsEmployesSerializer 
                if data['typecontrat']:
                  ser=DetailsContratsEmployesSerializer(data=data)
                  if ser.is_valid():
                     ser.save()
                return Response(json, status=status.HTTP_201_CREATED)
 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class GetUserById(generics.RetrieveAPIView):
   queryset=NewUser.objects.prefetch_related('planningemp','arborescence').select_related('role','site').all()
   #preftched_related=>many to many relation
   #selected_related=>one to many relation

   serializer_class=CustomUserSerializer
   permission_classes = [AllowAny]
  
class Rolelist(generics.ListCreateAPIView):
    #test
    
    queryset = role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [AllowAny]
   
class Roleupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = role.objects.all()
    serializer_class = RoleSerializer 
    permission_classes = [AllowAny]    
class Pointeuselist(generics.ListCreateAPIView):
    
    queryset = pointeuse.objects.all()
    serializer_class = pointeusesSerializer
    permission_classes = [AllowAny]
   
class Pointeuseupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = pointeuse.objects.all()
    serializer_class = pointeusesSerializer  
    permission_classes = [AllowAny]
class Pointagelist(generics.ListAPIView):
     
    queryset = pointage.objects.all()
    serializer_class = PointageSerializer
    permission_classes = [AllowAny]

class workflowbyiddep(APIView):#demande congés autorisation mission
   permission_classes = [AllowAny]
   def get(self, request,dep):
       cursor = connection.cursor()
       iddep=self.kwargs['dep']
       cursor.execute("select w.nom  , w.departement_id , w.type_conge_id, w.valideur_1_id, w.valideur_2_id, w.valideur_3_id , w.valideur_4_id , w.id , m.motif from syspointage_workflowconge as w inner join syspointage_motif_abs as m on w.type_conge_id = m.id where departement_id=%s  "%iddep)
       data = cursor.fetchall()
       json_data = []
       for obj in data:
          
           json_data.append({"nom":obj[0],"departement_id":obj[1],"type_conge_id":obj[2],"valideur_1_id":obj[3],"valideur_2_id":obj[4],"valideur_3_id":obj[5],"valideur_4_id":obj[6] , "id":obj[7] , "nommotif":obj[8]})
       return JsonResponse(json_data, safe=False)
class CreatePointage(APIView):
      permission_classes = [AllowAny]

      def post(self, request,**kwargs):
          print('rrrrrr',request.data)
          data={}
          
          data['pointeuse']=request.data.get('pointeuse')
          data['idpause']=request.data.get('idpause')
          data['etat']=request.data.get('etat')
          data['description']=request.data.get('description')
 
          #on fait cette boucle par ce que le chef peut sélectionner plusieurs employés et les affecté en pause(active contact)
          for obj in request.data.get('employes'):
              data['employes']=obj

              serializer = PointageSerializer(data=data) 
              if serializer.is_valid():
                 pp = serializer.save()
     

          return Response('json', status=status.HTTP_201_CREATED)
class UpdatePointage(generics.RetrieveUpdateAPIView):
    queryset=pointage.objects.all()
    serializer_class=PointageSerializer
    permission_classes = [AllowAny]
class PointageRetrieve(generics.RetrieveAPIView):
    
    queryset = pointage.objects.all()
    serializer_class = PointageSerializer 
    permission_classes = [AllowAny]

class DeletePointage(generics.DestroyAPIView):
   queryset=pointage.objects.all()
   serializer_class=PointageSerializer
   permission_classes = [AllowAny]


class Motiflist(generics.ListCreateAPIView):
        
    queryset = motif_abs.objects.all()
    serializer_class = MotifabsSerializer
    permission_classes = [AllowAny]
   
class Motifupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = motif_abs.objects.all()
    serializer_class = MotifabsSerializer     
    permission_classes = [AllowAny]
class Horairejourlist(generics.ListCreateAPIView):
        
    queryset = horairejour.objects.all()
    serializer_class = HoraireJourSerializer
    permission_classes = [AllowAny]
   
class HoraireJourupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = horairejour.objects.all()
    serializer_class = HoraireJourSerializer
    permission_classes = [AllowAny]
class Plansemainelist(generics.ListCreateAPIView):
        
    queryset = plansemaine.objects.all()
    serializer_class = PlanSemaineSerializer
    permission_classes = [AllowAny]
   
class plansemaineupdate(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = plansemaine.objects.all()
    serializer_class = PlanSemaineSerializer
    permission_classes = [AllowAny]
    
class Planninglist(generics.ListCreateAPIView):
        
    queryset = planning.objects.all()
    serializer_class = PlanningSerializer
    permission_classes = [AllowAny]
class PlanningDelete(generics.RetrieveUpdateDestroyAPIView):
    
    queryset = planning.objects.all()
    serializer_class = PlanningSerializer  
    permission_classes = [AllowAny] 

class updateUserbyplanning(APIView):
   permission_classes = [AllowAny]
   def post(self, request, **kwargs):
       idplaning=kwargs['idplanning']
       iduser=kwargs['iduser']
       idplaningactuelle=kwargs['idplaningactuelle']
       user=NewUser.objects.get(id=int(iduser))
       #user.planningemp.clear()  
       user.planningemp.get(id=idplaningactuelle) #séléctionner planning actuelle selecté
       user.planningemp.remove(idplaningactuelle)#effacer planning actuelle selecté
       user.planningemp.add(idplaning) #ajouter nouveau planning
       return Response('json', status=status.HTTP_201_CREATED)
class RemoveUserbyplanning(APIView):
   permission_classes = [AllowAny]
   def get(self, request, **kwargs):

       iduser=kwargs['iduser']
       idplaningactuelle=kwargs['idplaningactuelle']
       user=NewUser.objects.get(id=int(iduser))
       #user.planningemp.clear()  
       user.planningemp.get(id=idplaningactuelle) #séléctionner planning actuelle selecté
       user.planningemp.remove(idplaningactuelle)#effacer planning actuelle selecté
 
       return Response('json', status=status.HTTP_201_CREATED)


#when user click on planning=>show list of users
class GetUsersbyplanings(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    def get(self,request,pk):
        cursor=connection.cursor()
        id=self.kwargs['pk']
        cursor.execute('select u.matricule,u.user_name,p.title,p.id,u.id,u.last_name,u.id,p.id from syspointage_newuser  as u  left join   syspointage_planning as p on p.employe_id=u.pid WHERE p.id=%s'%id)
        data = cursor.fetchall()
        json_data = []
        for obj in data:

            json_data.append({"matricule":obj[0],"user_name":obj[1],"nomplanning":obj[2],"idplanactuelle":obj[3],"iduser":obj[4],"last_name":obj[5],"iduseractuelle":obj[6],"idplanning":obj[7]})

        return JsonResponse(json_data, safe=False)


class CreateplaningByDep(APIView):
      permission_classes = [AllowAny]

      def post(self, request, **kwargs):
        list_ids = request.query_params.getlist('id')[0].split(',') 
        serializer = PlanningSerializer(data=request.data)
        
        if serializer.is_valid():
            planning = serializer.save()
            for obj_id in list_ids:
                user = NewUser.objects.get(id=int(obj_id))
                planning.employe = user  
                planning.save()  
                
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ContratList(generics.ListCreateAPIView):
    queryset=contrat.objects.all()
    serializer_class = ContratSerializer
    permission_classes = [AllowAny]
class contratupdate(generics.RetrieveUpdateDestroyAPIView):
    queryset= contrat.objects.all()
    serializer_class=ContratSerializer
    permission_classes = [AllowAny]

class AbsencesList(generics.ListCreateAPIView):
    queryset=absence.objects.all()
    serializer_class=AbsenceSerializer
    permission_classes = [AllowAny]

class AbscenceUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset=absence.objects.all()
    serializer_class=AbsenceSerializer  
    permission_classes = [AllowAny]

class ArborescenceList(generics.ListCreateAPIView):
    queryset=arborescence.objects.filter(parent__isnull = True)
    serializer_class=arborenscenceSerializer
    permission_classes = [AllowAny]

class ArborescenceUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset=arborescence.objects.all()
    serializer_class=arborenscenceSerializer
    permission_classes = [AllowAny] 



class Getarbobyids(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = arborenscenceSerializer  # Specify the serializer to use

    def get_queryset(self):
        listids = ' '.join(self.request.query_params.getlist('id')[0].split(',')).split()
        lista = arborescence.objects.filter(id__in=listids).all()
        return lista
def SearchpourDemandeConge(request,**kwargs):# quand utilisateur sélectionne date début,datefin et motif alors cette fonction va calculer les jours coupés en soustractant les jours fériés et repos . si employé passe congé de maladie elle va soustracter de solde maladie si non de son solde
      zero=datetime.strptime(str("00:00:00"),'%H:%M:%S').time()
      soldenouveau=0
      queryplanning=NewUser.objects.filter(id=kwargs['id']).prefetch_related('planningemp')#select all the plannings of employee
      userval=NewUser.objects.filter(id=kwargs['id']).values('solde','soldemaladie')[0]#select values of user :solde et solde maladie
      solde=userval.get('solde')
      soldenouveau=solde
      soldemaladie=userval.get('soldemaladie')
      for test in queryplanning:
            listaidplanings=list(test.planningemp.values('id'))
      
      repos=0
      jourferies=0
      existjourferierepos=0
      nbjoursmaladiecoupe=0
      for single_date in daterange(datetime.strptime(str(kwargs['date1']),"%Y-%m-%d").date(), datetime.strptime(str(kwargs['date2']),"%Y-%m-%d").date()):
         testplaning=SearchPlaning(str(single_date),listaidplanings)#sélectionner le planning de date actuelle
         jourferies=jourferies+JourFerie.objects.filter(date__lte=single_date, datefin__gte=single_date).count()#nombre de jours féries dans cette période
         
         if testplaning!=False:
            s=searchDay(str(single_date),kwargs['id'],testplaning)#cette fonction renvoie les détails d'horaire de l' employé connecté 
            if s==["00:00:00",zero,zero,zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"","0"]:
               
               repos+=1
               if JourFerie.objects.filter(date__lte=single_date, datefin__gte=single_date).exists():
                  existjourferierepos=existjourferierepos+1
   
         
      
      if kwargs['justifie']=='true':
         jus=1
      elif kwargs['justifie']=='false':
         jus=0
      # si la motif est justifié donc les jours sont coupés 
      dataa={}
      nouveausoldemaladie=soldemaladie
      dd=(datetime.strptime(str(kwargs['date2']), "%Y-%m-%d")-datetime.strptime(str(kwargs['date1']), "%Y-%m-%d")).days+1#différence de jours entre date debut et date fin
      if kwargs['matindebut']=="true":
         if kwargs['matinfin']=="true":
            dd-=0.5#si matin debut ==true et matinfin ==true alors on va soustracter une demi journée

      else:
         if kwargs['matinfin']=="true":#si matin debut ==false et matinfin ==true alors on va soustracter une demi journée
            dd-=0.5  
  
      if kwargs['nombrejours_ouvres']=='null':#jours ouvrés sont les jours 
         kwargs['nombrejours_ouvres']=0
      if kwargs['nbjourretires']=="null":
         kwargs['nbjourretires']=0
      #si justifié ==0=>pas de retrait 
      nbjours=(dd)*jus
      nombrejoursdemande=nbjours
      if nbjours<0:
         nbjours=0
      if soldemaladie==None:
         soldemaladie=0
      if kwargs['congemaladie']=="true":#si le congé est un congé de maladie
       
         if nbjours<=soldemaladie:#si le nombre de jours passés inférieur au solde maladie 

            
            nouveausoldemaladie=soldemaladie-nbjours
            nbjoursmaladiecoupe=nbjours
            nbjours=0
         else:
            nouveausoldemaladie=0
           

      if solde:
         if kwargs['congemaladie']=="false":
          
               soldenouveau=solde-nbjours

      return JsonResponse({"soldemaladie":soldemaladie,"difference":dd,"repos":repos,"jourferies":jourferies,"nbjours":nombrejoursdemande,"solde":solde,"soldenouveau":soldenouveau,"nouveausoldemaladie":nouveausoldemaladie,"nbjoursmaladiecoupe":nbjoursmaladiecoupe},safe=False)


from django.db import connection
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import connection   
class SupressionConge(generics.DestroyAPIView):
    queryset=Conges.objects.all()
    serializer_class=congesSerializer
    permission_classes = [AllowAny]
class ValidationConge(APIView):
    permission_classes = [AllowAny]
    def get(self, request,**kwargs):
        #modification état de congé 
        Conges.objects.filter(id=kwargs['id']).update(validation=kwargs['validation'],validationrh=kwargs['validationrh'],validationrh2=kwargs['validationrh2'])      
        return JsonResponse({"s":"success"},safe=False)
     
class RefusConge(generics.RetrieveUpdateAPIView):

   permission_classes = [AllowAny]
   def get_object(self, todo_id):

       try:
          return Conges.objects.get(id=todo_id)
       except Conges.DoesNotExist:
          return None    
   def put(self, request, *args, **kwargs):

        todo_instance = self.get_object(kwargs['pk'])
        if not todo_instance:
            return Response(
                {"res": "Object with todo id does not exists"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
      
        serializer = congesSerializer(instance = todo_instance, data=request.data, partial=True)
        if serializer.is_valid():
           conge = serializer.save()
           if conge:
              json = serializer.data
              if json.get('nbjours')!=None:#si le nombre de jours coupé différent de null alors il faut les ajouter au solde
                 solde=NewUser.objects.filter(id=json.get('employes')).values()[0].get('solde')+float(json.get('nbjours'))
                 NewUser.objects.filter(id=json.get('employes')).update(solde=solde)#modification solde employé
                 
              if  json.get('nbjoursmaladiecoupe')!=None:#si le nombre de jours maladie coupé différent de null alors on les ajout
                 
                 soldemaladie=NewUser.objects.filter(id=json.get('employes')).values()[0].get('soldemaladie')+float(json.get('nbjoursmaladiecoupe'))
                 NewUser.objects.filter(id=json.get('employes')).update(soldemaladie=soldemaladie)
                
              
              return Response(json, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class createlistsite(generics.ListCreateAPIView):
    queryset=Site.objects.all()
    serializer_class=SiteSerializer
    permission_classes = [AllowAny]
class updatedeletesite(generics.RetrieveUpdateDestroyAPIView):
    queryset=Site.objects.all()
    serializer_class=SiteSerializer 
    permission_classes = [AllowAny]


class createequipe(generics.ListCreateAPIView):
    queryset=Equipe.objects.all()
    serializer_class=EquipeSerializer
    permission_classes = [AllowAny]
class updateequipe(generics.RetrieveUpdateDestroyAPIView):
    queryset=Equipe.objects.all()
    serializer_class=EquipeSerializer 
    permission_classes = [AllowAny]
class JoursFeriesList(generics.ListCreateAPIView):
    queryset=JourFerie.objects.all()
    serializer_class=JourFerieSerializer
    permission_classes = [AllowAny]
class JourFeriéUpdate(generics.RetrieveUpdateDestroyAPIView):
    queryset=JourFerie.objects.all()
    serializer_class=JourFerieSerializer
    permission_classes = [AllowAny] 

class ChartsParJourneeDynamique(APIView):
    permission_classes = [AllowAny]
    def get(self, request, **kwargs):
        jsondata=[]
        ##users=NewUser.objects.values().all()
        jourtravai=0
        auth=0
        aa=0
        mission=0
        conge=0
        absence=0
        motifs=motif_abs.objects.values().all()
        listchart=[]

        listids=request.query_params.getlist('id')[0].split(',')#get ids of users  from path(url)
        for u in listids:#parcourir la liste des idds
            #parcourir la liste des dates
            for single_date in daterange(datetime.strptime(kwargs['date1'],"%Y-%m-%d").date(), datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()):

               
                #appel au fonction Rapportunjour =>retourner une liste 
                a=Rapportunjour(int(u),str(single_date))

                if a:
                   jsondata.append({"motif":a[0]["motif"], "lateEntree":a[0]["lateEntree"]})#remplir la liste json data
                     
                
        
        for objj in jsondata:
            if objj['lateEntree']!="0.0" and objj['lateEntree']!="0":#si employé fait un retard 
               aa=aa+1
            if objj['motif']=='Autorisation':#si il a une autorisation
               auth=auth+1
            if objj['motif'] =="Congé":#si congé
               conge=conge+1
                    
            if objj['motif']=="Absent" or objj["motif"]=="Absence justifié" or objj["motif"]=="Absence non justifié": 
               absence=absence+1
            if objj['motif']=="Mission":
               mission=mission+1   
                     
           
        if kwargs['nbaa']==str(True).lower():#if user select (checkbox  :autorisations )in front =>remplir la liste avec un json d'autorisations
           listchart.append({"name":"nombre des autorisations","nombre":auth})
        if kwargs['nbrr']==str(True).lower():
           listchart.append({"name":"nombre des retard","nombre":aa})
        if kwargs['nbcc']==str(True).lower():
           listchart.append({"name":"nombre des congés","nombre":conge})
        if kwargs['nbabse']==str(True).lower():
           listchart.append({"name":"nombre des absences","nombre":absence})
        if kwargs['nbmis']==str(True).lower():
           listchart.append({"name":"nombre des missions","nombre":mission})
          
    
        return JsonResponse(listchart,safe=False)


class MyTokenObtainPairView(TokenObtainPairView):
    #authentification with token
    serializer_class = MyTokenObtainPairSerializer
class HistoriqueDemendesConges(APIView):#demande congés autorisation mission
   permission_classes = [AllowAny]
   def get(self, request,pk):
      
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       qq="SELECT n.user_name,c.validation,c.datedebut,c.datefin,m.motif,n.solde,c.heure_debut,c.heure_fin,c.date_autorisation,c.id,c.mission,c.validation,c.validationrh,c.destination,n.last_name FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id  where c.validationrh=1 and c.validationrh2=2 and n.id=%s and c.teletravail=%s order by c.datedebut"%(idemploye,"0")
       print(qq)
       cursor.execute(qq)
       
       data = cursor.fetchall()
       json_data = []
       for obj in data:
           json_data.append({"user_name":obj[0],"validation":obj[1],"datedebut":obj[2],"datefin":obj[3],"motif":obj[4],"solde":obj[5],"heure_debut":obj[6],"heure_fin":obj[7],"date_autorisation":obj[8],"idconge":obj[9],"mission":obj[10],"validation":obj[11],"validationrh":obj[12],"destination":obj[13],"last_name":obj[14]})
       return JsonResponse(json_data, safe=False)
      
class SelectcongebyId(APIView):#demande congés autorisation mission
   permission_classes = [AllowAny]
   def get(self, request,pk):
       cursor = connection.cursor()
       idconge=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.validation,c.datedebut,c.datefin,m.motif,n.solde,c.heure_debut,c.heure_fin,c.date_autorisation,c.id,c.mission,n.last_name,n.matricule,c.commentaire,c.destination,c.validation,c.validationrh,c.nbjours,c.personneinterimaire_id,c.adresse,c.contact FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id where c.id=%s"%idconge)
       p=''
       data = cursor.fetchall()
       json_data = []
       for obj in data:
           if obj[18]:
              p=str(NewUser.objects.filter(id=int(obj[18])).values()[0].get('user_name'))
           json_data.append({"user_name":obj[0],"validation":obj[1],"datedebut":obj[2],"datefin":obj[3],"motif":obj[4],"solde":obj[5],"heure_debut":obj[6],"heure_fin":obj[7],"date_autorisation":obj[8],"idconge":obj[9],"mission":obj[10],"last_name":obj[11],"matricule":obj[12],"commentaire":obj[13],"destination":obj[14],"validation":obj[15],"validationrh":obj[16],"nbjours":obj[17],"personneinterimaire":p,"adresse":obj[19],"contact":obj[20]})
       return JsonResponse(json_data, safe=False)
class RapportSemaine(APIView):
    permission_classes = [AllowAny]
    def get(self,request,**kwargs):
        d1=kwargs['date1']
        d2=kwargs['date2']
        
        listids=request.query_params.getlist('id')[0].split(',')
        
        listesemaines=[]
        jsondata=[]
        if( cache.get(d1) and cache.get(d2) and cache.get(jsondata) and cache.get(listesemaines)):
           
           d11=cache.get(d1)
           d22=cache.get(d2) 
           jd=cache.get(jsondata)
           ls=cache.get(listesemaines)
           return ls
        else:  
           ttzero=datetime.strptime("00:00:00","%H:%M:%S").time()
           j=0
           minuts=0.0
           presencesupl=0.0
           time_zero = datetime.strptime('00:00:00', '%H:%M:%S').time()
           presencenor=0.0
           comp=0
           retard=0.0
           avantSortie=0.0
           deficit=0.0
           jourtravaille=0
           m=''
           p=''
           sup=''                   

           r=''
           avant_s=''
           amplitude=0.0
           se=[]
           liste=[]
           numberdebut=datetime.strptime(d1,"%Y-%m-%d").date().isocalendar()[1]#retourner la date début de semaine 
           numberfin=datetime.strptime(d2,"%Y-%m-%d").date().isocalendar()[1]#routrner la date fin de semaine
           listdates=[]
           for y in listids:
               l=''
               listdates=[]
               for ii in range(numberdebut,numberfin+1):#cette boucle a pour but de déterminer la date début et fin de chaque semaine puis à partir de rapportun jour on va calculer les heures de travail....
                  if ii==numberdebut:
                      first_date=datetime.strptime(d1,"%Y-%m-%d").date()
                      debut=startEndDate(datetime.strptime(d1,"%Y-%m-%d").year,ii)[0]
                  else:
                      first_date=startEndDate(datetime.strptime(d1,"%Y-%m-%d").year,ii)[0]
                      debut=startEndDate(datetime.strptime(d1,"%Y-%m-%d").year,ii)[0]
                  if ii==numberfin:
                      end_date=datetime.strptime(d2,"%Y-%m-%d").date()
                      end=startEndDate(datetime.strptime(d1,"%Y-%m-%d").year,ii)[1] 
                  else:
                      end_date=startEndDate(datetime.strptime(d1,"%Y-%m-%d").year,ii)[1] 
                      end=startEndDate(datetime.strptime(d1,"%Y-%m-%d").year,ii)[1]    

                  l=''
                  u=''
                  m=''
                  d=''

                  r=''
                  avant_s=''
                  jourtravaille=0
                  amplitude=0.0
                  jsondata=[]#pour vider la liste a chaque employé   
                  for single_date in daterange(first_date, end_date):
                        a=Rapportunjour(int(y),str(single_date))
                        
                        print(a)
                        if a:
                           jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"],"last_name":a[0]["last_name"]})  
                           l=a[0]["last_name"]
               
                  if jsondata:
                     for i in range (len(jsondata)): #on fait la somme
                        minuts=minuts+float(jsondata[i]['heuretravail'])
                        retard=retard+float(jsondata[i]['lateEntree'])
                        avantSortie=avantSortie+float(jsondata[i]['earlySortie'])
                        presencenor=presencenor+float(jsondata[i]['presencenormal'])
                        jourtravaille+=float(jsondata[i]['jourtravaille'])
                     r=str(minutes_hours(retard))
                     m=str(minutes_hours(minuts))
                     p=str(minutes_hours(presencenor))
                     avant_s=str(minutes_hours(avantSortie))
                     if jourtravaille!=0:
                        amplitude=minuts/jourtravaille
                     
                     
                     print(minuts,jourtravaille)
                     if minuts>presencenor: 
                        presencesupl=minuts-presencenor
                     if minuts<presencenor:
                        deficit=presencenor-minuts
                     d=str(minutes_hours(deficit))
                     sup=str(minutes_hours(presencesupl))  
                     listesemaines.append({"amplitude":amplitude,"as":str(avantSortie),"ret":str(retard),"tra":str(minuts),"prno":str(presencenor),"psup":str(presencesupl),"dd":str(deficit),"avantSortie":avant_s,"user_name":str(NewUser.objects.filter(id=int(y)).values()[0].get('user_name')),"matricule":str(NewUser.objects.filter(id=int(y)).values()[0].get('matricule')),"presencereele":m,'presencenormal':p,'suplementaire':sup,'semaine':ii,"last_name":l,"deficit":d,"retard":r,"semaine":str(ii),"first_date":str(debut),"end_date":str(end)})                           
                     listdates.append({"semaine":str(ii),"first_date":str(debut),"end_date":str(end)})
                  jsondata=[]
                  minuts=0.0
                  presencenor=0.0
                  presencesupl=0.0
                  deficit=0.0
                  avantSortie=0.0
                  m=''
                  p=''
                  sup=''
                  d=''

                  r=''
                  retard=0.0
                  avant_s=''
               minutstotale=0.0
               retardtotale=0.0
               avantSortietotale=0.0
               presencenortotale=0.0
               suptotale=0.0
               deficittotale=0.0
               #cette boucle fait la somme de tous les semaines
               for i in range (len(listesemaines)):
                  minutstotale=minutstotale+float(listesemaines[i]['tra'])
                  retardtotale=retardtotale+float(listesemaines[i]['ret'])
                  avantSortietotale=avantSortietotale+float(listesemaines[i]['as'])
                  presencenortotale=presencenortotale+float(listesemaines[i]['prno'])
                  suptotale=suptotale+float(listesemaines[i]['psup'])
                  deficittotale=deficittotale+float(listesemaines[i]['dd'])
               rt=str(minutes_hours(retardtotale))
               mt=str(minutes_hours(minutstotale))
               pt=str(minutes_hours(presencenortotale))
               avant_st=str(minutes_hours(avantSortietotale))
               dt=str(minutes_hours(deficittotale))
               st=str(minutes_hours(suptotale))
               liste.append({"listedates":listdates,"listesemaine":listesemaines,"iduser":y,"reeltotale":str(mt),"retardTotale":str(rt),"presencetotale":str(pt),"avant_st":str(avant_st),"deficittotale":str(dt),"user_name":str(NewUser.objects.filter(id=int(y)).values()[0].get('user_name')),"last_name":l,"supptotale":str(st)})

               
               listesemaines=[]
           #liste.append({})
           cache.set(
             listesemaines,jsondata
           ) 
           return JsonResponse(liste, safe=False)  
class RapportJournalier(APIView):
    #permission_classes = [AllowAny]
    def get(self, request,**kwargs):

        listids=request.query_params.getlist('id')[0].split(',')
        jsondata=[]
        d1 = kwargs['date1']
        d2 = kwargs['date2']
        if  cache.get(d1) and cache.get(d2) and cache.get(jsondata) and cache.get(a):
           
           d11=cache.get(d1)  
           d22=cache.get(d2)
           jsonn=cache.get(jsondata)
           aa=cache.get(a)
           return jsonn
        else:

            
            for i in listids:
                for single_date in daterange(datetime.strptime(d1,"%Y-%m-%d").date(), datetime.strptime(d2,"%Y-%m-%d").date()):
                    
                    a=Rapportunjour(int(i),str(single_date))
                     
                   
                    
                    if a:
                       
                       jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":minutes_hours(float(a[0]["earlyEntree"])), "lateEntree": minutes_hours(float(a[0]["lateEntree"])), "earlySortie":minutes_hours(float(a[0]["earlySortie"])), "lateSortie":minutes_hours(float(a[0]["lateSortie"])), "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': minutes_hours(float(a[0]["heuretravail"])), 'pause': a[0]["pause"],'presencenormal': minutes_hours(float(a[0]['presencenormal'])),"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation": minutes_hours(float(a[0]['heureauthorisation'])),"deficit": minutes_hours(float(a[0]["deficit"])),"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence": minutes_hours(float(a[0]["tempabsence"])),"jourconge":a[0]["jourconge"],"tempsMission": minutes_hours(float(a[0]["tempsMission"])),"tempsconge": minutes_hours(float(a[0]['tempsconge'])),"last_name":a[0]['last_name'],"heuretravailbrute":minutes_hours(float(a[0]['heuretravailbrute'])),"retardmidi":minutes_hours(float(a[0]['retardmidi']))})  
                            
            return JsonResponse(jsondata, safe=False)
        return Response("pas de pointages ", status=status.HTTP_400_BAD_REQUEST)

class DepartmentHierarchyView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        departments = arborescence.objects.all()
        hierarchy = []

        for department in departments:
            hierarchy.append({
                'id': department.id,
                'name': department.nom,
                'parent': department.parent.nom if department.parent else None,
            })

        return JsonResponse(hierarchy, safe=False)
class departementbyid(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        department = arborescence.objects.filter(id=pk).first()

        if not department:
            return JsonResponse({'error': 'Department not found'}, status=404)

        hierarchy = {
            'id': department.id,
            'name': department.nom,
            'parent': department.parent.nom if department.parent else None,
            'parent_id': department.parent.id if department.parent else None,
        }

        return JsonResponse(hierarchy) 
class  RapportPointage(APIView):
      permission_classes = [AllowAny]
      def get(self, request,**kwargs):
          listids=request.query_params.getlist('id')[0].split(',')
          liste=[]
          d1=kwargs['date1']
          d2=kwargs['date2']  
          json_data=[]  
          if  cache.get(d1) and cache.get(d2) and cache.get(liste) and cache.get(jsondata):
              
              d11=cache.get(d1)
              d22=cache.get(d2)
              listt=cache.get(liste)
              jsonn=cache.get(jsondata)
              return listt
          else:
             
              for i in listids: 
                  cursor = connection.cursor()

                  cursor.execute('SELECT  u.user_name , u.matricule , p.date_pointage , poin.nom_pointeuse,p.date_pointage,u.last_name FROM (syspointage_pointage as p INNER JOIN syspointage_newuser as u ON p.employes_id = u.id) left join syspointage_pointeuse as poin on p.pointeuse_id=poin.id  where u.id=%s   ORDER by p.date_pointage'%int(i))
                  r = cursor.fetchall()
              
            
                  for obj in r:
                      json_data.append({"user_name":obj[0],"matricule":obj[1],"date_pointage":obj[2].date(),"nom_pointeuse":obj[3],"heure":obj[4].time(),"last_name":obj[5]})   
              for obj in json_data:
                  
                  if d1<=str(obj["date_pointage"])<=d2:
                     liste.append({"user_name":obj["user_name"],"matricule":obj["matricule"],"date_pointage":obj["date_pointage"],"nom_pointeuse":obj["nom_pointeuse"],"heure":obj["heure"],"last_name":obj["last_name"]})
              
              cache.set(
                 liste,json_data
              )
              
    
              return JsonResponse(liste, safe=False) 
class  RapportAbsences(APIView):
      permission_classes = [AllowAny]
      def get(self, request,**kwargs):
          listAbsences=[]
          listids=request.query_params.getlist('id')[0].split(',')
          datesabsences=[]
          d1=kwargs['date1']
          d2=kwargs['date2']    
          json_data=[]
          listc=[]
          listbb=[]
          liste=[]#liste entre 2 dates 
          datecongesconfirme=[]  
          listauth=[]
 
          jsondata=[]
          if  cache.get(d1) and cache.get(d2) and cache.get(listAbsences):
             d11=cache.get(d1)
             d22=cache.get(d22)
             listab=cache.get(listAbsences)
             return listab
          else: 
             motifs=motif_abs.objects.values().all()


             for y in listids:
                 jsondata=[]#pour vider la liste et ajouter la liste de l'autre employé
                 for single_date in daterange(datetime.strptime(d1,"%Y-%m-%d").date(), datetime.strptime(d2,"%Y-%m-%d").date()):

                     a=Rapportunjour(int(y),str(single_date))

                     if a:
                        jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"],"last_name":a[0]['last_name']})  

                 for obj in jsondata:
                     if obj['motif']=="Absent":
                        ##compabs=compabs+1
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"absence","last_name":obj['last_name']})
                     elif obj['motif']=="Absence non justifié":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Absence non justifié","last_name":obj['last_name']})
                     elif obj['motif']=="Absence justifié":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Absence justifié","last_name":obj['last_name']})
                     
                     
                     elif obj["motif"]=="Autorisation":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Autorisation","last_name":obj['last_name']})
                     
                     elif obj['motif']=="Abs demi-journée":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Absence demi journnée","last_name":obj['last_name']})


         
          return JsonResponse(listAbsences, safe=False)   
class  RapportSynthese(APIView):
      permission_classes = [AllowAny]
      def get(self, request,**kwargs):
          listsynthese=[]
          listids=request.query_params.getlist('id')[0].split(',')
          jsondata=[]
          d1=kwargs['date1']
          d2=kwargs['date2'] 
          liste=[]  
          
          if cache.get(d1) and cache.get(d2) and cache.get(listsynthese) and cache.get(jsondata):
             d11=cache.get(d1)
             d22=cache.get(d22)
             listsy=cache.get(listsynthese)
             js=cache.get(jsondata)
             return listsy
          else:
             
             ttzero=datetime.strptime("00:00:00","%H:%M:%S").time()
             joursabsence=0
             tempsabsence=0.0
             tab=''

             for y in listids:
            
                 jourtravai=0
                 minuts=0.0
                 m=''
                 minutestravaill=0.0
                 earlysortie=0.0
                 defici=0.0
                 joursabsence=0
                 jourconge=0
                 heuremission=0.0
                 heureauthorisation=0.0
                 prnormale=0.0
                 tempsabsence=0.0
                 tab=''
                 amplitude=0.0
                 jourtravaille=0
                 for single_date in daterange(datetime.strptime(d1,"%Y-%m-%d").date(), datetime.strptime(d2,"%Y-%m-%d").date()):
                     a=Rapportunjour(int(y),str(single_date))

                     if a:
                        jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"],"last_name":a[0]['last_name']})  
       
                 if jsondata:
                    for obj in jsondata:   
                        
                        tempsabsence=tempsabsence+float(obj['tempabsence'])
                        
                        tab=str(minutes_hours(tempsabsence))
                  
                        minuts=minuts+float(obj['lateEntree'])
                        minutestravaill=minutestravaill+float(obj['heuretravail'])
                        earlysortie=earlysortie+float(obj['earlySortie'])
                        defici=defici+float(obj['deficit'])
                        sortieavantheure=str(minutes_hours(earlysortie))
                        m=str(minutes_hours(minuts))
                        travail=str(minutes_hours(minutestravaill))
                        deficit=str(minutes_hours(defici))
                        prnormale=prnormale+float(obj['presencenormal'])
                        pr=str(minutes_hours(prnormale))
                        jourtravaille+=float(obj['jourtravaille'])
                        if obj['motif']=="Absent" or obj['motif']=="Absence non justifié" or obj['motif']=="Absence justifié":
                           if obj["deficit"]!="0.0":#nombre jour absence découlant le déficit
                              joursabsence=joursabsence+1
                        if obj['motif'] =="Congé":
                           jourconge=jourconge+1
                        if obj['motif']=="Mission":
                           heuremission=heuremission+float(obj['tempsMission'])
                           
                        if obj['motif']=="Autorisation":
                           heureauthorisation=heureauthorisation+float(obj['heureauthorisation'])

                        tempsauthorisation=str(minutes_hours(heureauthorisation))
          
                        heuresmission=str(minutes_hours(heuremission))

                    if jourtravaille!=0:
                        amplitude=minutestravaill/jourtravaille   
                    listsynthese.append({"amplitude":amplitude,"tempsabsence":tab,"presencenormale":pr,"user_name":obj['user_name'],"matricule":obj['matricule'],"retard":m,"travail":travail,"earlySortie":sortieavantheure,"deficit":deficit,"joursabsence":joursabsence,"jourconges":jourconge,"heuremission":heuresmission,"heureauthorisation":tempsauthorisation,"last_name":obj['last_name']})
                    jsondata=[]#pour vider la liste jsondata :en premier temps elle prend les objets user1,puis user 2....

          return JsonResponse(listsynthese, safe=False)                       
class RapportMensuelle(APIView):
    permission_classes = [AllowAny]
    def get(self, request,**kwargs):
        date1=datetime.strptime(kwargs['date1'],"%Y-%m-%d").date()
        date2=datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()
        listids=request.query_params.getlist('id')[0].split(',')
        rap=rapportmensul(listids,date1,date2)
        return JsonResponse(rap, safe=False)
class RapportAnuellement(APIView):
    permission_classes = [AllowAny]
    def get(self,request,**kwargs):
      listids=request.query_params.getlist('id')[0].split(',')
      date1=datetime.strptime(kwargs['date1'],"%Y-%m-%d").date()
      date2=datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()
      listrapport=[]
      rapport=[]
      heuretravailindirect=0.0
      minuts=0.0
      minutesdirect=0.0
      presencereeleminutes=0.0
      prnormalminutes=0.0
      retardEntreeMinutes=0.0
      heureavantsortieminutes=0.0
      absence_deficitminutes=0.0
      deficitminutes=0.0
      ttzero=datetime.strptime("00:00:00","%H:%M:%S").time()
      for id in listids:
          
          rap=[]
          
          heuretravailindirect=0.0
          minuts=0.0
          minutesdirect=0.0
          presencereeleminutes=0.0
          prnormalminutes=0.0
          retardEntreeMinutes=0.0
          heureavantsortieminutes=0.0
          absence_deficitminutes=0.0
          deficitminutes=0.0
          absence_deficit=''
          deficit=''
          heureavantsortie=''
          retardEntree=''
          presencenormal=''
          presencereel=''
          travaildirect=''
          travailindirect=''
          amplitude=0.0
          jourtravaille=0
          for ss in daterangeAns (date1,date2):
              rap=[]

              heuretravailindirect=0.0
              minuts=0.0
              minutesdirect=0.0
              presencereeleminutes=0.0
              prnormalminutes=0.0
              retardEntreeMinutes=0.0
              heureavantsortieminutes=0.0
              absence_deficitminutes=0.0
              deficitminutes=0.0
              absence_deficit=''
              deficit=''
              heureavantsortie=''
              retardEntree=''
              presencenormal=''
              presencereel=''
              travaildirect=''
              travailindirect=''
              amplitude=0.0
              jourtravaille=0            
              #rap=rapportmensulle([id],ss,(datetime.strptime(str(ss),"%Y-%m-%d")+relativedelta(years=1)).date())#chaque employé  en an
              for single_date in daterange(ss, (datetime.strptime(str(ss),"%Y-%m-%d")+relativedelta(years=1)).date()):
               
                  a=Rapportunjour(int(id),str(single_date))            
                  if a:
                  
                     presencereeleminutes=presencereeleminutes+float(a[0]["heuretravail"])
                     presencereel=str(minutes_hours(presencereeleminutes))
                     prnormalminutes=prnormalminutes+float(a[0]['presencenormal'])
                     presencenormal=str(minutes_hours(prnormalminutes))
                     retardEntreeMinutes=retardEntreeMinutes+float(a[0]["lateEntree"])
                     retardEntree=str(minutes_hours(retardEntreeMinutes))
                     heureavantsortieminutes=heureavantsortieminutes+float(a[0]["earlyEntree"])
                     heureavantsortie=str(minutes_hours(heureavantsortieminutes))
                     deficitminutes=deficitminutes+float(a[0]["deficit"])
                     
                     deficit=str(minutes_hours(deficitminutes))   
                     jourtravaille+=a[0]["jourtravaille"]                  
              if jourtravaille!=0:
                 amplitude=presencereeleminutes/jourtravaille                              
              listrapport.append({"amplitude":amplitude,"user_name":str(a[0]['user_name']),"date1":str(ss),"date2":str((datetime.strptime(str(ss),"%Y-%m-%d")+relativedelta(years=1)).date()),"presencereel":presencereel,"presencenormal":presencenormal,"retardEntree":retardEntree,"heureavantsortie":heureavantsortie,"deficit":deficit,"last_name":str(a[0]['last_name'])})
              
      return JsonResponse(listrapport, safe=False)

class SendMai(APIView):
    permission_classes = [AllowAny]
 
    # This function sends emails for (validation, refus, annulation)
    def put(self, request, *args, **kwargs):
        emaill = request.data.get('email')
        objet = request.data.get('objet')
        message = request.data.get('message')

        if emaill and objet and message:
            try:
                send_mail(
                    str(objet),
                    str(message),
                    settings.EMAIL_HOST_USER,
                    [emaill],  # Assuming 'emaill' is a string containing a single email address
                    fail_silently=False,
                    html_message="<p style='line-height: 300%;'>" + str(message) + "<br>IPS Time</p>"
                )
                return Response({"status": "true"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"status": "Couldn't send the email: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"status": "Missing email, objet, or message in the request"}, status=status.HTTP_400_BAD_REQUEST)
      
class Mouchardcreate(APIView):
    permission_classes = [AllowAny]
    def post(self, request,**kwargs):
        dataa={}

        dataa['anciennevaluer']=kwargs['previous']
        dataa['nouvellevaluer']=kwargs['new']
        dataa['employe']=kwargs['idemploye']
        dataa['idper_modifie']=kwargs['idpersonne']
        dataa['datenow']=datetime.now()
        dataa['objet']=kwargs['obj']
        serializer = MouchardSerializer(data=dataa)
        if serializer.is_valid():
           a = serializer.save()
           if a:
              json = serializer.data
              return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MouchardList(APIView):
   permission_classes = [AllowAny]
   def get(self, request):

      cursor = connection.cursor()
 
      query="select m.anciennevaluer,m.nouvellevaluer,m.objet,m.datenow,m.idper_modifie,m.employe_id ,u.user_name,u.last_name,u.matricule  from syspointage_mouchard as m left join syspointage_newuser as u on u.id=m.employe_id"
      #query="select anciennevaluer,nouvellevaluer,objet,datenow,p.user_name,u.user_name,u.matricule from syspointage_mouchard as m,syspointage_newuser p,syspointage_newuser u"
      cursor.execute(query)
      r = cursor.fetchall()
      json_data = []
      nomp=''
      for obj in r:
          if NewUser.objects.filter(id=obj[4]):
             personne=NewUser.objects.filter(id=obj[4]).values('user_name','last_name')[0]
             nomp=personne.get('user_name')+" "+personne.get('last_name')
          json_data.append({"anciennevaluer":obj[0],"nouvellevaluer":obj[1],"objet":obj[2],"datenow":obj[3],"personne_name":obj[4],"employe_name":str(obj[6] +" "+obj[7]),"matriculeemploye":obj[8],"nomp":nomp})
      return JsonResponse(json_data, safe=False)

class WorkflowCongeCreateAPIView(APIView):
    def post(self, request):
        nom = request.data.get('nom')
        type_conge_id = request.data.get('type_conge')
        valideur_1_ids = request.data.get('valideur_1', [])
        valideur_2_ids = request.data.get('valideur_2', [])
        valideur_3_ids = request.data.get('valideur_3', [])
        valideur_4_ids = request.data.get('valideur_4', [])
        departement_id = request.data.get('departement')

      
        workflow_conge = WorkflowConge.objects.create(
            nom=nom,
            type_conge_id=type_conge_id,
            departement_id=departement_id
        )
        workflow_conge.valideur_1.set(valideur_1_ids)
        workflow_conge.valideur_2.set(valideur_2_ids)
        workflow_conge.valideur_3.set(valideur_3_ids)
        workflow_conge.valideur_4.set(valideur_4_ids)

        return Response({'message': 'WorkflowConge created successfully'})

class export_mensuelle_excel(APIView):
      permission_classes = [AllowAny]
      def get(self, request,**kwargs):
         ttzero=datetime.strptime("00:00:00","%H:%M:%S").time()
         response=HttpResponse(content_type="application/ms-excel")
         response['content-Disposition']='attachment;filename=Expenses'+\
         str(datetime.now())+'.xls'
         wb=xlwt.Workbook(encoding='utf-8')
         ws=wb.add_sheet('Expenses')
         row_num=0
         font_style=xlwt.XFStyle()
         font_style.font.blod=True
         columns=["matricule","Nom et prénom","heurebase","Régime","date","date de début","datefin"]
         for col_num in range(len(columns)):
            ws.write(row_num,col_num,columns[col_num],font_style)
         font_style=xlwt.XFStyle()
         horaires=horairejour.objects.values_list('debut','fin','debutpause','finpause')
         listids=request.query_params.getlist('id')[0].split(',')
         date1=datetime.strptime(kwargs['date1'],"%Y-%m-%d").date()
         date2=datetime.strptime(kwargs['date2'],"%Y-%m-%d").date()
         json_data=[]
         presencenor=0.0


         for y in listids:
            queryplanning=NewUser.objects.filter(id=y).prefetch_related('planningemp')
            for test in queryplanning:
               listaidplanings=list(test.planningemp.values('id'))
            
            for ss in daterangemonths (date1,date2):
               
               dayss=calendar.monthrange(ss.year, ss.month)[1]
               for single_date in daterange(ss,(datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=dayss+1)).date()):
                   day=findDay(str(single_date))
                   testplaning=SearchPlaning(str(single_date),listaidplanings)
                   a=searchDay(single_date,y,testplaning)
                   if str((a[3])[0])=="0":
                      json_data.append((NewUser.objects.filter(id=y).values()[0].get('matricule'),NewUser.objects.filter(id=y).values()[0].get('user_name')+" "+NewUser.objects.filter(id=y).values()[0].get('last_name'),"00:00:00","J",str(single_date),'',''))
                   else:
                      json_data.append((NewUser.objects.filter(id=y).values()[0].get('matricule'),NewUser.objects.filter(id=y).values()[0].get('user_name')+" "+NewUser.objects.filter(id=y).values()[0].get('last_name'),str((a[3])[0]),"J",str(single_date),'',''))
                     
               for i in range (len(json_data)):

                   presencenor=presencenor+minute_interval(ttzero,datetime.strptime(str(json_data[i][2]),'%H:%M:%S').time())           
               json_data.append((NewUser.objects.filter(id=y).values()[0].get('matricule'),NewUser.objects.filter(id=y).values()[0].get('user_name')+" "+NewUser.objects.filter(id=y).values()[0].get('last_name'),minutes_hours(presencenor),"M",'',ss,(datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=dayss+1)).date()))
               
                     
               for row in json_data:
                   row_num+=1
                   for col_num in range(len(row)):

                       ws.write(row_num,col_num,str(row[col_num]),font_style)   
               json_data=[]
               presencenor=0.0
         wb.save(response)
         return response
class CreateListTeletravail(generics.ListCreateAPIView):
   queryset=Conges.objects.filter(teletravail=True).all()
   serializer_class=congesSerializer
   permission_classes = [AllowAny]
class UpdateDeleteTeletravail(generics.RetrieveUpdateDestroyAPIView):
   queryset=Conges.objects.filter(teletravail=True).all()
   serializer_class=congesSerializer
   permission_classes = [AllowAny]
class TeletravailListbyId(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = congesSerializer
    
   
    def get_queryset(self):
      q = self.request.query_params.get('id')
      return Conges.objects.filter(~Q(validationrh=1),employes=q,teletravail=True).all()

class Historiquecreate(APIView):
    permission_classes = [AllowAny]
    def post(self, request,**kwargs):
        dataa={}    
        dataa['anciennevaluer']=kwargs['previous']
        dataa['nouvellevaluer']=kwargs['new']
        dataa['employe']=kwargs['idemploye']
        dataa['idper_modifie']=kwargs['idpersonne']
        dataa['datenow']=datetime.now()
        dataa['valeursolde_ajoute']=kwargs['soldeajoute']
        dataa['commentaire']=kwargs['commentaire']
        serializer = HistoriqueSerializer(data=dataa)
    
        if serializer.is_valid():
           a = serializer.save()
           if a:
              json = serializer.data
              return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
class HistoriqueList(generics.ListAPIView):   
    queryset=Historique.objects.all()
    serializer_class=HistoriqueSerializer
    permission_classes = [AllowAny]


@csrf_exempt
def DeleteHistorique_solde(request,**kwargs):
    his=Historique.objects.filter(id=kwargs['id'])
   
    if his.count()>0:
      employe=his.values()[0].get('employe_id')
 
      soldeajoute=his.values()[0].get('valeursolde_ajoute')
      soldeemploye=NewUser.objects.filter(id=employe).values()[0].get('solde')
    
      solde=soldeemploye-soldeajoute
      NewUser.objects.filter(id=employe).update(solde=solde)
      his.delete()
    return HttpResponse(status=200)

class updateSoldeUser(APIView):
   permission_classes = [AllowAny]
   def put(self, request, *args, **kwargs):
         iduser=request.data.get('employes')
        
         soldeactuelle=NewUser.objects.filter(id=iduser).values()[0].get('solde')
         
         sold=float(request.data.get('sol'))

         if soldeactuelle==None:
            soldeactuelle=0
         soldeupdate=soldeactuelle+sold

         NewUser.objects.filter(id=iduser).update(solde=float(soldeupdate))
         json=NewUser.objects.filter(id=iduser).values()[0]
              
         return Response(json, status=status.HTTP_200_OK)

class ChartAbsenceList(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        
        jsondata=[]
        idarboresence=self.kwargs['pk']
        query = 'WITH children  AS  (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
        cursor = connection.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        jourtravai=0
        auth=0
        aa=0
        mission=0
        conge=0
        absence=0
        teletravail=0
        pre=0     
        listchart=[]
        listids=[]
        datenow=datetime.now().date()
        for obj in data:
               
              quer="SELECT u.id from syspointage_newuser_arborescence as ua,syspointage_arborescence as a,syspointage_newuser as u left join syspointage_role as r on  r.id=u.role_id where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id"%str(int(''.join(map(str, obj))))
              #is_active=1 c'a dire emlpoyés non partis ont un compte active
              cc=connection.cursor()
              cc.execute(quer)
              employes=cc.fetchall()
              json_data = []
              for objj in employes:
                 listids.append(objj[0])
       
        for u in listids:  
            a=Rapportunjour(int(u),str(datenow))
            if a:
               jsondata.append({"motif":a[0]["motif"], "lateEntree":a[0]["lateEntree"]})    
        for objj in jsondata:
            
            if objj['lateEntree']!="0.0" and objj['lateEntree']!="0":
               aa=aa+1
            if objj['motif']=='Autorisation':
               auth=auth+1
            if objj['motif'] =="Congé":
               conge=conge+1
                    

            if objj['motif']=="Mission":
               mission=mission+1

            if objj['motif']=="Téletravail":
               teletravail=teletravail+1
            if objj['motif']=="" or objj['motif']=="Pointage impair" or objj['motif']=="Pointage manquant" or objj['motif']=="Abs demi-journée":
               pre=pre+1    
            if objj['motif']=="Absent" or objj["motif"]=="Absence justifié" or objj["motif"]=="Absence non justifié" :
               absence=absence+1  
            #if objj['motif']=='pas de planning':
               #pp=pp=+1   
        listchart.append({"name":"nombre  des autorisations","nombre":auth})
        listchart.append({"name":"nombre  des retards","nombre":aa})
        listchart.append({"name":"nombre  des congés","nombre":conge})
        listchart.append({"name":"nombre  des absences","nombre":absence})
        listchart.append({"name":"nombre  des missions","nombre":mission})
        listchart.append({"name":"nombre  des Téletravails","nombre":teletravail})
        listchart.append({"name":"nombre  des présences","nombre":pre})
        #listchart.append({"name":"pas de planning","nombre":pp})       
        return JsonResponse(listchart,safe=False)
#cette fonction retourne la liste des pointages d' aujourd'hui de département (interface indicateurs)
class ListPointageByDepartement(generics.ListAPIView):
   permission_classes = [AllowAny]
   def get(self, request, pk):
     id=self.kwargs['pk']

     query="select p.id,p.date_pointage,p.employes_id,u.user_name,u.last_name from syspointage_pointage as p inner join syspointage_newuser as u on u.id=p.employes_id  inner join syspointage_newuser_arborescence as ua on ua.newuser_id=p.employes_id inner join syspointage_arborescence as a on a.id=ua.arborescence_id where  a.id=%s  and CONVERT( DATE,p.date_pointage)='%s'"%(id,datetime.now().date())
     c = connection.cursor()
     c.execute(query)
     data = c.fetchall()
     pointages=[]

     for obj in data:
         pointages.append({"id":obj[0],"date":obj[1],"employe_id":obj[2],"user_name":obj[3],"last_name":obj[4]})
     return JsonResponse(pointages,safe=False)

     
class Emailscreate(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format='json'):
        Emails.objects.all().delete()
        for obj in request.data:
            #if Emails.objects.filter(value=obj['value']).exists() or Emails.objects.filter(value=obj['value'].split('_')[1]).exists():
               #print('exists')
            #else:
            
            if "_" in obj['value']:
               a=Emails.objects.bulk_create([Emails(label=obj['label'],value=obj['value'].split('_')[1])])
            else:
               a=Emails.objects.bulk_create([Emails(label=obj['label'],value=obj['value'])])   
        
        if a :
           
           return Response(a, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class GetEmails(generics.ListAPIView):
   queryset=Emails.objects.all()
   serializer_class=EmailsSerializer       
   permission_classes=[AllowAny]

class LesretardsParSemaine(APIView):
  permission_classes = [AllowAny]
  def get(self,request,pk,**kwargs):
   
    retardssemaine=[]

    end=datetime.now()- timedelta(days=1)
    start=end-timedelta(days=7)
    retard=0.0
    listids=[]
    nomprenom=[]
  
    if kwargs['employes']=="true":
         qq='select u.last_name,u.user_name,u.id from  syspointage_newuser as u inner join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id inner join syspointage_arborescence as a on a.id=ua.arborescence_id where  a.id=%s'%self.kwargs['pk']
         cursor = connection.cursor()
         cursor.execute(qq)
         data = cursor.fetchall()    
         for obj in data:
            listids.append(obj[2])
          
    else:
      listids.append(self.kwargs['pk'])
        
    print(listids)
    for single_date in daterange(start.date(), end.date()):
        date=str(single_date)
        retard=0.0
        anticipe=0.0
        for idemploye in listids:

            a=Rapportunjour(int(idemploye),date)
            day=findDay(date)
            if a:
               
               retard=retard+float(a[0]['lateEntree'])
               anticipe=anticipe+float(a[0]['earlySortie'])
               if a[0]['lateEntree']!="0.0":
                 
                  uu=NewUser.objects.filter(id=idemploye).values('user_name','last_name')[0]
                  nomprenom.append(uu.get('user_name')+" "+uu.get('last_name'))
               
         
        retardssemaine.append({"day":day,"retard":retard,"nomprenom":nomprenom,"anticipe":anticipe})  
        nomprenom=[] 
    
    return JsonResponse(retardssemaine,safe=False)  

class MyTokenVerifyView(TokenVerifyView):
   serializer_class=MyTokenVerifySerializer         

class AnnullerCongeEmploye(APIView):

   permission_classes = [AllowAny]
   def get_object( self,request,  pk):

       try:
          return Conges.objects.get(id=pk)
       except Conges.DoesNotExist:
          return None    
class AnnullerCongeEmploye(APIView):
    permission_classes = [AllowAny]

    def put(self, request, pk, *args, **kwargs):
        try:
            if Conges.objects.filter(id=pk).exists():
                Conges.objects.filter(id=pk).update(validation=5, remarqueemploye=request.data.get("remarqueemploye"))

                conges_instance = Conges.objects.get(id=pk)
                empl_id = conges_instance.employes_id
                motif_id = conges_instance.motif_abs_id
                new_user = NewUser.objects.get(id=empl_id)
                motfi= motif_abs.objects.get(id=motif_id)
                nbjoursdemande = conges_instance.nbjours + float(new_user.solde)
                if float(motfi.nbjours_retire) != 0.0 :
                 
                   teee = nbjoursdemande * float(motfi.nbjours_retire)
                   NewUser.objects.filter(id=empl_id).update(solde=float(teee))

                print("test")
                return Response({"message": "Successfully updated."}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Conges does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Conges.DoesNotExist:
            return Response({"message": "Conges does not exist."}, status=status.HTTP_400_BAD_REQUEST)
         
class RapportConges(APIView):
   permission_classes = [AllowAny]
   def put(self, request, *args, **kwargs):

        print('rrrrrrr',type(request.data.get('listids')))
        listids=request.data.get('listids').split(',')
        l=[]

        for idd in listids:
            print(idd)
            l+=Conges.objects.filter(datedebut__lte=request.data.get('datefin'), datefin__gte=request.data.get('datedebut'),employes=idd).all()
            
        serializer=congesSerializer(l,many=True)
        
        json=serializer.data

              
        return Response(json, status=status.HTTP_200_OK)
      
class AffichageContrats(APIView):
   permission_classes = [AllowAny]
 
   
   def get(self, request, pk):
  
        a=arborescence.objects.values().all()
        u=False
        c=NewUser.objects.select_related('role').filter(role__DRH=True,id=self.kwargs['pk'])
        pp=NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['pk'])
        listids=[]
        if pp or c :
                 listEmployes=DetailsContratsEmployes.objects.all()   
        else:     
            for b in a:#parccourir la liste d'arboresence
               
                  print(b)
                  if(self.kwargs['pk']==b.get('chef_id') or self.kwargs['pk']==b.get('rh_id') or self.kwargs['pk']==b.get('rh2_id')):#id id dans url de l'employé (front) égale à chef id of arboresence 
                     
                     idarboresence=b.get('id')
                     print(idarboresence)
                     #query pour parccourir la liste children of departement
                     query = 'WITH children  AS  (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
                  
                     cursor = connection.cursor()
                     cursor.execute(query)
                     data = cursor.fetchall()
                     print(data)
                     for obj in data:

                        qu="SELECT u.id  from syspointage_newuser as u, syspointage_newuser_arborescence as ua,syspointage_arborescence as a where ua.arborescence_id =%s and ua.newuser_id=u.id  and a.id=ua.arborescence_id"%str(int(''.join(map(str, obj)))) 
                        cc = connection.cursor()
                        cc.execute(qu)
                        idss = cc.fetchall()
                        print('rrr',idss)
                        for i in idss:
                            listids.append(int(''.join(map(str, i))))
                     print('zzz',listids)
            listEmployes=DetailsContratsEmployes.objects.filter(employe__in=listids).all()

        serializer=DetailsContratsEmployesSerializer(listEmployes,many=True)
         
        json=serializer.data                            
        return JsonResponse(json,safe=False)
class AffichageEmployesbyDepartement(APIView):
   permission_classes = [AllowAny]
   def get(self, request, pk):
      iddepartement=self.kwargs['pk']
      lista=[]
      query="select u.user_name,u.last_name,matricule,r.rolename,u.activite from syspointage_newuser_arborescence as ua,syspointage_arborescence as a, syspointage_newuser as u left join syspointage_role as r on r.id=u.role_id where a.id=ua.arborescence_id and u.id=ua.newuser_id and  a.id=%s"%iddepartement
      cursor = connection.cursor()
      cursor.execute(query)
      data = cursor.fetchall()    
      for obj in data:
         lista.append({"user_name":obj[0],"last_name":obj[1],"matricule":obj[2],"role":obj[3],"activite":obj[4]})     
      return  JsonResponse(lista,safe=False)
class createlistpause(generics.ListCreateAPIView):
    queryset=Pauses.objects.all()
    serializer_class=PauseSerializer
    permission_classes = [AllowAny]
class updatedeletepause(generics.RetrieveUpdateDestroyAPIView):
    queryset=Pauses.objects.all()
    serializer_class=PauseSerializer 
    permission_classes = [AllowAny]  
class PointagesEmploye(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = PointageSerializer  
    def get_queryset(self):    
      return pointage.objects.filter(employes=self.kwargs['id']).all()
class DepartmentHierarchyView(APIView):
    def get(self, request):
        departments = arborescence.objects.all()
        hierarchy = []

        for department in departments:
            hierarchy.append({
                'id': department.id,
                'name': department.nom,
                'parent': department.parent.nom if department.parent else None,
            })

        return JsonResponse(hierarchy, safe=False)
class Pointagesofchefs(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        listEmployes=[]
        a=arborescence.objects.values().all()#get list of departments
        u=False
        pausename=''
        c=NewUser.objects.select_related('role').filter(role__DRH=True,id=self.kwargs['pk'])#quand utilisateur est connecté est un DRH  =>c est non vide
        pp=NewUser.objects.values().filter(is_superuser=True,id=self.kwargs['pk'])#quand utilisateur est connecté est un admin => utilisateur est non vide 
        if pp or c :# admin or DRH
                 #select all employees 
                 querr="SELECT u.user_name,u.last_name,p.date_pointage,p.etat,p.idpause_id from syspointage_newuser as u left join syspointage_pointage as p on p.employes_id=u.id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on a.id=ua.arborescence_id"
                 #is_active=1 c'a dire emlpoyés non partis ont un compte active
                 ccc=connection.cursor()
                 ccc.execute(querr)
                 employes=ccc.fetchall()
                 json_data = []
                 for objj in employes:
                     if objj[4]:
                        pausename=Pauses.objects.filter(id=objj[4]).values('nom')[0].get('nom')
                     json_data.append({"user_name":objj[0],"last_name":objj[1],"date_pointage":objj[2],'etat':objj[3],"pausename":pausename})
                 listEmployes.extend(list(json_data))
                
                 return JsonResponse(listEmployes, safe=False)
        else:
            for b in a:#parccourir la liste de départements
               
                  #si l'utlisateur connecté est un chef ou rh1(manager en ms solutions) ou rh2(manager en ms solutions)
                  if(self.kwargs['pk']==b.get('chef_id') or self.kwargs['pk']==b.get('rh_id') or self.kwargs['pk']==b.get('rh2_id')):#id id dans url de l'employé (front) égale à chef id of arboresence 
      
                     idarboresence=b.get('id')
                  
                     #query pour parccourir la liste children of departement
                     query = 'WITH children  AS  (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence
                  
                     cursor = connection.cursor()
                     cursor.execute(query)
                     data = cursor.fetchall()
                     for obj in data:
                        #select employess
                        quer="SELECT u.user_name,u.last_name,p.date_pointage,p.etat,p.idpause_id from syspointage_newuser as u left join syspointage_pointage as p on p.employes_id=u.id left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on a.id=ua.arborescence_id where ua.arborescence_id =%s"%str(int(''.join(map(str, obj))))

                        #is_active=1 c'a dire emlpoyés non partis ont un compte active
                        cc=connection.cursor()
                        cc.execute(quer)
                        employes=cc.fetchall()
                        json_data = []
                        for objj in employes:
                           if objj[4]:
                              pausename=Pauses.objects.filter(id=objj[4]).values('nom')[0].get('nom')
                           json_data.append({"user_name":objj[0],"last_name":objj[1],"date_pointage":objj[2],'etat':objj[3],"pausename":pausename})

                        listEmployes.extend(list(json_data))
                 
        return JsonResponse(listEmployes, safe=False)
     