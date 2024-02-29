from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from . calcul_func import *
from datetime import datetime
from django.http import HttpResponse,JsonResponse
from . models import *
from . serializers import *
from rest_framework.permissions import AllowAny
from rest_framework.response import Response 
from . valideurs_emails import *
from django.db.models import Q
from rest_framework import status
from django.db import connection
import traceback  # Import the traceback module

from . send_mail import send_email_template

class Demandeconges(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format='json',**kwargs):
        serializer = congesSerializer(data=request.data)
        if self.kwargs['type']=="autorisation":#si la demande est une autorisation 
           dateaut=datetime.strptime(str(request.data.get('date_autorisation')),"%Y-%m-%d").month#get the month of date d'autorisation
           yearaut=datetime.strptime(str(request.data.get('date_autorisation')),"%Y-%m-%d").year#get the year of autorisation
        
           compteautori=Conges.objects.filter(id=(self.kwargs['pk']),date_autorisation__month__gte=dateaut,date_autorisation__month__lte=dateaut,date_autorisation__year__lte=yearaut,date_autorisation__year__gte=yearaut).count()
           if compteautori>=3:#si nombre autorisation>=3 alors error 
              
              return HttpResponse(status=202)
        if self.kwargs['type']=="conge":   
         verifconge = Conges.objects.filter(
         employes_id=self.kwargs['pk'],
         motif_abs__motifConge=True
         ).exclude(
         Q(validation=5) | Q(validation=6) 
         ).filter(
         Q(datedebut__range=(self.kwargs['date1'], self.kwargs['date2'])) |
            Q(datefin__range=(self.kwargs['date1'], self.kwargs['date2']))
            )
         if verifconge : 
             
             return Response({"vous avez deja une demande en cours "}, status=400)
      #   verifauto = Conges.objects.filter(
      #    employes=self.kwargs['pk'],
      #    teletravail=False,
      #    mission=False,
      #    ).exclude(
      #    Q(validation=3) 
      #    ).filter(
      #    Q(date_autorisation=(self.kwargs['date1']  ) )   )
       
        if serializer.is_valid():
            conge = serializer.save()
            
            if conge:
              
               if self.kwargs['type']=="conge":#si la demande est une congé 

                  #NewUser.objects.filter(id=request.data.get('employes')).update(soldemaladie=kwargs['soldenouveau'])#modifier le solde de maladie d'utilisateur connecté
                  NewUser.objects.filter(id=request.data.get('employes')).update(solde=kwargs['soldenouveau'])#modifier le solde d'utlisateur connecté             
               emailcheff=''
               aa=NewUser.objects.filter(id=(self.kwargs['pk']))
               attributes=aa.values('user_name','last_name','email')[0]#get the values of user 
               bb=aa.prefetch_related('arborescence')#jointure user with departement
               aaemail=attributes['email']
               user_name=attributes['user_name']
               last_name=attributes['last_name']
               
               mailsofv=get_validators_for_conge_and_department(conge.id , 1 )
               motif_conge = motif_abs.objects.get(id=conge.motif_abs_id)  # Supposant que MotifConge est le modèle pour le motif de congé
               nom_motif_conge = motif_conge.motif 
               objetv1 = str("IPS Time: première validation ") 
               messagev1 = str( "<p style='line-height: 300%;'>  Bonjour, merci  de procéder à la  première validation de la demande de "+str(nom_motif_conge) +" de    "+str(user_name) +" "+str(last_name)+" ,<br>  . <br>IPS Time Tunisie </p>")

  
               

               objet = str("IPS Time: Demande de "+self.kwargs['type']+" transmise")
               message = str( "<p style='line-height: 300%;'>Bonjour "+str(user_name) +" "+str(last_name)+" ,<br> Vous avez fait une demande de "+str(self.kwargs['type'])+" du " +str(self.kwargs['date1']) +" au "+str(self.kwargs['date2'])+".<br> Votre demande a bien été envoyée à votre valideur <br> Cette demande est en attente de validation. Elle n'est pas valable si elle n'est pas validée ou refusée. <br> Merci de relancer votre demande par mail si besoin urgent. <br>IPS Time Tunisie </p>")
               if aaemail and objet and message:
                    
                    
                try:
                  send_email_template(objet , message , [aaemail]) 
                  send_email_template(objetv1 , messagev1 , mailsofv)
                  return Response({"status": "true"}, status=status.HTTP_200_OK)
                except Exception as e:
                   return Response({"status": "Couldn't send the email: " + str(e)}, status=status.HTTP_400_BAD_REQUEST)
               else:
                  return Response({"status": "Missing email, objet, or message in the request"}, status=status.HTTP_400_BAD_REQUEST)
               
  
        return JsonResponse({"succes":"true"},safe=False)
     
     
     
