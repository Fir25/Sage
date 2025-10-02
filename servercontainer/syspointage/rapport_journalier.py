 
from . models import *
from django.db import connection
from django.core.cache import cache
from . calcul_func import *
def Rapportunjour(idemploye,d1):#tous les rapports sont basés à cette fonction 
   json_data=[]
   listerapport=[]
   jase=[]

   # print("listabsences")
   if cache.get(idemploye) and cache.get(d1) and cache.get(json_data) and cache.get(listerapport):
       emp=cache.get(idemploye)
       d11=cache.get(d1)  
       rap=cache.get(listerapport)
       js=cache.get(listerapport)
       return js
       
   else: 
         listabsences=[]  
         listMission=[]
         nbpointages=0
         timec=0.0
         deficit=0.0
         timem=[]
         timeab=[]
         listee=[]
         listepointages=[]
         listaidplanings=[]
         ttzero=datetime.strptime("00:00:00","%H:%M:%S").time()
         user=None
         department_name=' ' 
         typepaie=' '
         statusjour=None
         minutesstatusjour = 0
         finpausee = None
         debutpausee = None
         finsortieee = None
         norr = None
         finentrehoraire = None
         debutentrehoraire = None
         debutsortiehor = None
         debuthora = None
         finhora = None
         margeanticipehora = None
         margeretardhora = None
         plansem = None
         quota = 0
         nomplannig = None
         pausee = None
         dpausedej = None
         fpausedej = None
         refpointeusee=''
         efpointeusee=''
         
         if   NewUser.objects.filter(id=idemploye).exists(): 
            user=NewUser.objects.filter(id=idemploye).values('user_name','last_name','matricule')[0]#get the details of user
         try :    
            userd = NewUser.objects.get(id=idemploye)
         except :
            userd=None   
         if userd : 
          department = userd.arborescence.first()
          if department:
             department_name = department.nom
          else:
             department_name = None 
          if userd.typepaie:
            typepaie = "forfaitaire"
          else:
            typepaie = "non forfaitaire" 
            
        
         
         datepointage = datetime.strptime(d1, "%Y-%m-%d").date()
         idemploye = int(idemploye)  # S'assurer que c'est un int

         cursor = connection.cursor()
         qu = """ 
            SELECT l.lignename
            FROM syspointage_newuser u
            JOIN syspointage_ligne l ON u.id_ligne = l.id
             WHERE u.id = %s
             """
         cursor.execute(qu, (idemploye,))
         Ligne_nam = cursor.fetchone()
         Ligne_name = Ligne_nam[0] if Ligne_nam else "..." 
         cursor = connection.cursor()
         sql = """
            SELECT s.superviseurname
            FROM syspointage_superviseur s
            JOIN syspointage_newuser_superviseur ns ON ns.superviseur_id = s.id
            WHERE ns.newuser_id = %s 
         """
         cursor.execute(sql, (idemploye,))
         r = cursor.fetchone()
         Superviseur_name = r[0] if r else "..."

         cursor = connection.cursor()
