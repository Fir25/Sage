from . calcul_func import *
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db import connection
 
class rapportwfm(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get(self, request,id ):   
        dateaujourdhui = datetime.now().date()
        pp=NewUser.objects.values().filter(is_superuser=True,id=id)
        if pp : 
          query = """SELECT distinct u.id, u.matricule, u.user_name, r.rolename, a.nom, u.last_name FROM syspointage_newuser AS u LEFT JOIN   syspointage_role AS r ON r.id = u.role_id LEFT JOIN syspointage_newuser_arborescence AS ua ON ua.newuser_id = u.id LEFT JOIN syspointage_arborescence AS a ON a.id = ua.arborescence_id LEFT JOIN syspointage_arborescence_chefs AS uo ON a.id = uo.arborescence_id """
        else : 
          query = """SELECT u.id, u.matricule, u.user_name, r.rolename, a.nom, u.last_name FROM syspointage_newuser AS u LEFT JOIN   syspointage_role AS r ON r.id = u.role_id LEFT JOIN syspointage_newuser_arborescence AS ua ON ua.newuser_id = u.id LEFT JOIN syspointage_arborescence AS a ON a.id = ua.arborescence_id LEFT JOIN syspointage_arborescence_chefs AS uo ON a.id = uo.arborescence_id WHERE uo.newuser_id= %s"""%(id)
        cursor = connection.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        json_data = []
      
        for obj in data:
            lastpoin = "00:00:00"
            etatemp = "absent"
            totpause = "00:00:00"
            totpausenonpla = "00:00:00"
            totdej = "00:00:00"
            totlog = "00:00:00"
            dateaujourdhui = datetime.now().date()
            plist = list(pointage.objects.filter(employes=obj[0],date_pointage__date=dateaujourdhui).order_by('date_pointage__hour','date_pointage__minute','date_pointage__second').values())
            if plist :
               print(plist)
               hel = plist[-1].get('date_pointage')
               dt = datetime.fromisoformat(str(hel))


               # Extract the time from the datetime object
               time_only = dt.time()

               # Convert the time object to a string in the format "HH:MM:SS"
               lastpoin = time_only.strftime("%H:%M:%S")
               if plist[-1].get('etat') == 0 or (plist[-1].get('etat') == 1 and plist[-1].get('idpause_id')!= None):
               
                  etatemp ="actif"
               if plist[-1].get('etat') == 0 and plist[-1].get('idpause_id')!= None   :  
                  id_emp_eeed =  plist[-1].get('idpause_id')
                  typedepause =  Pauses.objects.filter(id=id_emp_eeed).values()
                  etatemp = "pause (%s)"%(typedepause[0].get('nom'))   
               if plist[-1].get('etat') == 1 and plist[-1].get('idpause_id')== None   : 
                  etatemp = "sortie"   
               queryplanning = NewUser.objects.filter(id=int(obj[0])).prefetch_related('planningemp')
               if queryplanning.exists():
                   listaidplanings = list(queryplanning[0].planningemp.values('id'))

                   testplaning = SearchPlaning(str(dateaujourdhui), listaidplanings)

                   if testplaning != False:
                         parameters = searchDay(str(dateaujourdhui), int(obj[0]), testplaning)
                         horaire = parameters[12]
                

                         pau = list(Pauses.objects.filter(idhoraire=horaire, planifie=True).values())
                         pointagepausedej = list(
                         pointage.objects.filter(employes=int(obj[0]),
                                                  date_pointage__date=dateaujourdhui ,idpause__pausedejeuner=True ).values())                            
                         totdej =  calcul_temps_sortie_entree(pointagepausedej)
                    
                         pointagepause = list(
                         pointage.objects.filter(employes=int(obj[0]),
                                                    date_pointage__date=dateaujourdhui ,idpause__isnull=False , idpause__pausedejeuner=False , idpause__planifie=True ).values())
                         totpause = calcul_temps_sortie_entree(pointagepause)
                    
                    
                         pointagepausenonpla = list(
                            pointage.objects.filter(employes=int(obj[0]),
                                                    date_pointage__date=dateaujourdhui ,idpause__isnull=False , idpause__pausedejeuner=False , idpause__planifie=False ).values())
                         totpausenonpla = calcul_temps_sortie_entree(pointagepausenonpla) 
                    
                         pointagelogg = list(
                            pointage.objects.filter(employes=int(obj[0]),
                                                    date_pointage__date=dateaujourdhui ,idpause__isnull=True ).values())
                         totlog = calcul_temps_sortie_entree(pointagelogg)
                    
                    
               if etatemp != "absent"  :   
                    json_data.append({
                    "user_id": obj[0],
                    "user_matricule": obj[1],
                    "user_name": obj[2],
                    "role_name": obj[3],
                    "arborescence_nom": obj[4],  
                    "user_last_name": obj[5],
                   
                    "etat" : etatemp , 
                    "pauses": totpause,
                    "pausesdej" : totdej ,
                    "pausesnonpla" : totpausenonpla ,
                    "depuis" : lastpoin , 
                    "totlog" : totlog ,
                  # Array of pauses for each user
                     })
        return JsonResponse(json_data, safe=False)