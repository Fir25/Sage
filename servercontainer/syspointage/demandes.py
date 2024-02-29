from . calcul_func import *
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db import connection
from rest_framework.views import APIView
class AffichageDemendesAut(APIView):#demande congés autorisation mission
    permission_classes = [AllowAny]
    def get(self, request,pk):
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.validation,c.datedebut,c.datefin,m.motif,n.solde,c.heure_debut,c.heure_fin,c.date_autorisation,c.id,c.mission,c.validation,c.teletravail,n.last_name,c.contact,c.adresse,c.personneinterimaire_id,c.commentaire,c.nbjours,c.destination,c.villedepart,c.transport,c.commentaire,c.matindebut,c.matinfin,n.soldemaladie,c.validationrh,c.validationrh2 FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id where n.id=%s and   m.motifautorisation=1 "%(idemploye))
       data = cursor.fetchall()
       json_data = []
       for obj in data:
           personneinterimaire=''
           if obj[16]!=None:
              perinterimaire=NewUser.objects.filter(id=obj[16]).values('user_name','last_name')[0]
              personneinterimaire=perinterimaire.get('user_name')+" "+perinterimaire.get('last_name')
           json_data.append({"user_name":obj[0],"validation":obj[1],"datedebut":obj[2],"datefin":obj[3],"motif":obj[4],"solde":obj[5],"heure_debut":obj[6],"heure_fin":obj[7],"date_autorisation":obj[8],"idconge":obj[9],"mission":obj[10],"validation":obj[11],"teletravail":obj[12],"last_name":obj[13],"contact":obj[14],"adresse":obj[15],"personneinterimaire":personneinterimaire,"commentaire":obj[17],"nbjourscoupes":obj[18],"destination":obj[19],"depart":obj[20],"transport":obj[21],"commentaire":obj[22],"matindebut":obj[23],"matinfin":obj[24],"soldemaladie":obj[25],"validationrh":obj[26],"validationrh2":obj[27]})
       return JsonResponse(json_data, safe=False)

class AffichageDemandeRH(APIView):#demande congés autorisation mission
   permission_classes = [AllowAny]
   def get(self, request,pk):
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.validation,m.motif,c.id,n.last_name , c.commentaire FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id where n.id=%s and m.motifdemanderh=1"%(idemploye))
       data = cursor.fetchall()
       json_data = []
       for obj in data:
          
           json_data.append({"user_name":obj[0],"validation":obj[1],"motif":obj[2],"idconge":obj[3],"last_name":obj[4] , "commentaire": obj[5]})
       return JsonResponse(json_data, safe=False)      
   
class AffichageDemandePointage(APIView):#demande congés autorisation mission
   permission_classes = [AllowAny]
   def get(self, request,pk):
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.validation,m.motif,c.id,n.last_name , c.commentaire , c.date_autorisation , c.heure_debut FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id where n.id=%s and m.motifpointage=1"%(idemploye))
       data = cursor.fetchall()
       json_data = []
       for obj in data:
          
           json_data.append({"user_name":obj[0],"validation":obj[1],"motif":obj[2],"idconge":obj[3],"last_name":obj[4] , "commentaire": obj[5] , "date_pointage" : obj[6] , "heure_pointage" : obj[7]})
       return JsonResponse(json_data, safe=False)     
   
class AffichageDemendesConges(APIView):#demande congés autorisation mission
   permission_classes = [AllowAny]
   def get(self, request,pk):
       cursor = connection.cursor()
       idemploye=self.kwargs['pk']
       cursor.execute("SELECT n.user_name,c.validation,c.datedebut,c.datefin,m.motif,n.solde,c.heure_debut,c.heure_fin,c.date_autorisation,c.id,c.mission,c.validation,c.teletravail,n.last_name,c.contact,c.adresse,c.personneinterimaire_id,c.commentaire,c.nbjours,c.destination,c.villedepart,c.transport,c.commentaire,c.matindebut,c.matinfin,n.soldemaladie,c.validationrh,c.validationrh2 FROM syspointage_newuser as n inner join  syspointage_conges as c  on c.employes_id=n.id left join  syspointage_motif_abs as m on c.motif_abs_id=m.id where n.id=%s and   m.motifConge=1 "%(idemploye))
       data = cursor.fetchall()
       json_data = []
       for obj in data:
           personneinterimaire=''
           if obj[16]!=None:
              perinterimaire=NewUser.objects.filter(id=obj[16]).values('user_name','last_name')[0]
              personneinterimaire=perinterimaire.get('user_name')+" "+perinterimaire.get('last_name')
           json_data.append({"user_name":obj[0],"validation":obj[1],"datedebut":obj[2],"datefin":obj[3],"motif":obj[4],"solde":obj[5],"heure_debut":obj[6],"heure_fin":obj[7],"date_autorisation":obj[8],"idconge":obj[9],"mission":obj[10],"validation":obj[11],"teletravail":obj[12],"last_name":obj[13],"contact":obj[14],"adresse":obj[15],"personneinterimaire":personneinterimaire,"commentaire":obj[17],"nbjourscoupes":obj[18],"destination":obj[19],"depart":obj[20],"transport":obj[21],"commentaire":obj[22],"matindebut":obj[23],"matinfin":obj[24],"soldemaladie":obj[25],"validationrh":obj[26],"validationrh2":obj[27]})
       return JsonResponse(json_data, safe=False)   