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
from . rapport_journal import Rapportunjoure

from . rapport_mensuel import rapportmensul
from . send_mail import send_email_template
from . valideurs_emails import get_validators_for_conge_and_department
import socket
from zk import ZK
def reset_all_passwords_to_test():
    new_password = 'test'
    for user in NewUser.objects.all():
        user.set_password(new_password)
        user.save()
    print("All passwords have been updated to 'test'.")
class DownloadAttendanceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pointeuse_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT adresse_ip, port, id FROM syspointage_pointeuse WHERE id = %s", [pointeuse_id])
                pointeuse = cursor.fetchone()

                if not pointeuse:
                    return JsonResponse({"error": "Pointeuse not found"}, status=404)

                ip_address = pointeuse[0]
                port = int(pointeuse[1])

                zk = ZK(ip_address, port=port, timeout=65, force_udp=False, ommit_ping=True)

                try:
                    conn = zk.connect()

                    attendances = conn.get_attendance()

                    for single in attendances:
                        att = str(single).split()

                        if att[3] and att[4]:
                            pointagedate = att[3] + " " + att[4]
                            matricule = att[1]

                            try:
                                test = int(matricule)

                                cursor.execute(
                                    "SELECT id FROM syspointage_newuser WHERE matricule_p = %s", [matricule]
                                )
                                user_result = cursor.fetchone()

                                if user_result:
                                    cursor.execute("""
                                        SELECT id FROM syspointage_pointage 
                                        WHERE date_pointage = %s 
                                        AND employes_id = %s
                                    """, [pointagedate, user_result[0]])
                                    existing_attendance = cursor.fetchone()

                                    if not existing_attendance:
                                        cursor.execute("""
                                            INSERT INTO syspointage_pointage (date_pointage, employes_id, pointeuse_id)
                                            VALUES (%s, %s, %s)
                                        """, [pointagedate, user_result[0], pointeuse[2]])
                                        connection.commit()

                            except ValueError:
                                print(f"Invalid matricule: {matricule}")

                    return JsonResponse({"message": "Attendance data downloaded and saved successfully"}, status=200)

                except Exception as zk_exception:
                    return JsonResponse({"error": f"Failed to connect to the device: {zk_exception}"}, status=500)

                finally:
                    if conn:
                        conn.disconnect()

        except Exception as e:
              return JsonResponse({"error": str(e)}, status=500)







class AjouterSuperviseur(APIView):
    def post(self, request):
        data = request.data
        superviseurs_ids = data.get('superviseurs', [])  # Liste des IDs envoyés depuis React

        if not superviseurs_ids:
            return JsonResponse({"message": "Aucun superviseur sélectionné"}, status=400)

        # Récupérer les labels depuis la table `syspointage_newuser`
        cursor = connection.cursor()
        query = "SELECT id, user_name, last_name, matricule FROM syspointage_newuser WHERE id IN %s"
        cursor.execute(query, (tuple(superviseurs_ids),))  # Paramètre sécurisé
        users = cursor.fetchall()

        # Ajouter les superviseurs avec le label complet
        for user in users:
            user_id, user_name, last_name, matricule = user
            superviseur_label = f"{user_name} {last_name} {matricule}" if last_name else f"{user_name} {matricule}"
            superviseur.objects.create(id=user_id, superviseurname=superviseur_label)  # Stocke le label directement

        return JsonResponse({"message": "Superviseurs ajoutés avec succès"}, status=201)
