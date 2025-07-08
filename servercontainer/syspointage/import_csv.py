from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db import connection
from rest_framework.views import APIView 
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
import pandas as pd
import csv 
from rest_framework import status
from rest_framework.response import Response 
from django.utils.dateparse import parse_date
from datetime import datetime
from . models import  *
from django.http import JsonResponse,HttpResponse

class ImportUserCSV(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if 'file' not in request.FILES:
            return JsonResponse({"error": "Aucun fichier fourni"}, status=400)

        csv_file = request.FILES["file"]

        if not csv_file.name.endswith('.xlsx'):
            return JsonResponse({"error": "Le fichier doit être au format Excel (.xlsx)"}, status=400)

        fs = FileSystemStorage()
        file_name = fs.save(csv_file.name, csv_file)
        tmp_file = fs.path(file_name)

        try:
            data = pd.read_excel(tmp_file, engine="openpyxl")
        except Exception as e:
            return JsonResponse({"error": f"Erreur lors de la lecture du fichier : {str(e)}"}, status=400)

        required_columns = [
            "Actif/Inactif", "Matricule", "Civilité", "Nom et prénom", "Intitulé établissement", 
            "Département", "Poste Occupé", "LIGNE DE PRODUCTION", "superviseur", "Poste", 
            "TYPE DE TRAVAIL", "Catégorie SAGE FC", "Date d'embauche société", 
            "Date pour titulariser", "Date de départ", "MOTIFS DEPART", 
            "Type depart", "Type de contrat", "Statut", "Date début contrat CDD", "Date Fin contrat CDI",
            "Date début contrat CAIP", "Date Fin contrat CAIP", "1er Contrat SAGE TUNISIA", "MOIS d'embauche", 
            "Année d'embauche", "Année Titularisation", "Ancienneté", "Tranche d'Ancienneté", 
            "DATE DE NAISSANCE", "AGE", "Tranche d'age", "CNSS", "Clé CNSS", "CIN", "Date Délivrance CIN", 
            "HOMME / FEMME", "Situation Familial", "N°enfant", "Niveau scolaire", "Echelon", 
            "Prochaine Date d'echelon", "Type de Salaire", "COUT/H", "BANQUE", "RIB VIREMENT", 
            "Vérif Nbr Rib", "ADRESSE", "COMMUNE", "CODE POSTALE", "Visite Médicale", "N° TELEPHONE", 
            "N° TELEPHONE CONTACT FAM", "DESTINATION", "Département Bulletin", "Level"
        ]

        missing_columns = [str(col) for col in required_columns if col not in data.columns]
        if missing_columns:
            return JsonResponse(
                {"error": f"Colonnes manquantes dans le fichier : {', '.join(missing_columns)}"},
                status=400
            )

        def clean_value(value, default="", as_int=False, as_bool=False, as_date=False, as_float=False):
            if pd.isna(value) or value in ["", "NaT", None]:
                return None if isinstance(default, datetime) else default
            try:
                if as_bool:
                    return str(value).strip().lower() in ["1", "true", "yes", "oui"]
                if as_int:
                    return int(float(value))
                if as_float:
                    return float(value)
                if as_date:
                    return parse_date(str(value).split(" ")[0])
            except (ValueError, TypeError):
                return default
            return str(value).strip()


        users_added = False
        empty_matricule_rows = []

        for index, row in data.iterrows():
            matricule = int(row["Matricule"]) if not pd.isna(row["Matricule"]) else None
            if not matricule:
                empty_matricule_rows.append(index + 2)
                continue

            if NewUser.objects.filter(matricule=matricule).exists():
                continue

            arborescence_obj = arborescence.objects.filter(nom=str(row["Département"])).first()
            role_name = str(row["Poste Occupé"]).strip()
            role_obj = role.objects.filter(rolename=role_name).first()


            try:
                new_user = NewUser.objects.create(
                    matricule=matricule,
                    civilite=clean_value(row["Civilité"]),
                    user_name=clean_value(row["Nom et prénom"]),
                    intitule_etablissement=clean_value(row["Intitulé établissement"]),
                    role=role_obj,
                    ligne_de_production=clean_value(row["LIGNE DE PRODUCTION"]),
                    superviseur=clean_value(row["superviseur"]),
                    poste=clean_value(row["Poste"]),
                    type_de_travail=clean_value(row["TYPE DE TRAVAIL"]),
                    categorie_sage_fc=clean_value(row["Catégorie SAGE FC"]),
                    date_titularisation=clean_value(row["Date pour titulariser"], default=None, as_date=True),
                    date_depart_societe=clean_value(row["Date de départ"], default=None, as_date=True),
                    date_debut_contrat_cdd=clean_value(row["Date début contrat CDD"], default=None, as_date=True),
                    date_fin_contrat_cdd=clean_value(row["Date Fin contrat CDI"], default=None, as_date=True),
                    date_debut_contrat_caip=clean_value(row["Date début contrat CAIP"], default=None, as_date=True),
                    date_fin_contrat_caip=clean_value(row["Date Fin contrat CAIP"], default=None, as_date=True),
                    premier_contrat_sage_tunisia=clean_value(row["1er Contrat SAGE TUNISIA"]),
                    mois_embauche=clean_value(row["MOIS d'embauche"]),
                    annee_embauche=clean_value(row["Année d'embauche"], default=0, as_int=True),
                    annee_titularisation=clean_value(row["Année Titularisation"], default=0, as_int=True),
                    anciennete=clean_value(row["Ancienneté"], default=0, as_int=True),
                    tranche_anciennete=clean_value(row["Tranche d'Ancienneté"]),
                    datedenaissance=clean_value(row["DATE DE NAISSANCE"], default=None, as_date=True),
                    age=clean_value(row["AGE"], default=0, as_int=True),
                    tranche_age=clean_value(row["Tranche d'age"]),
                    cnss=clean_value(row["CNSS"]),
                    CIN=clean_value(row["CIN"]),
                    date_delivrance_cin=clean_value(row["Date Délivrance CIN"], default=None, as_date=True),
                    sex=clean_value(row["HOMME / FEMME"]),
                    nbenfants=clean_value(row["N°enfant"], default=0, as_int=True),
                    niveau_scolaire=clean_value(row["Niveau scolaire"]),
                    echelon=clean_value(row["Echelon"]),
                    prochaine_date_echelon=clean_value(row["Prochaine Date d'echelon"], default=None, as_date=True),
                    type_salaire=clean_value(row["Type de Salaire"]),
                    cout_h=clean_value(row["COUT/H"], default=None, as_float=True),
                    banque=clean_value(row["BANQUE"]),
                    rib_virement=clean_value(row["RIB VIREMENT"]),
                    verif_nbr_rib=clean_value(row["Vérif Nbr Rib"], default=False, as_bool=True),
                    adresse=clean_value(row["ADRESSE"]),
                    commune=clean_value(row["COMMUNE"]),
                    code_postale=clean_value(row["CODE POSTALE"]),
                    visite_medicale=clean_value(row["Visite Médicale"],default=False, as_bool=True),
                    tel=clean_value(row["N° TELEPHONE"]),
                    telephone_contact_fam=clean_value(row["N° TELEPHONE CONTACT FAM"]),
                    destination=clean_value(row["DESTINATION"]),
                    departement_bulletin=clean_value(row["Département Bulletin"]),
                    matricule_p=matricule
                )

                if arborescence_obj:
                    new_user.arborescence.add(arborescence_obj)
                new_user.save()
                users_added = True

            except Exception as e:
                print(f"Erreur lors de l'insertion de l'utilisateur {matricule} : {e}")

        if empty_matricule_rows:
            print(f"Matricules manquants aux lignes : {', '.join(map(str, empty_matricule_rows))}")

        if not users_added:
            return Response({"message": "Aucun nouvel utilisateur ajouté. Tous existent déjà."}, status=201)

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