# -------------------------------
# 1. Requête : pointages du jour uniquement
# -------------------------------
         query = """
            SELECT u.user_name, u.matricule, p.date_pointage, u.id, u.last_name, u.superviseur, p.pointeuse_id
            FROM syspointage_newuser AS u
            JOIN syspointage_pointage AS p ON u.id = p.employes_id
            WHERE u.id = %s
               AND p.date_pointage >= %s::timestamp
               AND p.date_pointage < (%s::date + INTERVAL '1 day')
            ORDER BY p.date_pointage;
         """
         cursor.execute(query, (idemploye, datepointage, datepointage))
         r = cursor.fetchall()

         json_data = []
         for obj in r:
            date_pointage = obj[2]
            if isinstance(date_pointage, str):
               date_pointage = datetime.strptime(date_pointage, "%Y-%m-%d %H:%M:%S")
            heure = date_pointage.time() if date_pointage else None

            json_data.append({
               "user_name": obj[0],
               "matricule": obj[1],
               "date_pointage": date_pointage.date() if date_pointage else None,
               "heure": heure,
               "iduser": obj[3],
               "last_name": obj[4],
               "superviseur": obj[5],
               "pointeuse_id": obj[6]
            })

         # -------------------------------
         # 2. Si shift nuit → ajouter le lendemain matin (00h–07h)
         # -------------------------------
         if json_data:
            dayofpointage=datetime.strptime(str(json_data[0]['date_pointage']),"%Y-%m-%d").weekday()#get the number of day
            heures = [obj["heure"] for obj in json_data if obj["heure"]]
            
            pointeuses_sortie_ids1 = list(pointeuse.objects.filter(etat=False).values_list('id', flat=True))
            shift_nuit = False
            if heures:
               print('heures', heures)
               has_midday_exit = any(time(12, 0) <= h <= time(16, 0) for h in heures)
               json_data_sorted0 = sorted(json_data, key=lambda x: x["heure"],reverse=False)
               # Vérifier le premier et dernier pointage
               h_debut = heures[0]
               print('pointeuses_sortie_ids1')
               print('objjjj',obj[6])
               if (h_debut  <= time(8, 0)) and not has_midday_exit and json_data_sorted0[0]['pointeuse_id'] in pointeuses_sortie_ids1:
                  shift_nuit = True
                  print("Shift nuit détecté")
               else:
                  print("Pas shift nuit")
                 
            if shift_nuit:
               print('shift_nuit')
               query_shift_nuit = """
               SELECT u.user_name, u.matricule, p.date_pointage, u.id, u.last_name, u.superviseur, p.pointeuse_id
               FROM syspointage_newuser AS u
               JOIN syspointage_pointage AS p ON u.id = p.employes_id
               WHERE u.id = %s
               AND p.date_pointage >= (%s::date - INTERVAL '1 day' + INTERVAL '20 hours') -- hier 20h
               AND p.date_pointage < (%s::date + INTERVAL '7 hours')                     -- aujourd'hui 07h
               ORDER BY p.date_pointage;
            """
               cursor.execute(query_shift_nuit, (idemploye, datepointage, datepointage))
               r2 = cursor.fetchall()
               

               for obj in r2:
                     date_pointage = obj[2]
                     if isinstance(date_pointage, str):
                           date_pointage = datetime.strptime(date_pointage, "%Y-%m-%d %H:%M:%S")
                     heure = date_pointage.time() if date_pointage else None

                     # Construire le dictionnaire candidat
                     new_entry = {
                           "user_name": obj[0],
                           "matricule": obj[1],
                           "date_pointage": date_pointage.date() if date_pointage else None,
                           "heure": heure,
                           "iduser": obj[3],
                           "last_name": obj[4],
                           "superviseur": obj[5],
                           "pointeuse_id": obj[6]
                     }

                     # Vérifier si cet enregistrement existe déjà
                     if not any(
                           d["date_pointage"] == new_entry["date_pointage"] and
                           d["heure"] == new_entry["heure"] and
                           d["pointeuse_id"] == new_entry["pointeuse_id"]
                           for d in json_data
                     ):
                           json_data.append(new_entry)

         # -------------------------------
         # 3. Nettoyage + construction listep
         # -------------------------------
            listep = [obj["heure"] for obj in json_data if obj["heure"]]
            print('listep',listep)
            
            # Supprimer les pointages suspects (lendemain avant 08h si déjà sortie à midi)
            # -------------------------------
            # 4. Construire listepointages (sans doublons proches)
            # -------------------------------
            listepointages = []
            if listep:
                  if len(listep) > 1:
                     for i in range(len(listep) - 1):
                        h1 = datetime.strptime(str(listep[i]), '%H:%M:%S').time()
                        h2 = datetime.strptime(str(listep[i+1]), '%H:%M:%S').time()
                        delta = minute_interval(ttzero, h2) - minute_interval(ttzero, h1)
                        if delta > minute_interval(ttzero, datetime.strptime("00:30:30", '%H:%M:%S').time()):
                              listepointages.append(listep[i])
                     listepointages.append(listep[-1])
                  else:
                     listepointages.append(listep[0])

            pointages = ' '.join(str(e) for e in listepointages)
            nbpointages = len(listepointages)
            print('nbpointages',nbpointages)
            print('listepointages',listepointages)
            # -------------------------------
            # 5. Entrée et sortie (via pointeuses entrée/sortie)
            # -------------------------------
            pointeuses_entree_ids = list(pointeuse.objects.filter(etat=True).values_list('id', flat=True))
            pointeuses_sortie_ids = list(pointeuse.objects.filter(etat=False).values_list('id', flat=True))

            # Trouve première entrée (pointeuse entrée)
            # Trier json_data par heure croissante
            # Trier listepointages par heure croissante
            json_data_sorted = sorted(json_data, key=lambda x: x["heure"], reverse=shift_nuit)

            print('json_data',json_data_sorted)
            # 1. Trier les pointages par heure
            

            # 2. Récupérer premier et dernier pointage
            first_pointage = json_data_sorted[0] if json_data_sorted else None
            print('first_pointage',first_pointage)
            last_pointage = json_data_sorted[-1] if json_data_sorted else None
            print('last_pointage',last_pointage)

            entreepointage, sortiepointage = None, None

            # 1. Trier par heure
            

            # 2. Entrée = première heure avec une pointeuse d'entrée
            entreepointage = next(
               (
                  obj["heure"]
                  for obj in (json_data_sorted)
                  if obj["heure"] == first_pointage["heure"] and obj["pointeuse_id"] in pointeuses_entree_ids
               ),
               None
             )
            # 3. Sortie = dernière heure avec une pointeuse de sortie
            sortiepointage = next(
               (
                  obj["heure"]
                  for obj in reversed(json_data_sorted)
                  if obj["heure"] == last_pointage["heure"] and obj["pointeuse_id"] in pointeuses_sortie_ids
               ),
               None
            )

            print("Entrée:", entreepointage)
            print("Sortie:", sortiepointage)





           
            refpointeuse = ''
            efpointeuse = ''

            if json_data:  # Vérifie que json_data n’est pas vide
               refpointeusee = pointeuse.objects.filter(
                  id__in=pointeuses_entree_ids,
                  id=json_data[0]["pointeuse_id"]
               ).values('id').first()
               refpointeuse = refpointeusee['id'] if refpointeusee else ''

               efpointeusee = pointeuse.objects.filter(
                  id__in=pointeuses_sortie_ids,
                  id=json_data[-1]["pointeuse_id"]
               ).values('id').first()
               efpointeuse = efpointeusee['id'] if efpointeusee else ''
            nom_pointeuse_entree = pointeuse.objects.filter(id=refpointeuse).values_list('nom_pointeuse', flat=True).first() if refpointeuse else ''
            nom_pointeuse_sortie = pointeuse.objects.filter(id=efpointeuse).values_list('nom_pointeuse', flat=True).first() if efpointeuse else ''
            parameters = searchDay(d1, idemploye, entreepointage,sortiepointage)# Accès aux éléments de parameters
            if parameters is not None and len(parameters) >= 14:
                     statusjour = parameters[0]
                     finentree = parameters[1]
                     finsortieee = parameters[2]
                     debutentrehoraire = parameters[4]
                     debutsortiehor = parameters[5]
                     debuthora = parameters[6]
                     finhora = parameters[7]
                     margedepartant = parameters[8]
                     margeretard = parameters[9]
                     debutpausee = parameters[10]
                     finpausee = parameters[11]
                     quota = parameters[12]
                     nomhoraire=parameters[13]
            if  (dayofpointage in range(7)) :
                     listerapport = Day(
                     finpausee, debutpausee, finsortieee, norr, finentrehoraire, debutentrehoraire,
                                    debutsortiehor, debuthora, finhora, margeanticipehora,margeretardhora,
                                    entreepointage, sortiepointage, listepointages, ttzero,json_data,
                                    idemploye, pointages, pausee, dpausedej, fpausedej, quota,nomhoraire,refpointeuse,efpointeuse,department_name,d1,Ligne_name,Superviseur_name,nom_pointeuse_entree,nom_pointeuse_sortie,shift_nuit
                     )
            else:
                        ('problème détecté')
            if listerapport : 
                        listerapport[0]['departement'] = department_name
                        listerapport[0]['typepaie'] = typepaie
                        listerapport[0]['pointeuses_entree'] = refpointeuse
                        listerapport[0]['typepaie'] = efpointeuse             
         l=[]
         l.append({
                "motif": "pas de pointage",  # Motif de l'absence
               "Entree": "00:00:00",  # Valeur par défaut pour l'heure d'entrée
               "Sortie": "00:00:00",  # Valeur par défaut pour l'heure de sortie
               "earlyEntree": "0.0",  # Valeur par défaut pour entrée trop tôt
               "lateEntree": "0.0",  # Valeur par défaut pour retard d'entrée
               "earlySortie": "0.0",  # Valeur par défaut pour sortie trop tôt
               "lateSortie": "0.0",  # Valeur par défaut pour retard de sortie
               "user_name": user.get('user_name', None),  # Nom de l'utilisateur
               "matricule": user.get('matricule', None),  # Matricule
               "date_pointage": d1,
               "planing": "pas de pointage",  # Pas de planing
               "heuretravail": "0.0",  # Pas d'heure de travail
               "pause": "0.0",  # Pas de pause
               "presencenormal": "0",  # Pas de présence normale
               "jourtravaille": "0",  # Pas de jour travaillé
               "iduser": idemploye,  # ID
               "entreepointage": "00:00:00",  # Pas d'entrée
               "sortiepointage": "00:00:00",  # Pas de sortie
               "heureauthorisation": "0",
               "deficit": "0.0",  # Pas de déficit
               "pointages": "0",  # Pas de pointage
               "tempabsence": "0.0",  # Pas d'absence
               "jourconge": "0",  # Pas de jour de congé
               "tempsMission": "0.0",  # Pas de temps de mission
               "tempsconge": "0.0",  # Pas de temps de congé
               "last_name": user.get('last_name', None),  # Nom de famille
               "ligne_de_production":Ligne_name if user else None,
               "superviseur": Superviseur_name if user else None,
               "heuretravailbrute": "0.0",  # Pas d'heure de travail brute
               "retardmidi": "0.0",  # Pas de retard à midi
               "nomhoraire": "pas de pointage",  # Correspond à 'nomhoraire' dans listerapport
               "debuthoraire": "00:00:00",  # Heure d'entrée par défaut
               "finhoraire": "00:00:00",  # Heure de sortie par défaut
               "refpointeuse": "...",  # Pas de pointage
               "efpointeuse": "...",
               "jour_nrmlmn_travaille": "0",  # Pas de travail
               "jour_travaille": "0",  # Pas de travail
               "retard": "0.0",  # Pas de retard
               "depart_anticipe": "0.0",  # Pas de départ anticipé
               "Absent": 1 ,  # L'absence est marquée
               "heuresup": "0.0",  # Pas d'heures supplémentaires
               "presenceplann": "0.0",  # Pas de présence planifiée
               "departement_name": department_name if user else None,  # Département
               "presencenormal": "0.0",  # Présence normale
            })
         deficitconge=0.0
         if not json_data and get_jour_semaine(d1) == "dimanche"  :  #si un jour de repos
                  l[0]['motif']="Repos"
                  if listerapport:
                     l[0]['heuretravailbrute']=listerapport[0]['heuretravailbrute']
                    
                     l[0]['pointages']=listerapport[0]['pointages']
                  return l 
                  
         else:
            
                  timeaut=0.0
                  tra=0.0
                  
                  
                  if JourFerie.objects.filter(date__lte=datepointage, datefin__gte=datepointage).exists():#si il y a un jour ferié dans le jour concerné    
                 
                      
                        if listerapport:#if employé en jour ferié mais il travaille
                           #listee.append({"motif":"Jour Ferié","Entree":listerapport[0]["Entree"],"Sortie":listerapport[0]["Sortie"],"earlyEntree":listerapport[0]["earlyEntree"],"lateEntree":listerapport[0]["lateEntree"],"earlySortie":listerapport[0]["earlySortie"],"lateSortie":listerapport[0]["lateSortie"],"user_name":listerapport[0]["user_name"],"matricule":listerapport[0]["matricule"],"date_pointage":listerapport[0]["date_pointage"],"planing":nomplannig,"heuretravail":listerapport[0]["heuretravail"],"pause":listerapport[0]["pause"],"presencenormal":listerapport[0]["presencenormal"],"jourtravaille":listerapport[0]["jourtravaille"],"iduser":listerapport[0]["iduser"],"entreepointage":listerapport[0]['entreepointage'],"sortiepointage":listerapport[0]['sortiepointage'],"heureauthorisation":listerapport[0]['heureauthorisation'],"deficit":"0.0","iduser":idemploye,"pointages":listerapport[0]["pointages"],"tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","tempsconge":"0.0","last_name":listerapport[0]["last_name"],"heuretravailbrute":listerapport[0]['heuretravailbrute'],"retardmidi":listerapport[0]['retardmidi']})  
                           listerapport[0]['motif']="Jour Ferié"
                           listerapport[0]['deficit']="0.0"
                           
                           return listerapport
                        else:
                           l[0]['motif']="Jour Ferié"
                           l[0]['deficit']="0.0"
                           return l  

                  elif Conges.objects.filter(employes=idemploye,date_autorisation=None,teletravail=True,validationrh=1,validationrh2=2,mission=False,datedebut__lte=datepointage, datefin__gte=datepointage).exists():   
                         
                      
                     cc=Conges.objects.filter(employes=idemploye,date_autorisation=None,teletravail=True,validationrh=1,validationrh2=2,mission=False,datedebut__lte=datepointage, datefin__gte=datepointage).values()
  
                     if listerapport :#if employé en congé validé mais il travaille

                        listerapport[0]['motif']="Téletravail"
                        return listerapport
                        

                     else:

                        l[0]['motif']="Téletravail"
                        
                        return l 
 
                  elif Conges.objects.filter(employes=idemploye,date_autorisation=None,teletravail=False,validationrh=1,validationrh2=2,mission=False,datedebut__lte=datepointage, datefin__gte=datepointage).exists():   
                     
                     
                     cc=Conges.objects.filter(employes=idemploye,date_autorisation=None,teletravail=False,validationrh=1,validationrh2=2,mission=False,datedebut__lte=datepointage, datefin__gte=datepointage).values('motif_abs_id')[0]
                     
                     idmotif=cc['motif_abs_id']
                     if idmotif:
                        m=motif_abs.objects.filter(id=idmotif).values()[0].get('motifdemijournne')#get motif of congé (demi journé)
                        
                        if m==False:#si congé n'est pas une demi journée
                           timec=minutesstatusjour
                        else:#dei journée
                           timec=minutesstatusjour/2

                     
                     if listerapport :#if employé en congé validé mais il travaille
                        if float(listerapport[0]['deficit'])>timec:#si déficit est supérieur à temps de  alors :deficit=deficit-temps congé
                           deficitconge=float(listerapport[0]['deficit'])-timec

                        listerapport[0]['motif']="Congé"
                        listerapport[0]['tempsconge']=timec
                        listerapport[0]['jourconge']="1"
                        listerapport[0]['deficit']=deficitconge
                        return listerapport
                     else:

                        l[0]['motif']="Congé"
                        l[0]['deficit']="0.0"
                        l[0]["tempsconge"]=timec
                        l[0]['jourconge']="1"
                        return l
               
                  elif Conges.objects.filter(employes=idemploye,validationrh=1,validationrh2=2,mission=True,datedebut__lte=datepointage, datefin__gte=datepointage).exists():   
                     
                     missi=Conges.objects.filter(employes=idemploye,validationrh=1,validationrh2=2,mission=True,datedebut__lte=datepointage, datefin__gte=datepointage).values('datedebut','datefin','validation','heure_debut','heure_fin')[0]
                  
                     listMission.append({"datedebut":missi['datedebut'],"datefin":missi['datefin'],"validation":missi['validation'],"heure_debut":missi['heure_debut'],"heure_fin":missi['heure_fin'],"justifie":""})
                      
                     timem=AbsenceMission(listMission,d1,idemploye,ttzero,finpausee,debutpausee,finsortieee,norr,finentrehoraire,pausee)
                     
                     if timem:
                         
                        if listerapport:
                           #les heures de mission sont des heures de travail
                           heuretravailmission=float(timem[0])+float(listerapport[0]['heuretravail'])#l'employé pointe ,travaille puis sorte en mission,remarque la mission est un travail
                           if float(listerapport[0]['deficit'])>float(timem[0]):
                              deficitmissionpointage=float(listerapport[0]['deficit'])-float(timem[0])
                           else:
                              deficitmissionpointage=0.0

                           listerapport[0]["motif"]="Mission"
                           listerapport[0]["heuretravail"]=str(heuretravailmission)
                           listerapport[0]["deficit"]=str(deficitmissionpointage)
                           listerapport[0]["tempsMission"]=str(timem[0])
           
                           return listerapport
                        
                        else:
                           deficit_mission=0.0
                           if minutesstatusjour>float(timem[0]):
                              deficit_mission=minutesstatusjour-float(timem[0])#deficit mission:la mission comme heure de travail donc deficit =presence normale-heures de mission
                           l[0]['motif']='Mission'
                           l[0]['heuretravail']=timem[0]
                           l[0]['deficit']=str(deficit_mission)

                           l[0]['tempsMission']=str(timem[0])
                           return l
                  
                  elif absence.objects.filter(employes=idemploye, datedebut__lte=datepointage, datefin__gte=datepointage).exists():
                           abse = (
                              absence.objects
                              .filter(employes=idemploye, datedebut__lte=datepointage, datefin__gte=datepointage)
                              .select_related('motif_abs')
                              .values(
                                    'datedebut',
                                    'datefin',
                                    'heure_debut',
                                    'heure_fin',
                                    'motif_abs__justifie',
                                    'motif_abs__motif'  # ✅ ici on récupère le texte du motif
                              )
                              .first()
                           )

                           if abse:
                              listabsences.append({
                                    "datedebut": abse['datedebut'],
                                    "datefin": abse['datefin'],
                                    "heure_debut": abse['heure_debut'],
                                    "heure_fin": abse['heure_fin'],
                                    "justifie": abse['motif_abs__justifie'],
                                    "motif": abse['motif_abs__motif']  # ✅ motif réel ajouté
                              })

                              print(listabsences)

                              timeab = AbsenceMission(
                                    listabsences,
                                    d1,
                                    idemploye,
                                    ttzero,
                                    finpausee,
                                    debutpausee,
                                    finsortieee,
                                    norr,
                                    finentrehoraire,
                                    pausee
                              )

                              if timeab:
                                    motif_nom = abse['motif_abs__motif']  # ✅ utiliser le vrai nom du motif

                                    if timeab[1] == False:
                                       if listerapport:
                                          listerapport[0]["motif"] = motif_nom
                                          listerapport[0]["tempabsence"] = str(timeab[0])
                                          return listerapport
                                       else:
                                          l[0]["motif"] = motif_nom
                                          l[0]["tempabsence"] = str(timeab[0])
                                          return l
                                    else:
                                       if listerapport:
                                          deficit = 0.0
                                          if float(listerapport[0]['deficit']) > timeab[0]:
                                                deficit = float(listerapport[0]['deficit']) - timeab[0]
                                          listerapport[0]["motif"] = motif_nom
                                          listerapport[0]["tempabsence"] = str(timeab[0])
                                          listerapport[0]["deficit"] = deficit
                                          return listerapport
                                       else:
                                          l[0]["motif"] = motif_nom
                                          l[0]["tempabsence"] = str(timeab[0])
                                          deficit = float(l[0]['deficit'])
                                          if deficit > timeab[0]:
                                                deficit -= timeab[0]
                                          l[0]["deficit"] = deficit
                                          return l

                  
                  elif Conges.objects.filter(date_autorisation=datepointage,employes=idemploye,validationrh=1,validationrh2=2,mission=False,teletravail=False).values('date_autorisation','heure_debut',"heure_fin"):
           
                     autho=Conges.objects.filter(date_autorisation=datepointage,employes=idemploye,validationrh=1,validationrh2=2,mission=False,teletravail=False).values('date_autorisation','heure_debut',"heure_fin")[0]          
                     p=0.0
                    
                     heurefinaut=minute_interval(ttzero,datetime.strptime(str(autho['heure_fin']),'%H:%M:%S').time())
                     heuredebutaut=minute_interval(ttzero,datetime.strptime(str(autho['heure_debut']),'%H:%M:%S').time())
                     debutpauseminu=minute_interval(ttzero,datetime.strptime(str(debutpausee),'%H:%M:%S').time())
                     finpauseminutes=minute_interval(ttzero,datetime.strptime(str(finpausee),'%H:%M:%S').time())
                     
                     p=minute_interval(datetime.strptime(str(debutpausee),'%H:%M:%S').time(),datetime.strptime(str(finpausee),'%H:%M:%S').time())
                     
            
                     if heuredebutaut<=debutpauseminu: 
                        if heurefinaut<=debutpauseminu or heurefinaut>=finpauseminutes:
                           timeaut=heurefinaut-heuredebutaut
                        
               
                        if debutpauseminu<=heurefinaut<=finpauseminutes:
                           timeaut=debutpauseminu-heuredebutaut
               
                     elif heuredebutaut>=finpauseminutes: 
                           timeaut=heurefinaut-heuredebutaut
         
                     elif debutpauseminu<=heuredebutaut<=finpauseminutes: 
                        if heurefinaut>=finpauseminutes:           
                           timeaut=heurefinaut-finpauseminutes
                     if timeaut!=0.0:
                 
                        if listerapport:
                           listerapport[0]['motif']="Autorisation"
                           listerapport[0]['heureauthorisation']=timeaut
                         
                           return listerapport
                        else:
                        
                           l[0]['motif']='Autorisation'
                           l[0]['heureauthorisation']=timeaut
                           
                           
                           return l 

                  elif listepointages:
                     if listepointages[0] is not None and finentrehoraire is not None:
                        if listepointages[0] > finentrehoraire:
                         if listerapport:
                           tra=float(listerapport[0]["presencenormal"])/2
                           listerapport[0]['motif']="Abs demi-journée"
                           listerapport[0]['heuretravail']=tra
                           listerapport[0]['deficit']=(float(listerapport[0]["presencenormal"])-tra)
                           return listerapport
                     elif nbpointages < 2 :
                           listerapport[0]['motif'] = "Pointage impair"
                           return listerapport
                     elif nbpointages == 2 and entreepointage == None or sortiepointage == None  :               
                        if listerapport:
                           listerapport[0]['motif']="Pointage non correct"
                           return listerapport
                     
                                          
                           
                     else: 
                        if listerapport:#si il y'a pointages
                           l[0]['motif']="Absent"    
                           return listerapport
                  else:
                     
                        l[0]['motif']="Absent"
                        return l
                  cache.set(
                  listerapport,json_data
                  ) 
         
         # if findDay(d1)=="dimanche":
                  
         #       listerapport.append({"motif":"Repos","Entree": "00:00:00", "Sortie": "00:00:00", "earlyEntree": "0.0", "lateEntree": "0.0", "earlySortie": "0.0", "lateSortie": "0.0", "user_name": user['user_name'] if user else None, "matricule":user['matricule'] if user else None, "date_pointage": d1, "planing":'pas de planning', "heuretravail": "0.0", "pause": "0.0", "presencenormal": "0.0", "jourtravaille": 0,"iduser":idemploye,"entreepointage":"00:00:00","sortiepointage":"00:00:00","heureauthorisation":"0.0","deficit":"0.0","iduser":idemploye,"pointages":"","tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","tempsconge":"0.0","last_name":user['last_name'] if user else None,"heuretravailbrute":"0.0","retardmidi":"0.0" , "departement" : department_name if user else None , "typepaie" : typepaie })
         # else: listerapport.append({"motif":"pas de pointage","Entree": "00:00:00", "Sortie": "00:00:00", "earlyEntree": "0.0", "lateEntree": "0.0", "earlySortie": "0.0", "lateSortie": "0.0", "user_name": user['user_name'] if user else None, "matricule":user['matricule'] if user else None, "date_pointage": d1, "planing":'pas de planning', "heuretravail": "0.0", "pause": "0.0", "presencenormal": "0.0", "jourtravaille": 0,"iduser":idemploye,"entreepointage":"00:00:00","sortiepointage":"00:00:00","heureauthorisation":"0.0","deficit":"0.0","iduser":idemploye,"pointages":"","tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","tempsconge":"0.0","last_name":user['last_name'] if user else None,"heuretravailbrute":"0.0","retardmidi":"0.0" , "departement" : department_name if user else None , "typepaie" : typepaie })
                  
         return listerapport
         





        