class Pointeuseconnectelist(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cursor = connection.cursor()
        cursor.execute("SELECT id, nom_pointeuse, adresse_ip,  port,etat  FROM syspointage_pointeuse")
        data = cursor.fetchall()
        json_data = []
        for obj in data:
            pointeuse_id = obj[0]
            nom_pointeuse = obj[1]
            adresse_ip = obj[2]
            port = obj[3]
            etat=obj[4]
            is_connected = False
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            try:
                sock.connect((adresse_ip, int(port)))  # Correcting the IP and port assignment
                is_connected = True  # Reachability confirmed
                sock.close()
            except socket.error:
                is_connected = False  # If there's an error, it's disconnected
            zk = ZK(adresse_ip, port=int(port), timeout=0.5, ommit_ping=True)

            try:
                conn = zk.connect()  # Attempt to connect to the device
                conn.disconnect()
                is_connected = True  # Device is successfully connected
            except Exception as e:
                print(f"Connection failed after reachability check: {e}")
                is_connected = False  # Device not connected
            json_data.append({
                "id": pointeuse_id,
                "nom_pointeuse": nom_pointeuse,
                "adresse_ip": adresse_ip,
                "port": port,
                "etat":etat,
                "is_connected": is_connected,
            })

        return JsonResponse(json_data , safe=False)
class UsersOfChef(generics.ListAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        listEmployes = []
        a = arborescence.objects.values().all()  # Liste des départements
        c = NewUser.objects.select_related('role').filter(role__DRH=True, id=self.kwargs['pk'])  # Vérification DRH
        pp = NewUser.objects.values().filter(is_superuser=True, id=self.kwargs['pk'])  # Vérification Admin
        
        if pp or c:  # Admin ou DRH
            # Requête SQL pour sélectionner tous les employés avec les nouveaux champs
            querr = """
                SELECT u."matricule", u."user_name", r."rolename", a."nom", u."id", u."email", 
                       u."datedemarrage", u."last_name", u."activite", s."nomsite", u."is_active", 
                       u."sex", u."matriculecnss", u."datedemarrage", u."datedenaissance", 
                       u."CIN", u."nbenfants", u."tel", u."commentaire", u."situation_sociale", 
                       u."teletravail", u."activite", u."matriculepaie", u."solde", 
                       u."superviseur", u."poste", u."type_de_travail", u."fonction_fiche_de_paie", 
                       u."date_titularisation", u."nbre_jours_restants_echeance", u."motifparti", 
                       u."type_depart", u."premier_contrat_sage_tunisia", u."mois_embauche", 
                       u."annee_embauche", u."annee_titularisation", u."tranche_anciennete", 
                       u."cle_cnss", u."date_delivrance_cin", u."niveau_scolaire", u."categorie", 
                       u."echelon", u."prochaine_date_echelon", u."type_salaire", u."cout_h", 
                       u."rib_banquaire", u."banque", u."adresse", u."commune", u."code_postale", 
                       u."visite_medicale", u."telephone_contact_fam", u."bien_de_la_societe", 
                       u."destination", u."departement_bulletin"
                FROM "syspointage_newuser" AS u
                LEFT JOIN "syspointage_role" AS r ON r."id" = u."role_id"
                LEFT JOIN "syspointage_newuser_arborescence" AS ua ON ua."newuser_id" = u."id"
                LEFT JOIN "syspointage_arborescence" AS a ON a."id" = ua."arborescence_id"
                LEFT JOIN "syspointage_site" AS s ON s."id" = u."site_id";
            """
            
            ccc = connection.cursor()
            ccc.execute(querr)
            employes = ccc.fetchall()
            json_data = []
            for objj in employes:
                json_data.append({
                    "matricule": objj[0], "user_name": objj[1], "role": objj[2], "Nomarbo": objj[3],
                    'id': objj[4], "email": objj[5], "datedemarrage": objj[6], "last_name": objj[7],
                    "activite": objj[8], "site": objj[9], "is_active": objj[10], "sex": objj[11],
                    "matriculecnss": objj[12], "datedemarrage": objj[13], "datedenaissance": objj[14],
                    "CIN": objj[15], "nbEnfants": objj[16], "tel": objj[17], "commentaire": objj[18],
                    "situation_sociale": objj[19], "teletravail": objj[20], "activite": objj[21],
                    "matriculepaie": objj[22], "solde": objj[23], "superviseur": objj[24], 
                    "poste": objj[25], "type_de_travail": objj[26], "fonction_fiche_de_paie": objj[27],
                    "date_titularisation": objj[28], "nbre_jours_restants_echeance": objj[29], 
                    "motif_depart": objj[30], "type_depart": objj[31], "premier_contrat_sage": objj[32], 
                    "mois_embauche": objj[33], "annee_embauche": objj[34], "annee_titularisation": objj[35], 
                    "tranche_anciennete": objj[36], "cle_cnss": objj[37], "date_delivrance_cin": objj[38], 
                    "niveau_scolaire": objj[39], "categorie": objj[40], "echelon": objj[41], 
                    "prochaine_date_echelon": objj[42], "type_salaire": objj[43], "cout_horaire": objj[44], 
                    "rib_bancaire": objj[45], "banque": objj[46], "adresse": objj[47], "commune": objj[48], 
                    "code_postal": objj[49], "visite_medicale": objj[50], "tel_contact_famille": objj[51], 
                    "bien_societe": objj[52], "destination": objj[53], "departement_bulletin": objj[54], 
                    
                })
            listEmployes.extend(list(json_data))
            return JsonResponse(listEmployes, safe=False)
        
        else:
            # Deuxième requête pour les utilisateurs sous un chef de département spécifique
            query = f"""
                SELECT u.matricule, u.user_name, r.rolename, a.nom, u.id, u.email, u.datedemarrage,
                       u.last_name, u.activite, s.nomsite, u.is_active, u.sex, u.matriculecnss, 
                       u.datedemarrage, u.datedenaissance, u.CIN, u.nbEnfants, u.tel, u.commentaire,
                       u.situation_sociale, u.teletravail, u.activite, u.matriculepaie, u.solde
                FROM syspointage_newuser AS u
                LEFT JOIN syspointage_role AS r ON r.id = u.role_id
                LEFT JOIN syspointage_newuser_arborescence AS ua ON ua.newuser_id = u.id
                LEFT JOIN syspointage_arborescence AS a ON a.id = ua.arborescence_id
                LEFT JOIN syspointage_arborescence_chefs AS uo ON a.id = uo.arborescence_id
                LEFT JOIN syspointage_site AS s ON s.id = u.site_id
                WHERE uo.newuser_id = %s
            """ % pk

            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            json_data = []
            for objj in data:
                json_data.append({
                    "matricule": objj[0], "user_name": objj[1], "role": objj[2], "Nomarbo": objj[3],
                    'id': objj[4], "email": objj[5], "datedemarrage": objj[6], "last_name": objj[7],
                    "activite": objj[8], "site": objj[9], "is_active": objj[10], "sex": objj[11],
                    "matriculecnss": objj[12], "datedemarrage": objj[13], "datedenaissance": objj[14],
                    "CIN": objj[15], "nbEnfants": objj[16], "tel": objj[17], "commentaire": objj[18],
                    "situation_sociale": objj[19], "teletravail": objj[20], "activite": objj[21],
                    "matriculepaie": objj[22], "solde": objj[23]
                })
            listEmployes.extend(list(json_data))
            return JsonResponse(listEmployes, safe=False)

    
class EmployesPartis(generics.ListAPIView):
    queryset = NewUser.objects.filter(is_active=False)  # Fetch inactive users
    serializer_class = CustomUserSerializer  # Serializer to use for output
    permission_classes = [AllowAny]  # Open access to this view


class QuitterEmploye(generics.RetrieveUpdateAPIView):
  def get(self,request,**kwargs):
      NewUser.objects.filter(id=kwargs['id']).update(is_active=False,motifparti=kwargs['motif'])#modification is_active=false=> utilisateur non connecté=>utilisateur parti
      return JsonResponse({"status":"success"}, safe=False)      
class SetEquipeView(APIView):
    def post(self, request):
        user_ids = request.data.get('userIds', [])
        equipe_id = request.data.get('equipeId')

        try:
            # Fetch the team by id, raise 404 if not found
            equipe = Equipe.objects.get(id=equipe_id)

            # Remove current team association for the users in the team
            NewUser.objects.filter(equipe_id=equipe_id).update(equipe=None)

            # Fetch the new users who will be assigned to this team
            users = NewUser.objects.filter(id__in=user_ids)

            for user in users:
                user.equipe = equipe  # Assign the team
                user.save()

            return Response({"message": "Equipe updated successfully"})
        
        except Equipe.DoesNotExist:
            return Response({"message": "Equipe not found"}, status=404)
        except Exception as e:
            return Response({"message": f"An error occurred: {str(e)}"}, status=500)

       
# class UsersOfDepartement(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request, **kwargs):
#         listEmployes = []

#         # Vérifier si les paramètres existent et ne sont pas vides
#         listids = request.query_params.getlist('id')
#         activite = request.query_params.getlist('idactivite')
#         ligne = request.query_params.getlist('idligne')

#         # Si la liste est vide, assigner une valeur par défaut
#         listids = listids[0].split(',') if listids else []
#         activite = activite[0].split(',') if activite else []
#         ligne = ligne[0].split(',') if ligne else []

#         # Convertir 'activite' en boolean si nécessaire
#         activite = [value.lower() in ['true', '1', 'si', 'yes'] for value in activite]

#         for idd in listids:
#             if idd:
#                 idarboresence = int(idd)
#                 query = '''
#                     WITH RECURSIVE children AS (
#                         SELECT id 
#                         FROM syspointage_arborescence 
#                         WHERE id=%s
#                         UNION ALL
#                         SELECT a.id
#                         FROM syspointage_arborescence a
#                         JOIN children c ON a.parent_id = c.id
#                     )
#                     SELECT id FROM children;
#                 '''

#                 cursor = connection.cursor()
#                 cursor.execute(query, [idarboresence])
#                 data = cursor.fetchall()

#                 for obj in data:
#                     query_params = [obj[0]]

#                     quer = '''
#                     SELECT u.user_name, u.id, u.last_name, u.email, u.datedemarrage, u.activite, u.site_id, u.matricule, l.lignename
#                     FROM syspointage_newuser_arborescence ua 
#                     JOIN syspointage_arborescence a ON a.id = ua.arborescence_id
#                     JOIN syspointage_newuser u ON ua.newuser_id = u.id 
#                     JOIN syspointage_ligne l ON l.id = u.id_ligne
#                     LEFT JOIN syspointage_role r ON r.id = u.role_id
#                     WHERE ua.arborescence_id = %s   AND u.is_active = ANY(%s::boolean[])
#                    AND (
#                          %s IS NULL OR l.id_ligne_id = ANY(string_to_array(%s, ',')::int[])
#                         );'''
                    

                 

#                     # Ajouter la condition sur `ligne` seulement si `ligne` est fourni
#                     if ligne:
#                         quer +=  '''AND (
#                          %s IS NULL OR l.id_ligne_id = ANY(string_to_array(%s, ',')::int[])
#                         );'''
#                         query_params.append(ligne)

#                     cursor.execute(quer, query_params)
#                     employes = cursor.fetchall()

#                     json_data = []
#                     for objj in employes:
#                         label = f"{objj[0]} {objj[2]} {objj[7]}" if objj[2] or objj[0] or objj[7] else "inconnu"

#                         json_data.append({
#                             "label": label,
#                             "value": objj[1],
#                             "email": objj[3],
#                             "datedemarrage": objj[4],
#                             "activite": objj[5],
#                             "site": objj[6],
#                             "ligne": objj[8],
#                         })

#                     listEmployes.extend(json_data)

#         return JsonResponse(listEmployes, safe=False)

class Usersdepequipe(APIView):
    permission_classes = [AllowAny]

    def get(self, request, **kwargs):
        listEmployes = []
        listids = request.query_params.getlist('id')[0].split(',')  # IDs of departments

        for idd in listids:
            if idd:
                idarborescence = int(idd)

                # Recursive CTE to get all sub-departments of the selected department
                query = '''
                    WITH RECURSIVE children AS (
                        SELECT id FROM syspointage_arborescence WHERE id = %s
                        UNION ALL
                        SELECT sa.id FROM children c
                        JOIN syspointage_arborescence sa ON sa.parent_id = c.id
                    )
                    SELECT id FROM children;
                '''
                cursor = connection.cursor()
                cursor.execute(query, [idarborescence])
                data = cursor.fetchall()

                for obj in data:
                    sub_dept_id = obj[0]  # Extract the department ID from the fetched result
                    
                    # Query to get employees associated with this sub-department
                    quer = '''
                        SELECT u.user_name, u.id, u.last_name, u.email, u.datedemarrage, u.activite, u.site_id
                        FROM syspointage_newuser_arborescence ua
                        JOIN syspointage_arborescence a ON a.id = ua.arborescence_id
                        JOIN syspointage_newuser u ON ua.newuser_id = u.id
                        LEFT JOIN syspointage_role r ON r.id = u.role_id
                        WHERE ua.arborescence_id = %s;
                    '''
                    cc = connection.cursor()
                    cc.execute(quer, [sub_dept_id])
                    employes = cc.fetchall()

                    json_data = []
                    for emp in employes:
                        json_data.append({
                            "label": f"{emp[0]} {emp[2]}",
                            "value": emp[1],
                            "email": emp[3],
                            "datedemarrage": emp[4],
                            "activite": emp[5],
                            "site": emp[6]
                        })

                    listEmployes.extend(json_data)

        return JsonResponse(listEmployes, safe=False)            

class UsersOfDepartement(APIView):
    permission_classes = [AllowAny]

    def get(self, request, **kwargs):
        listEmployes = []

        listids = request.query_params.getlist('id')
        activite = request.query_params.getlist('idactivite')
        ligne = request.query_params.getlist('idligne')
        superviseur = request.query_params.getlist('idsuperviseur')

        # Vérifiez si les listes contiennent des éléments avant de les utiliser
        listids = listids[0].split(',') if listids and listids[0] else []
        activite = [value.lower() in ['true', '1', 'si', 'yes'] for value in (activite[0].split(',') if activite and activite[0] else [])]
        ligne_list = ligne[0].split(',') if ligne and ligne[0] else []  # Vérification ligne
        superviseur_list = superviseur[0].split(',') if superviseur and superviseur[0] else [] 
        for idd in listids:
            if idd:
                idarboresence = int(idd)
                
                query = """
                    WITH RECURSIVE children AS (
                        SELECT id FROM syspointage_arborescence WHERE id = %s
                        UNION ALL
                        SELECT a.id FROM syspointage_arborescence a
                        JOIN children c ON a.parent_id = c.id
                    )
                    SELECT id FROM children;
                """
                cursor = connection.cursor()
                cursor.execute(query, [idarboresence])
                data = [row[0] for row in cursor.fetchall()]

                query_params = [tuple(data)]

                quer = """
                    SELECT u.user_name, u.id, u.last_name, u.email, u.datedemarrage, 
                           u.activite, u.site_id, u.matricule
                    FROM syspointage_newuser_arborescence ua
JOIN syspointage_arborescence a ON a.id = ua.arborescence_id
JOIN syspointage_newuser u ON ua.newuser_id = u.id
LEFT JOIN syspointage_ligne l ON l.id = u.id_ligne
LEFT JOIN syspointage_newuser_superviseur us ON us.newuser_id = u.id  -- Correction ici
LEFT JOIN syspointage_superviseur s ON s.id = us.superviseur_id
LEFT JOIN syspointage_role r ON r.id = u.role_id
                    WHERE ua.arborescence_id IN %s
                  
                """
                if activite:
                    quer += " AND u.is_active = ANY(%s::boolean[])"
                    query_params.append(activite)
                if len(ligne_list) > 0 :
                    quer += " AND (u.id_ligne = ANY(%s::int[])) "
                    query_params.append(ligne_list)

                if len(superviseur_list) > 0 :
                    
                    quer += " AND (us.superviseur_id = ANY(%s::int[])) "
                    query_params.append(superviseur_list)

                cursor.execute(quer, query_params)
                employes = cursor.fetchall()
                
                json_data = [
                    {
                        "label": f"{objj[0]} {objj[2]} {objj[7]}" if objj[2] or objj[0] or objj[7] else "inconnu",
                        "value": objj[1],
                        "email": objj[3],
                        "datedemarrage": objj[4],
                        "activite": objj[5],
                        "site": objj[6],
                    }
                    for objj in employes
                ]

                listEmployes.extend(json_data)

        return JsonResponse(listEmployes, safe=False)

class TestUsersOfDepartement(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        listEmployes = []
        listids = request.query_params.getlist('id')[0].split(',')

        for idd in listids:
            idarboresence = int(idd)

            # Updated recursive query for PostgreSQL using WITH RECURSIVE
            query = """
            WITH RECURSIVE children AS (
                SELECT id FROM syspointage_arborescence WHERE id = %s 
                UNION ALL
                SELECT a.id FROM syspointage_arborescence a
                JOIN children c ON a.parent_id = c.id
            )
            SELECT id FROM children;
            """
            cursor = connection.cursor()
            cursor.execute(query, [idarboresence])
            data = cursor.fetchall()

            for obj in data:
                # Use parameterized query for fetching employees
                quer = """
                SELECT u.user_name, u.id, u.last_name, u.email, u.datedemarrage
                FROM syspointage_newuser_arborescence ua
                JOIN syspointage_arborescence a ON ua.arborescence_id = a.id
                JOIN syspointage_newuser u ON ua.newuser_id = u.id
                LEFT JOIN syspointage_role r ON r.id = u.role_id
                WHERE ua.arborescence_id = %s;
                """
                cc = connection.cursor()
                cc.execute(quer, [obj[0]])  # obj[0] contains the id from the recursive query
                employes = cc.fetchall()
                nom=""

                json_data = []
                for objj in employes:
                    if objj[2]:
                        nom=str(objj[0] + " " + objj[2])
                    else : 
                        nom =objj[0]
                    json_data.append({
                        "label": nom, 
                        "value": objj[1],
                        "email": objj[3],
                        "datedemarrage": objj[4]
                    })

                listEmployes.extend(json_data)

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
   queryset=NewUser.objects.prefetch_related('arborescence').select_related('role','site').all()
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

    def post(self, request, **kwargs):
        print('rrrrrr', request.data)

        date_pointage = request.data.get('date_pointage')
        heure_pointage = request.data.get('heure_pointage')
        motif = request.data.get('motif')
        commentaire = request.data.get('commentaire')
        employes = request.data.get('employes')  # <- Liste attendue ici
        pointeuse = request.data.get('pointeuse')
        if not isinstance(employes, list):
            return Response({'error': 'employes must be a list'}, status=status.HTTP_400_BAD_REQUEST)

        for emp_id in employes:
            data = {
                'employes': emp_id,
                'date_pointage': date_pointage,
                'heure_pointage': heure_pointage,
                'motif': motif,
                'commentaire': commentaire,
                'pointeuse':pointeuse,
            }

            serializer = PointageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response({emp_id: serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': True}, status=status.HTTP_201_CREATED)
   

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
    
    def get(self, request, pk):
        cursor = connection.cursor()
        
        # Use a parameterized query to prevent SQL injection
        query = '''
            SELECT 
                u.matricule, 
                u.user_name, 
                p.title, 
                p.id, 
                u.id, 
                u.last_name, 
                u.id, 
                p.id 
            FROM 
                syspointage_newuser AS u  
            LEFT JOIN   
                syspointage_planning AS p 
            ON 
                p.employe_id = u.id  -- Changed u.pid to u.id, assuming 'id' is correct
            WHERE 
                p.id = %s
        '''
        
        # Execute the query with parameterization
        cursor.execute(query, [pk])  # 'pk' is passed safely to the query
        
        # Fetch all the results
        data = cursor.fetchall()
        
        # Prepare the response in JSON format
        json_data = [
            {
                "matricule": obj[0],
                "user_name": obj[1],
                "nomplanning": obj[2],
                "idplanactuelle": obj[3],
                "iduser": obj[4],
                # "last_name": obj[5],
                "iduseractuelle": obj[6],
                "idplanning": obj[7]
            }
            for obj in data
        ]
        
        # Return the JSON response
        return JsonResponse(json_data, safe=False)


class CreateplaningByDep(APIView):
      permission_classes = [AllowAny]

      def post(self, request, **kwargs):
        # Get the list of employee IDs from query parameters
        listids = request.query_params.getlist('id')[0].split(',')
        
        # Serialize the planning data
        serializer = PlanningSerializer(data=request.data)
        if serializer.is_valid():
            # Save the planning instance
            planning = serializer.save()

            # Fetch all users in one query using filter and update their ManyToMany field
            users = NewUser.objects.filter(id__in=[int(id)for id in listids])
            for user in users:
                user.planningemp.add(planning)  # Add the planning to each selected user

            return Response({'detail': 'Planning assigned to employees successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     class CreatePointage(APIView):
    #   permission_classes = [AllowAny]

    #   def post(self, request,**kwargs):
    #       print('rrrrrr',request.data)
    #       data={}
          
    #       data['pointeuse']=request.data.get('pointeuse')
    #       data['idpause']=request.data.get('idpause')
    #       data['etat']=request.data.get('etat')
    #       data['description']=request.data.get('description')
 
    #       #on fait cette boucle par ce que le chef peut sélectionner plusieurs employés et les affecté en pause(active contact)
    #       for obj in request.data.get('employes'):
    #           data['employes']=obj

    #           serializer = PointageSerializer(data=data) 
    #           if serializer.is_valid():
    #              pp = serializer.save()
     

    #       return Response('json', status=status.HTTP_201_CREATED)
class CreateAbsences(APIView):
    permission_classes = [AllowAny]

    def post(self, request, **kwargs):
        print('Données reçues:', request.data)

        # Extraire uniquement les IDs des employés
        employes = [emp.get('id') if isinstance(emp, dict) else emp for emp in request.data.get('employes', [])]
        
        # Vérifier si la liste d'employés est vide ou si un ID est None
        if not employes or any(emp is None for emp in employes):
            return Response({"error": "Aucun employé valide sélectionné"}, status=status.HTTP_400_BAD_REQUEST)

        # Récupérer les autres données de l'absence
        data = {
            'raison': request.data.get('raison'),
            'datedebut': request.data.get('datedebut'),
            'datefin': request.data.get('datefin'),
            'motif_abs': request.data.get('motif_abs'),
            'justifie': request.data.get('justifie'),
            'heure_debut': request.data.get('heure_debut'),
            'heure_fin': request.data.get('heure_fin'),
        }

        # Liste des absences créées
        absences_crees = []

        # Création d'une absence pour chaque employé sélectionné
        for employe_id in employes:
            absence_data = data.copy()
            absence_data['employes'] = employe_id  # Assigner l'ID de l'employé

            serializer = AbsenceSerializer(data=absence_data)
            if serializer.is_valid():
                absence = serializer.save()
                absences_crees.append(absence.id)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            'detail': f'Absences créées pour {len(absences_crees)} employés',
            'absences': absences_crees
        }, status=status.HTTP_201_CREATED)



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
        #  testplaning=SearchPlaning(str(single_date),listaidplanings)#sélectionner le planning de date actuelle
         jourferies=jourferies+JourFerie.objects.filter(date__lte=single_date, datefin__gte=single_date).count()#nombre de jours féries dans cette période
         
         
        #  s=searchDay(str(single_date),kwargs['id'],testplaning)#cette fonction renvoie les détails d'horaire de l' employé connecté 
        #  if s==["00:00:00",zero,zero,zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"","0"]:
               
        #        repos+=1
        #        if JourFerie.objects.filter(date__lte=single_date, datefin__gte=single_date).exists():
        #           existjourferierepos=existjourferierepos+1
   
         
      
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

class listsuperviseur(generics.ListCreateAPIView):
    queryset = superviseur.objects.all()
    serializer_class = superviseurSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print("Requête POST reçue:", request.data)

        superviseurs_data = request.data.get('superviseurs', [])
        if not superviseurs_data:
            return Response({"detail": "Aucun superviseur fourni."}, status=status.HTTP_400_BAD_REQUEST)

        for superviseur_data in superviseurs_data:
            superviseur_id = superviseur_data.get('superviseurname')

            try:
                # ⚠️ Assure-toi que le modèle "NewUser" contient les superviseurs
                user = NewUser.objects.get(id=superviseur_id)
            except NewUser.DoesNotExist:
                return Response({"error": f"Utilisateur avec ID {superviseur_id} non trouvé."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Remplace l'ID par le nom réel
            superviseur_nom = user.last_name + " " + user.user_name  # ou autre combinaison

            serializer = self.get_serializer(data={"superviseurname": superviseur_nom})
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Superviseurs ajoutés avec succès!"}, status=status.HTTP_201_CREATED)



class updatedeletesuperviseur(generics.RetrieveUpdateDestroyAPIView):
    queryset=superviseur.objects.all()
    serializer_class=superviseurSerializer 
    permission_classes = [AllowAny]
class listskille(generics.ListCreateAPIView):
    queryset = skill.objects.all()
    serializer_class = skillSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print("Requête POST reçue:", request.data)

        skills_data = request.data.get('skills', [])
        if not skills_data:
            return Response({"detail": "Aucune compétence fournie."}, status=status.HTTP_400_BAD_REQUEST)

        for skill_data in skills_data:
            skill_name = skill_data.get('skillname')

            serializer = self.get_serializer(data={"skillname": skill_name})
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Compétences ajoutées avec succès!"}, status=status.HTTP_201_CREATED)



class updatedeleteskill(generics.RetrieveUpdateDestroyAPIView):
    queryset=skill.objects.all()
    serializer_class=skillSerializer 
    permission_classes = [AllowAny]
class createlistligne(generics.ListCreateAPIView):
    queryset=ligne.objects.all()
    serializer_class=ligneSerializer
    permission_classes = [AllowAny]
class updatedeleteligne(generics.RetrieveUpdateDestroyAPIView):
    queryset=ligne.objects.all()
    serializer_class=ligneSerializer 
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
                a=Rapportunjoure(int(u),str(single_date))

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
class HistoriqueDemendesConges(APIView):  # demande congés autorisation mission
    permission_classes = [AllowAny]

    def get(self, request, pk):
        cursor = connection.cursor()

        # Correctly handle the parameters with placeholders
        query = '''
        SELECT 
            n.user_name, c.validation, c.datedebut, c.datefin, m.motif, n.solde, 
            c.heure_debut, c.heure_fin, c.date_autorisation, c.id, c.mission, 
            c.validation, c.validationrh, c.destination, n.last_name 
        FROM 
            syspointage_newuser AS n
        INNER JOIN  
            syspointage_conges AS c ON c.employes_id = n.id
        LEFT JOIN  
            syspointage_motif_abs AS m ON c.motif_abs_id = m.id
        WHERE 
            c.validationrh = 1 
            AND c.validationrh2 = 2 
            AND n.id = %s 
            AND c.teletravail = %s
        ORDER BY 
            c.datedebut
        '''

        # Use parameterized values for `idemploye` and `teletravail` ('0' for teletravail)
        cursor.execute(query, [pk, "0"])

        # Fetch all the results
        data = cursor.fetchall()

        # Prepare the response in JSON format
        json_data = [
            {
                "user_name": obj[0],
                "validation": obj[1],
                "datedebut": obj[2],
                "datefin": obj[3],
                "motif": obj[4],
                "solde": obj[5],
                "heure_debut": obj[6],
                "heure_fin": obj[7],
                "date_autorisation": obj[8],
                "idconge": obj[9],
                "mission": obj[10],
                "validation": obj[11],
                "validationrh": obj[12],
                "destination": obj[13],
                "last_name": obj[14]
            }
            for obj in data
        ]

        # Return the JSON response
        return JsonResponse(json_data, safe=False)
      
class SelectcongebyId(APIView):  # demande congés autorisation mission
    permission_classes = [AllowAny]

    def get(self, request, pk):
        cursor = connection.cursor()

        # Use a parameterized query to prevent SQL injection
        query = '''
        SELECT 
            n.user_name, c.validation, c.datedebut, c.datefin, m.motif, n.solde, 
            c.heure_debut, c.heure_fin, c.date_autorisation, c.id, c.mission, 
            n.last_name, n.matricule, c.commentaire, c.destination, 
            c.validation, c.validationrh, c.nbjours, c.personneinterimaire_id, 
            c.adresse, c.contact
        FROM 
            syspointage_newuser AS n
        INNER JOIN 
            syspointage_conges AS c ON c.employes_id = n.id
        LEFT JOIN 
            syspointage_motif_abs AS m ON c.motif_abs_id = m.id
        WHERE 
            c.id = %s
        '''

        # Execute the query with the parameterized 'idconge'
        cursor.execute(query, [pk])
        data = cursor.fetchall()

        json_data = []
        for obj in data:
            # If 'personneinterimaire_id' exists, fetch the related user's name
            personne_interimaire_name = ''
            if obj[18]:
                personne_interimaire_name = NewUser.objects.filter(id=int(obj[18])).values_list('user_name', flat=True).first() or ''
            
            # Append data to the JSON response
            json_data.append({
                "user_name": obj[0],
                "validation": obj[1],
                "datedebut": obj[2],
                "datefin": obj[3],
                "motif": obj[4],
                "solde": obj[5],
                "heure_debut": obj[6],
                "heure_fin": obj[7],
                "date_autorisation": obj[8],
                "idconge": obj[9],
                "mission": obj[10],
                "last_name": obj[11],
                "matricule": obj[12],
                "commentaire": obj[13],
                "destination": obj[14],
                "validation": obj[15],
                "validationrh": obj[16],
                "nbjours": obj[17],
                "personneinterimaire": personne_interimaire_name,
                "adresse": obj[19],
                "contact": obj[20]
            })

        return JsonResponse(json_data, safe=False)
class RapportSemaine(APIView):
    def post(self, request, **kwargs):
        listids = request.data.get('ids')

        if not listids or not isinstance(listids, list):
            return Response({"error": "Aucun ID d'employé fourni ou format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        listids = [item for sublist in listids for item in (sublist if isinstance(sublist, list) else [sublist])]

        d1 = kwargs['date1']
        d2 = kwargs['date2']
        start_date = datetime.strptime(d1, "%Y-%m-%d").date()
        end_date = datetime.strptime(d2, "%Y-%m-%d").date()

        if cache.get(d1) and cache.get(d2) and cache.get('jsondata'):
            return JsonResponse(cache.get('jsondata'), safe=False)

        all_data = []

        for user_id in listids:
            if not isinstance(user_id, int):
                continue

            listesemaines = []
            listdates = []

            current_monday = start_date - timedelta(days=start_date.weekday())

            while current_monday <= end_date:
                semaine_start = current_monday
                semaine_end = current_monday + timedelta(days=6)

                debut = max(semaine_start, start_date)
                end = min(semaine_end, end_date)

                semaine_num = debut.isocalendar()[1]

                jsondata = []
                l = ''
                total_minutes = total_retard = total_avant_sortie = total_presencenor = 0.0
                jourtravaille = 0.0

                for single_date in daterange(debut, end):
                    a = Rapportunjour(int(user_id), str(single_date))
                    if a:
                        data = a[0]
                        jsondata.append({
                            "motif": data["motif"], "Entree": data["Entree"], "Sortie": data["Sortie"],
                            "earlyEntree": data["earlyEntree"], "lateEntree": data["lateEntree"],
                            "earlySortie": data["earlySortie"], "lateSortie": data["lateSortie"],
                            "user_name": data["user_name"], "matricule": data["matricule"],
                            "date_pointage": data["date_pointage"], "planing": data["planing"],
                            "heuretravail": data["heuretravail"], "pause": data["pause"],
                            "presencenormal": data["presencenormal"], "jourtravaille": data["jourtravaille"],
                            "entreepointage": data["entreepointage"], "sortiepointage": data["sortiepointage"],
                            "heureauthorisation": data["heureauthorisation"], "deficit": data["deficit"],
                            "iduser": data["iduser"], "pointages": data["pointages"],
                            "tempabsence": data["tempabsence"], "jourconge": data["jourconge"],
                            "tempsMission": data["tempsMission"], "last_name": data["last_name"],"presenceplann": data["presenceplann"]
                        })
                        total_minutes += float(data['heuretravail'])
                        total_retard += float(data['lateEntree'])
                        total_avant_sortie += float(data['earlySortie'])
                        total_presencenor += float(data['presenceplann'])
                        jourtravaille += float(data['jourtravaille'])
                        l = data["last_name"]

                if jsondata:
                    presencesupl = max(0, total_minutes - total_presencenor)
                    deficit = max(0, total_presencenor - total_minutes)
                    amplitude = total_minutes / jourtravaille if jourtravaille else 0.0

                    listesemaines.append({
                        "amplitude": amplitude,
                        "as": str(total_avant_sortie),
                        "ret": str(total_retard),
                        "tra": str(total_minutes),
                        "prno": str(total_presencenor),
                        "psup": str(presencesupl),
                        "dd": str(deficit),
                        "avantSortie": minutes_hours(total_avant_sortie),
                        "user_name": str(NewUser.objects.filter(id=int(user_id)).values()[0].get('user_name')),
                        "matricule": str(NewUser.objects.filter(id=int(user_id)).values()[0].get('matricule')),
                        "presencereele": minutes_hours(total_minutes),
                        'presencenormal': minutes_hours(total_presencenor),
                        'suplementaire': minutes_hours(presencesupl),
                        'semaine': str(semaine_num),
                        "last_name": l,
                        "deficit": minutes_hours(deficit),
                        "retard": minutes_hours(total_retard),
                        "first_date": str(debut),
                        "end_date": str(end)
                    })
                    listdates.append({
                        "semaine": str(semaine_num),
                        "first_date": str(debut),
                        "end_date": str(end)
                    })

                current_monday += timedelta(days=7)

            # Totaux
            total_all_minutes = sum(float(w['tra']) for w in listesemaines)
            total_all_retard = sum(float(w['ret']) for w in listesemaines)
            total_all_avant_sortie = sum(float(w['as']) for w in listesemaines)
            total_all_presencenor = sum(float(w['prno']) for w in listesemaines)
            total_all_supp = sum(float(w['psup']) for w in listesemaines)
            total_all_deficit = sum(float(w['dd']) for w in listesemaines)

            all_data.append({
                "listedates": listdates,
                "listesemaine": listesemaines,
                "iduser": user_id,
                "reeltotale": minutes_hours(total_all_minutes),
                "retardTotale": minutes_hours(total_all_retard),
                "presencetotale": minutes_hours(total_all_presencenor),
                "avant_st": minutes_hours(total_all_avant_sortie),
                "deficittotale": minutes_hours(total_all_deficit),
                "supptotale": minutes_hours(total_all_supp),
                "user_name": str(NewUser.objects.filter(id=int(user_id)).values()[0].get('user_name')),
                "last_name": l
            })

        cache.set(f"{d1}_{d2}_jsondata", all_data)
        return JsonResponse(all_data, safe=False)
class RapportJournalier(APIView):
    # permission_classes = [AllowAny]

    def post(self, request, **kwargs):
        listids = request.data.get('ids')  # Récupérer directement la liste

        if not listids or not isinstance(listids, list):  # Vérifier si c'est bien une liste
            return Response({"error": "Aucun ID d'employé fourni ou format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Aplatir la liste si elle contient des sous-listes
        listids = [item for sublist in listids for item in (sublist if isinstance(sublist, list) else [sublist])]

        print("listids:", listids)  # Debugging

        jsondata = []
        d1 = kwargs['date1']
        d2 = kwargs['date2']

        # Vérification du cache
        if cache.get(d1) and cache.get(d2) and cache.get('jsondata'):
            return JsonResponse(cache.get('jsondata'), safe=False)

        # Traitement des pointages
        for i in listids:
            if not isinstance(i, int):  # Vérifier si l'élément est un entier
                print("⚠️ ERREUR: i n'est pas un entier !", i)  # Debug
                continue  # Ignorer cet élément s'il n'est pas valide

            for single_date in daterange(datetime.strptime(d1, "%Y-%m-%d").date(), datetime.strptime(d2, "%Y-%m-%d").date()):
                a = Rapportunjour(int(i), str(single_date))  # Correction ici

                if a:
                    jsondata.append({
                        "matricule": a[0].get("matricule", ""),
                        "user_name": a[0].get("user_name", ""),
                        "last_name": a[0].get("last_name", ""),
                        "iduser": a[0].get("iduser", ""),
                        "date_pointage": a[0].get("date_pointage", ""),
                        "nomhoraire": a[0].get("nomhoraire", "pas de planning"),
                        "debuthoraire": a[0].get("debuthoraire", "00:00:00"),
                        "finhoraire": a[0].get("finhoraire", "00:00:00"),
                        "Entree": a[0].get("Entree", "00:00:00"),
                        "Sortie": a[0].get("Sortie", "00:00:00"),
                        "refpointeuse": a[0].get("refpointeuse", ""),
                        "efpointeuse": a[0].get("efpointeuse", ""),
                        "jour_nrmlmn_travaille": minutes_hours(float(a[0].get("jour_nrmlmn_travaille", 0))),
                        "jour_travaille": minutes_hours(float(a[0].get("jour_travaille", 0))),
                        "retard": minutes_hours(float(a[0].get("retard", 0))),
                        "depart_anticipe": a[0].get("depart_anticipe", "0.0"),
                        "Absent": a[0].get("Absent", 1),
                        "heuresup": minutes_hours(float(a[0].get("heuresup", 0))),
                        "heuresupvalide": minutes_hours(float(a[0].get("heuresupvalide", 0))),
                        "presenceplann": minutes_hours(float(a[0].get("presenceplann", 0))),
                        "motif": a[0].get("motif", "pas de pointage"),
                        "departement_name": a[0].get("departement_name", ""),
                        "presencenormal": minutes_hours(float(a[0].get("presencenormal", 0))),
                        "ligne_de_production": a[0].get("ligne_de_production", ""),
                        "superviseur": a[0].get("superviseur", ""),
                    })

        # Mise en cache des résultats
        cache.set('jsondata', jsondata, timeout=60 * 15)

        return JsonResponse(jsondata, safe=False)



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
      def post(self, request, **kwargs):
        listids = request.data.get('ids')  # Récupérer directement la liste

        if not listids or not isinstance(listids, list):  # Vérifier si c'est bien une liste
            return Response({"error": "Aucun ID d'employé fourni ou format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Aplatir la liste si elle contient des sous-listes
        listids = [item for sublist in listids for item in (sublist if isinstance(sublist, list) else [sublist])]

        print("listids:", listids)  # Debugging

        jsondata = []
        d1 = kwargs['date1']
        d2 = kwargs['date2']

        # Vérification du cache
        if cache.get(d1) and cache.get(d2) and cache.get('jsondata'):
            return JsonResponse(cache.get('jsondata'), safe=False)

        # Traitement des pointages
        for i in listids:
            if not isinstance(i, int):  # Vérifier si l'élément est un entier
                print("⚠️ ERREUR: i n'est pas un entier !", i)  # Debug
                continue  # Ignorer cet élément s'il n'est pas valide

            for single_date in daterange(datetime.strptime(d1, "%Y-%m-%d").date(), datetime.strptime(d2, "%Y-%m-%d").date()):
                a = Rapportunjour(int(i), str(single_date))  # Correction ici
                # Récupération des références des pointeuses entrée et sortie
                ref_entree = a[0].get("refpointeuse", "") if a[0].get("refpointeuse", "") else None
                ref_sortie = a[0].get("efpointeuse", "") if a[0].get("efpointeuse", "") else None
                print('ref_entree',ref_entree)
                print('ref_sortie',ref_sortie)

                nom_pointeuse_entree = ""
                nom_pointeuse_sortie = ""

                if ref_entree and str(ref_entree).isdigit():
                    cursor = connection.cursor()
                    query = 'SELECT nom_pointeuse FROM syspointage_pointeuse WHERE "id" = %s'
                    cursor.execute(query, (int(ref_entree),))
                    res = cursor.fetchone()
                    nom_pointeuse_entree = res[0] if res else ""

                if ref_sortie and str(ref_sortie).isdigit():
                    cursor = connection.cursor()
                    query = 'SELECT nom_pointeuse FROM syspointage_pointeuse WHERE "id" = %s'
                    cursor.execute(query, (ref_sortie,))
                    res = cursor.fetchone()
                    nom_pointeuse_sortie = res[0] if res else ""

                if a:
                    jsondata.append({
                        "matricule": a[0].get("matricule", ""),
                        "user_name": a[0].get("user_name", ""),
                        "last_name": a[0].get("last_name", ""),
                        "iduser": a[0].get("iduser", ""),
                        "date_pointage": a[0].get("date_pointage", ""),
                        "nomhoraire": a[0].get("nomhoraire", "pas de planning"),
                        "debuthoraire": a[0].get("debuthoraire", "00:00:00"),
                        "finhoraire": a[0].get("finhoraire", "00:00:00"),
                        "Entree": a[0].get("Entree", "00:00:00"),
                        "Sortie": a[0].get("Sortie", "00:00:00"),
                        "refpointeuse": a[0].get("refpointeuse", ""),
                        "efpointeuse": a[0].get("efpointeuse", ""),
                        "jour_nrmlmn_travaille": minutes_hours(float(a[0].get("jour_nrmlmn_travaille", 0))),
                        "jour_travaille": minutes_hours(float(a[0].get("jour_travaille", 0))),
                        "retard": minutes_hours(float(a[0].get("retard", 0))),
                        "depart_anticipe": a[0].get("depart_anticipe", "0.0"),
                        "Absent": a[0].get("Absent", 1),
                        "heuresup": minutes_hours(float(a[0].get("heuresup", 0))),
                        "heuresupvalide": minutes_hours(float(a[0].get("heuresupvalide", 0))),
                        "presenceplann": convert_minutes_to_hhmm(float(a[0].get("presenceplann", 0))),
                        "motif": a[0].get("motif", "pas de pointage"),
                        "departement_name": a[0].get("departement_name", ""), 
                        "presencenormal": minutes_hours(float(a[0].get("presencenormal", 0))),
                        "nom_pointeuse_entree": nom_pointeuse_entree,
                        "nom_pointeuse_sortie": nom_pointeuse_sortie,
                        "pointeuses_entree": a[0].get("pointeuses_entree", ""),
                        "pointeuses_sortie": a[0].get("pointeuses_sortie", ""),
                    })

        # Mise en cache des résultats
        cache.set('jsondata', jsondata, timeout=60 * 15)

        return JsonResponse(jsondata, safe=False)

class  RapportAbsences(APIView):
      def post(self, request, **kwargs):
          listAbsences=[]
          listids = request.data.get('ids')
          if not listids or not isinstance(listids, list):  # Vérifier si c'est bien une liste
            return Response({"error": "Aucun ID d'employé fourni ou format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Aplatir la liste si elle contient des sous-listes
          listids = [item for sublist in listids for item in (sublist if isinstance(sublist, list) else [sublist])]

          print("listids:", listids)  # Debugging
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
          json_data = []
          # Récupérer directement la liste

        

         
        

        # Vérification du cache
        
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
class  RapportAnomalie(APIView):
      def post(self, request, **kwargs):
          listAbsences=[]
          listids = request.data.get('ids')
          if not listids or not isinstance(listids, list):  # Vérifier si c'est bien une liste
            return Response({"error": "Aucun ID d'employé fourni ou format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Aplatir la liste si elle contient des sous-listes
          listids = [item for sublist in listids for item in (sublist if isinstance(sublist, list) else [sublist])]

          print("listids:", listids)  # Debugging
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
          json_data = []
          # Récupérer directement la liste

        

         
        

        # Vérification du cache
        
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
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"absence","last_name":obj['last_name'],"pointages":a[0]["pointages"]})
                     elif obj['motif']=="Pointage impair":
                        listAbsences.append({"date":str(obj["date_pointage"]),"user_name":obj["user_name"],"matricule":obj["matricule"],"commentaire":"Pointage impair","last_name":obj['last_name'],"pointages":a[0]["pointages"]})
                    
         
          return JsonResponse(listAbsences, safe=False)   
class RapportSynthese(APIView):
    def post(self, request, **kwargs):
        listids = request.data.get('ids')  # Récupérer directement la liste

        if not listids or not isinstance(listids, list):
            return Response({"error": "Aucun ID d'employé fourni ou format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        # Aplatir la liste si elle contient des sous-listes
        listids = [item for sublist in listids for item in (sublist if isinstance(sublist, list) else [sublist])]

        print("listids:", listids)
        listsynthese = []

        d1 = kwargs['date1']
        d2 = kwargs['date2']

        # Vérification du cache
        if cache.get(d1) and cache.get(d2) and cache.get('jsondata'):
            return JsonResponse(cache.get('jsondata'), safe=False)

        for y in listids:
            if not isinstance(y, int):
                print("⚠️ ERREUR: i n'est pas un entier !", y)
                continue

            # Réinitialisation pour chaque employé
            json_data = []
            jourtravai = 0
            minuts = 0.0
            m = ''
            minutestravaill = 0.0
            earlysortie = 0.0
            defici = 0.0
            joursabsence = 0
            jourconge = 0
            heuremission = 0.0
            heureauthorisation = 0.0
            prnormale = 0.0
            tempsabsence = 0.0
            tab = ''
            amplitude = 0.0
            jourtravaille = 0

            for single_date in daterange(datetime.strptime(d1, "%Y-%m-%d").date(), datetime.strptime(d2, "%Y-%m-%d").date()):
                a = Rapportunjour(int(y), str(single_date))

                if a:
                    json_data.append({
                        "motif": a[0]["motif"],
                        "Entree": a[0]["Entree"],
                        "Sortie": a[0]["Sortie"],
                        "earlyEntree": a[0]["earlyEntree"],
                        "lateEntree": a[0]["lateEntree"],
                        "earlySortie": a[0]["earlySortie"],
                        "lateSortie": a[0]["lateSortie"],
                        "user_name": a[0]["user_name"],
                        "matricule": a[0]["matricule"],
                        "date_pointage": a[0]["date_pointage"],
                        "planing": a[0]["planing"],
                        'heuretravail': a[0]["heuretravail"],
                        'pause': a[0]["pause"],
                        'presencenormal': a[0]['presencenormal'],
                        "jourtravaille": a[0]['jourtravaille'],
                        "entreepointage": a[0]['entreepointage'],
                        "sortiepointage": a[0]['sortiepointage'],
                        "heureauthorisation": a[0]['heureauthorisation'],
                        "deficit": a[0]["deficit"],
                        "iduser": a[0]["iduser"],
                        "pointages": a[0]["pointages"],
                        "tempabsence": a[0]["tempabsence"],
                        "jourconge": a[0]["jourconge"],
                        "tempsMission": a[0]["tempsMission"],
                        "last_name": a[0]['last_name'],
                        "presenceplann": a[0]['presenceplann'],
                    })

            if json_data:
                for obj in json_data:
                    tempsabsence += float(obj['tempabsence'])
                    tab = str(minutes_hours(tempsabsence))

                    minuts += float(obj['lateEntree'])
                    minutestravaill += float(obj['heuretravail'])
                    earlysortie += float(obj['earlySortie'])
                    defici += float(obj['deficit'])
                    sortieavantheure = str(minutes_hours(earlysortie))
                    m = str(minutes_hours(minuts))
                    travail = str(minutes_hours(minutestravaill))
                    deficit = str(minutes_hours(defici))
                    prnormale += float(obj['presenceplann'])
                    pr = str(minutes_hours(prnormale))
                    jourtravaille += float(obj['jourtravaille'])

                    if obj['motif'] in ["Absent", "Absence non justifié", "Absence justifié"]:
                        if obj["deficit"] != "0.0":
                            joursabsence += 1
                    if obj['motif'] == "Congé":
                        jourconge += 1
                    if obj['motif'] == "Mission":
                        heuremission += float(obj['tempsMission'])
                    if obj['motif'] == "Autorisation":
                        heureauthorisation += float(obj['heureauthorisation'])

                tempsauthorisation = str(minutes_hours(heureauthorisation))
                heuresmission = str(minutes_hours(heuremission))

                if jourtravaille != 0:
                    amplitude = minutestravaill / jourtravaille

                listsynthese.append({
                    "amplitude": amplitude,
                    "tempsabsence": tab,
                    "presencenormale": pr,
                    "user_name": obj['user_name'],
                    "matricule": obj['matricule'],
                    "retard": m,
                    "travail": travail,
                    "earlySortie": sortieavantheure,
                    "deficit": deficit,
                    "joursabsence": joursabsence,
                    "jourconges": jourconge,
                    "heuremission": heuresmission,
                    "heureauthorisation": tempsauthorisation,
                    "last_name": obj['last_name']
                })

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
               
                  a=Rapportunjoure(int(id),str(single_date))            
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
        # emaill = request.data.get('email')
        # objet = request.data.get('objet')
        # message = request.data.get('message')

        # if emaill or objet or message:
        #     try:
        #         send_mail(
        #             str(objet),
        #             str(message),
        #             settings.EMAIL_HOST_USER,
        #             [emaill],  # Assuming 'emaill' is a string containing a single email address
        #             fail_silently=False,
        #             html_message="<p style='line-height: 300%;'>" + str(message) + "<br>IPS Time</p>"
        #         )
        #         return Response({"status": "true"}, status=status.HTTP_200_OK)
        #     except Exception as e:
        return Response({"status": "Couldn't send the email: " }, status=status.HTTP_400_BAD_REQUEST)
        # else:
        #     return Response({"status": "Missing email, objet, or message in the request"}, status=status.HTTP_400_BAD_REQUEST)
      
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
            a=Rapportunjoure(int(u),str(datenow))
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

            a=Rapportunjoure(int(idemploye),date)
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
    queryset=pointage.objects.all()
    permission_classes = [AllowAny]
    serializer_class = PointageSerializer  
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
     