class Validationworkflow(APIView):
   permission_classes = [AllowAny]
   def post(self ,request,pk , user ):

        query=f"""    SELECT DISTINCT c.id,v1.newuser_id as va1 , v2.newuser_id as va2 , v3.newuser_id as va3 ,v4.newuser_id as va4, c.commentaire , c.employes_id , m.motif , m.motifpointage , c.heure_debut , c.date_autorisation
            FROM syspointage_conges AS c
            INNER JOIN syspointage_workflowconge AS wc ON c.motif_abs_id = wc.type_conge_id
            left JOIN syspointage_workflowconge_valideur_1 AS v1 ON wc.id = v1.workflowconge_id
            left JOIN syspointage_workflowconge_valideur_2 AS v2 ON wc.id = v2.workflowconge_id
            left JOIN syspointage_workflowconge_valideur_3 AS v3 ON wc.id = v3.workflowconge_id
            left JOIN syspointage_workflowconge_valideur_4 AS v4 ON wc.id = v4.workflowconge_id
            INNER JOIN syspointage_newuser AS nu ON nu.id = c.employes_id
            INNER JOIN syspointage_motif_abs AS m ON m.id = c.motif_abs_id
            INNER JOIN syspointage_newuser_arborescence as nua on nua.newuser_id = c.employes_id
		
         WHERE wc.departement_id = nua.arborescence_id and ((v1.newuser_id ={str(user)} and c.validation =0  )  OR (v2.newuser_id ={str(user)} and c.validation = 1 )   OR (v3.newuser_id ={str(user)}  and c.validation = 2 )  OR (v4.newuser_id ={str(user)} and c.validation = 3  )) AND c.id={str(pk)}  """
       
        try:
         with connection.cursor() as cursor:
          cursor.execute(query)
          data = cursor.fetchone()

         if data is not None: 
            aa=NewUser.objects.filter(id=int(data[6]))
            attributes=aa.values('user_name','last_name','email')[0]
            aaemail=attributes['email']
            user_name=attributes['user_name']
            last_name=attributes['last_name']
            objet = str("IPS Time: Avis Favorable pour la demande du congé")
            objetv4 = str("IPS Time: quatrième  validation ")
            objetv2 = str("IPS Time: deuxième validation ")
            objetv3 = str("IPS Time: troisième validation ")
            message  = str( "<p style='line-height: 300%;'>  Bonjour "+str(user_name) +" "+str(last_name)+", <br> votre  demande de "+str(data[7]) +" a été validée avec succés !    ,<br>  . <br> </p>")
            messagev4 = str( "<p style='line-height: 300%;'>  Bonjour, <br> Merci  de procéder à la quatrième validation de la demande de "+str(data[7]) +" de    "+str(user_name) +" "+str(last_name)+" ,<br>  . <br> </p>")
            messagev2 = str( "<p style='line-height: 300%;'>  Bonjour, <br> Merci  de procéder à la deuxième  validation de la demande de "+str(data[7]) +" de    "+str(user_name) +" "+str(last_name)+" ,<br>  . <br> </p>")
            messagev3 = str( "<p style='line-height: 300%;'>  Bonjour, <br> Merci  de procéder à la troisième  validation de la demande de "+str(data[7]) +" de    "+str(user_name) +" "+str(last_name)+" ,<br>  . <br> </p>")
            if data[8]:
               time_object = datetime.strptime(str(data[9]), '%H:%M:%S').time()
               date_object = datetime.strptime(str(data[10]), '%Y-%m-%d').date()
               combined_datetime = datetime.combine(date_object, time_object)
               
            if pk is not None:
               conge = Conges.objects.get(id=pk)
               print("Data:", data)
               print("conge.validation:", type(conge.validation))

            if int(conge.validation) == 0:
                print("1")
                if data[2] is None:
                    print("2")
                    with connection.cursor() as update_cursor:
                        update_cursor.execute(f"UPDATE syspointage_conges SET validation = 4 WHERE id = {str(pk)}")
                        send_email_template(objet , message , [aaemail])
                        if data[8] == True : 
                            pointage.objects.create(
                              employes_id=int(data[6]),
                              date_pointage=combined_datetime
                                 )
                           
                        
                else:
                    with connection.cursor() as update_cursor:
                        update_cursor.execute(f"UPDATE syspointage_conges SET validation = 1 WHERE id = {str(pk)}")
                        mailsofv=get_validators_for_conge_and_department(pk , 2 )
                     
                        send_email_template(objetv2 , messagev2 , mailsofv)
            elif int(conge.validation) == 1:
                if data[3] is None:
                    with connection.cursor() as update_cursor:
                        update_cursor.execute(f"UPDATE syspointage_conges SET validation = 4 WHERE id = {str(pk)}")
                        send_email_template(objet , message , [aaemail])
                        if data[8] == True : 
                            pointage.objects.create(
                              employes_id=int(data[6]),
                              date_pointage=combined_datetime
                                 )


                else:
                    with connection.cursor() as update_cursor:
                        update_cursor.execute(f"UPDATE syspointage_conges SET validation = 2 WHERE id = {str(pk)}")
                        mailsofv=get_validators_for_conge_and_department(pk , 3 )
                       
                        send_email_template(objetv3 , messagev3 , mailsofv)
            elif int(conge.validation) == 2:
                if data[4] is None:
                    with connection.cursor() as update_cursor:
                        update_cursor.execute(f"UPDATE syspointage_conges SET validation = 4 WHERE id = {str(pk)}")
                        send_email_template(objet , message , [aaemail])
                        if data[8] == True : 
                            pointage.objects.create(
                              employes_id=int(data[6]),
                              date_pointage=combined_datetime
                                 )

                else:
                    with connection.cursor() as update_cursor:
                        update_cursor.execute(f"UPDATE syspointage_conges SET validation = 3 WHERE id = {str(pk)}")
                        mailsofv=get_validators_for_conge_and_department(pk , 4)
                     
                        send_email_template(objetv4 , messagev4 , mailsofv)
            elif int(conge.validation) == 3:
                with connection.cursor() as update_cursor:
                    update_cursor.execute(f"UPDATE syspointage_conges SET validation = 4 WHERE id = {str(pk)}")
                    send_email_template(objet , message , [aaemail])
                    if data[8] == True : 
                            pointage.objects.create(
                              employes_id=int(data[6]),
                              date_pointage=combined_datetime
                                 )
         return Response({'message': 'Conge validated successfully'})
        except Conges.DoesNotExist:
         return Response({'error': 'Conge not found'}, status=status.HTTP_404_NOT_FOUND)   
     
     
