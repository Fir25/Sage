from . calcul_func import *
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db import connection
from rest_framework.views import APIView 
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
import pandas 
import csv 
from rest_framework import status
from rest_framework.response import Response 
from django.utils.dateparse import parse_date

class ImportUserCSV(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if 'file' in request.FILES:
           pass
         
        else:
  
            return HttpResponse(status=400) 
        csv_file = request.FILES["file"]
        content = csv_file.read()  # these are bytes
        file_content = ContentFile(content)
        fs = FileSystemStorage()
        file_name = fs.save("_tmp.csv", file_content)
        tmp_file = fs.path(file_name)

        # Read Excel file into a pandas DataFrame skipping the first row
        data = pandas.read_excel(tmp_file, header=None)
        users_added = False
        header_row = None
        for index, row in data.iterrows():
            if all(col_name in row.values for col_name in ["Matricule", "Nom", "Prénom", "CIN/ PASSEPORT", "Date de naissance", "Date d'embauche", "Activité", "Statut", "Sexe", "Situation Sociale"]):
                header_row = index
                break

        # If header is found, re-read the file with the correct header row
        if header_row is not None:
            data = pandas.read_excel(tmp_file, header=header_row)
         
            
            for index, row in data.iterrows():
                if row[5] and row[0]:
                    invalid_fields = []
                    matricule = int(row[0]) if row[0] is not None else None
                    user_name = str(row[1]) if row[1] is not None else None
                    last_name = str(row[2]) if row[2] is not None else None
                    cin = str(row[3]) if row[3] is not None else None
                    sex = str(row[8]) if row[8] is not None else None
                    statuss = 1 if str(row[7]) == "En activité" else 0 if row[7] is not None else None
                   
                    naissance = row[4].to_pydatetime().date()  if row[4] else None 
                    demarage = row[5].to_pydatetime().date() if row[5] else None 
                   

                    situation = str(row[9]) if row[9] is not None else None
                    arborescence_obj = arborescence.objects.filter(nom=str(row[6])).first() if arborescence.objects.filter(nom=str(row[6])).first()  else None
                    activite = arborescence_obj.id if arborescence_obj else None
                
                
              
                if None in (matricule, user_name, last_name, cin, sex, statuss, naissance, demarage, situation, activite):
                     invalid_fields.extend([
                    "matricule" if matricule is None else "",
                    "user_name" if user_name is None else "",
                    "last_name" if last_name is None else "",
                    "cin" if cin is None else "",
                    "sex" if sex is None else "",
                    "statuss" if statuss is None else "",
                    "naissance" if naissance is None else "",
                    "demarage" if demarage is None else "",
                    "situation" if situation is None else "",
                     "activite" if activite is None else ""
                     ])
                     return Response({"Le fichier contient des données Non valides : " + ', '.join(filter(None, invalid_fields))}, status=400)
               
            
   
                if not NewUser.objects.filter(matricule=matricule).exists():
                        
                        new_user = NewUser(
                            matricule=matricule,
                            user_name= user_name , 
                            last_name= last_name , 
                            password='admin',  
                            CIN=cin , 
                            sex=sex , 
                            situation_sociale = situation ,
                            datedemarrage = demarage,
                            datedenaissance = naissance,
                            activite = statuss
                        )
                        new_user.save()
                        users_added = True
                        new_user.arborescence.add(arborescence_obj)
                        
                else:
                        
                        pass
                      
        if not users_added:
            return Response({ "Tous les utilisateurs du fichier existent déjà"}, status=409)
        return HttpResponse(status=200)
class ImportPointageCSV(APIView):
     permission_classes = [AllowAny]
     def post(self, request ):
         csv_file = request.FILES["file"]
         content = csv_file.read()  # these are bytes
         file_content = ContentFile(content)
         fs = FileSystemStorage()
         file_name = fs.save(
               "_tmp.csv", file_content
         )
         
         tmp_file = fs.path(file_name)
         
         with open(tmp_file) as file:
            next(file)#remove the first line
            reader = csv.reader(file)

            for row in reader:
               
               if row[5] and row[0]:
              
                  if NewUser.objects.filter(matricule=str(row[5]).split('(')[0]).exists(): 

                     if pointage.objects.filter(date_pointage=row[0],employes=NewUser.objects.filter(matricule=str(row[5]).split('(')[0]).values()[0].get('id')).exists(): 
                        print('exists')
                     else:
                           
                           a = pointage(date_pointage=str(row[0]),
                                    employes=NewUser.objects.filter(matricule=str(row[5]).split('(')[0]).get(),
                                 pointeuse_id=pointeuse.objects.filter(SIV=row[2]).values('id')[0].get('id')
                                 )
                           a.save()        
         return HttpResponse(status=200) 