class ListValidation(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk, motif):
        try:
            if motif not in ["motifConge", "motifautorisation", "motifpointage", "motifdemanderh"]:
                return JsonResponse({"message": "Invalid motif_type"}, status=status.HTTP_400_BAD_REQUEST)

            query = f"""
            SELECT DISTINCT c.id, c.employes_id, c.validation, m.motif, nu.last_name, nu.user_name, c.datedebut, c.datefin, c.heure_debut, c.heure_fin, c.date_autorisation , c.commentaire
            FROM syspointage_conges AS c
            INNER JOIN syspointage_workflowconge AS wc ON c.motif_abs_id = wc.type_conge_id
            left JOIN syspointage_workflowconge_valideur_1 AS v1 ON wc.id = v1.workflowconge_id
            left JOIN syspointage_workflowconge_valideur_2 AS v2 ON wc.id = v2.workflowconge_id
            left JOIN syspointage_workflowconge_valideur_3 AS v3 ON wc.id = v3.workflowconge_id
            left JOIN syspointage_workflowconge_valideur_4 AS v4 ON wc.id = v4.workflowconge_id
            INNER JOIN syspointage_newuser AS nu ON nu.id = c.employes_id
            INNER JOIN syspointage_motif_abs AS m ON m.id = c.motif_abs_id
            INNER JOIN syspointage_newuser_arborescence as nua on nua.newuser_id = c.employes_id
            WHERE wc.departement_id = nua.arborescence_id and ((v1.newuser_id = {str(pk)} )  OR (v2.newuser_id = {str(pk)})   OR (v3.newuser_id = {str(pk)} )  OR (v4.newuser_id = {str(pk)}  )) AND CAST(m.{motif} AS bit) = 1
            """

            cursor = connection.cursor()
            cursor.execute(query)
            data = cursor.fetchall()
            json_data = []
            for obj in data:
                json_data.append({
                    "id": obj[0],
                    "employes_id": obj[1],
                    "validation": obj[2],
                    "motif": obj[3],
                    "last_name": obj[4],
                    "user_name": obj[5],
                    "datedebut": obj[6],
                    "datefin": obj[7],
                    "heuredebut": obj[8],
                    "heurefin": obj[9],
                    "date_autorisation": obj[10],
                    "commentaire": obj[11]
                })
            if json_data:
                return JsonResponse(json_data , safe=False)
            else:
                return JsonResponse({"message": "No data found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the exception and traceback for debugging
            traceback.print_exc()
            return JsonResponse({"message": f"Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)    
        
        
        
class refusworkflow(APIView):
   permission_classes = [AllowAny]
   def put(self, request,idconge):
         conges_obj = Conges.objects.select_related('employes' , 'motif_abs' ).get(id=idconge)
         idemp = conges_obj.employes.id
         nbjours = float(conges_obj.nbjours) if conges_obj.nbjours else 0  
         motif = conges_obj.motif_abs.motif
         user_email = conges_obj.employes.email
         soldes = float(conges_obj.employes.solde) if conges_obj.employes.solde else 0  
         datedebut= conges_obj.datedebut
         datefin=conges_obj.datefin 
         date_autorisation=conges_obj.date_autorisation
         contact=conges_obj.contact
         adresse=conges_obj.adresse
         fields = {
    'conges_obj': conges_obj,
    'user_email': user_email,
  
    'datedebut': datedebut,
    'datefin': datefin,
    'date_autorisation': date_autorisation,
    'contact': contact,
    'adresse': adresse,
    'motif':motif,
}
         objet= f"demande de {motif} réfusée "
         message = f"""la demande de {motif} a été réfusée par le chef hiérarchique , 
         cordialement
         """
         for field_name, value in fields.items():
             print(f"{field_name}: {value}")
         if Conges.objects.filter(id=idconge).update(validation=6):
            if conges_obj.motif_abs.motifConge == True :
               NewUser.objects.filter(id=idemp).update(solde=soldes+nbjours)
            send_email_template(objet , message , [user_email] )
            return Response({'message': 'Conge refused successfully'}, status=status.HTTP_200_OK)   
         else : 
            return Response({'error': 'Conge not found'}, status=status.HTTP_404_NOT_FOUND)    

class WorkflowByIdDepAPIView(APIView):
    # demande congés autorisation mission
    permission_classes = [AllowAny]

    def get(self, request, dep):
        cursor = connection.cursor()
        iddep = self.kwargs['dep']
        cursor.execute(
            "SELECT w.nom, w.departement_id, w.type_conge_id, w.id, m.motif , m.id, w.type_conge_id "
            "FROM syspointage_workflowconge AS w "
            "INNER JOIN syspointage_motif_abs AS m ON w.type_conge_id = m.id "
            "WHERE departement_id=%s", [iddep]
        )
        data = cursor.fetchall()
        json_data = []
        for obj in data:
            json_data.append({
                "workflow_nom": obj[0],
                "departement_id": obj[1],
                "workflow_type_conge_id": obj[2],
                "workflow_id": obj[3],
                "motif": obj[4],
                 "motif_id": obj[5],
                "type_conge_nom": obj[6]
            })
        return JsonResponse(json_data, safe=False)                   