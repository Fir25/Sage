from . models import *
from django.db import connection
from django.core.cache import cache
from . calcul_func import *
def Rapportunjour(idemploye,d1):#tous les rapports sont basés à cette fonction 
   json_data=[]
   listerapport=[]

   
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
         print(department_name)   
         
         datepointage=datetime.strptime(d1,"%Y-%m-%d").date()#convert str to date        
         cursor = connection.cursor()
         #sélectionner les pointages de l'employé concernné(idemploye) dans la date d1
         query="SELECT u.user_name , u.matricule , p.date_pointage ,pl.title,p.date_pointage,pl.id,u.id,u.last_name  FROM syspointage_newuser as u,syspointage_newuser_planningemp as pu , syspointage_planning as pl,syspointage_pointage as p where pu.newuser_id=u.id and pl.id=pu.planning_id and u.id=p.employes_id and u.id=%s and CONVERT( DATE,p.date_pointage)='%s' order by p.date_pointage" %(idemploye,d1)
         cursor.execute(query)
         r = cursor.fetchall()
         for obj in r:
               json_data.append({"user_name":obj[0],"matricule":obj[1],"date_pointage":obj[2].date(),"planing":obj[3],"heure":datetime.strptime(str(obj[4].time()).split('.')[0],"%H:%M:%S").time(),'idplaning':obj[5],"iduser":obj[6],"last_name":obj[7]})
         
         queryplanning=NewUser.objects.filter(id=idemploye).prefetch_related('planningemp')#jointure user with planning         
         for test in queryplanning:
               listaidplanings=list(test.planningemp.values('id'))#get list of planning affected to user 
         testplaning=SearchPlaning(d1,listaidplanings)#rechercher le planning de l'employé (idemploye) dans la date d1 ,, si cette employé n'a pas e planning dans ce jour elle va retourner false 
         
         if testplaning!=False:# si employé a un planning dans le jour d1
               parameters=searchDay(d1,idemploye,testplaning)#cette fonction retourne tous les détails de l'horaire de l'employé
               statusjour=parameters[0] 
               finpausee=parameters[14]
               debutpausee=parameters[13]
               finsortieee=parameters[2]
               norr=parameters[0]
               finentrehoraire=parameters[1]
               debutentrehoraire=parameters[4]
               debutsortiehor=parameters[5]
               debuthora=parameters[6]
               finhora=parameters[7]
               margeanticipehora=parameters[8]
               margeretardhora=parameters[9]
               plansem=parameters[10]
               quota=parameters[15] if parameters[15] else 0 
               minutesstatusjour=minute_interval(ttzero,datetime.strptime(str(statusjour),'%H:%M:%S').time())-quota
               nomplannig=parameters[11]
               pausee=parameters[15]   
               dpausedej=parameters[13]       
               fpausedej=parameters[14]
              
               if json_data: 
                  #dayofpointage=findDay(str(json_data[0]['date_pointage']))
                  dayofpointage=datetime.strptime(str(json_data[0]['date_pointage']),"%Y-%m-%d").weekday()#get the number of day
                  listep=[]
                  [listep.append(obj["heure"]) for obj in json_data] 
                  #si la différence entre deux pointages==30 secondes alors on va éliminer un pointage
                  if listep:
                     if (len(listep))!=1:
                        for i in range (0,len(listep)-1): 
                                     
                            if not minute_interval(ttzero,datetime.strptime(str(listep[i+1]),'%H:%M:%S').time()) -minute_interval(ttzero,datetime.strptime(str(listep[i]),'%H:%M:%S').time())<= minute_interval(ttzero,datetime.strptime("00:00:30",'%H:%M:%S').time()) :                     
                                listepointages.append(listep[i])
                        listepointages.append(listep[-1]) 
                     else:
                        listepointages.append(listep[0])            
                  pointages=' '.join(str(e) for e in listepointages)#transformer la liste de pointages en string pour l'afficher                      
                  nbpointages=len(listepointages)  
                  heureeffective=0.0
                  entreepointage=listepointages[0]#1er pointage
                  sortiepointage=listepointages[-1]#dernier pointage
                  if(dayofpointage==0 and statusjour):#si day =0(lundi)=>on appelle la fonction Day qui va calculer les heures de travail ....
                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota )   
                                 
                  elif(dayofpointage==1 and statusjour):               
                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota)     
                  elif(dayofpointage==2 and statusjour):
                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota) 
                  elif(dayofpointage==3 and statusjour):
                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota)
                  elif (dayofpointage==4 and statusjour):
                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota )
                  elif(dayofpointage==5 and statusjour):

                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota )
                  elif(dayofpointage==6 and statusjour):

                     listerapport=Day(finpausee,debutpausee,finsortieee,norr,finentrehoraire,debutentrehoraire,debutsortiehor,debuthora,finhora,margeanticipehora,margeretardhora,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota)
                  if listerapport : 
                     listerapport[0]['departement'] = department_name
                     listerapport[0]['typepaie'] = typepaie
                     
               l=[]
               l.append({"motif":"","Entree": "00:00:00", "Sortie": "00:00:00", "earlyEntree": "0.0", "lateEntree": "0.0", "earlySortie": "0.0", "lateSortie": "0.0", "user_name": user['user_name'] if user else None , "matricule":user['matricule'] if user else None , "date_pointage": d1, "planing":nomplannig, "heuretravail": "0.0", "pause": "0.0", "presencenormal": str(minutesstatusjour), "jourtravaille": 0,"iduser":idemploye,"entreepointage":"00:00:00","sortiepointage":"00:00:00","heureauthorisation":"0.0","deficit":str(minutesstatusjour),"iduser":idemploye,"pointages":"","tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","tempsconge":"0.0","last_name":user['last_name'] if user else None,"heuretravailbrute":"0.0","retardmidi":"0.0" , "departement" : department_name if user else ' ' , "typepaie" : typepaie })
               deficitconge=0.0
               if str(statusjour)=="00:00:00":#si un jour de repos
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
                      
                     timem=AbsenceMission(listMission,d1,idemploye,testplaning,ttzero,finpausee,debutpausee,finsortieee,norr,finentrehoraire,pausee)
                     
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
           
                  elif absence.objects.filter(employes=idemploye,datedebut__lte=datepointage, datefin__gte=datepointage).exists():   
            
                     abse=absence.objects.filter(employes=idemploye,datedebut__lte=datepointage, datefin__gte=datepointage).values('datedebut','datefin','heure_debut','heure_fin','justifie')[0]
                     listabsences.append({"datedebut":abse['datedebut'],"datefin":abse['datefin'],"heure_debut":abse['heure_debut'],"heure_fin":abse['heure_fin'],"justifie":abse['justifie']})       
                  
                  
                     timeab=AbsenceMission(listabsences,d1,idemploye,testplaning,ttzero,finpausee,debutpausee,finsortieee,norr,finentrehoraire,pausee)
                     if timeab:
                        
                        if timeab[1]==False:#if absence non justifié
                           if listerapport:#if employé  absent mais il travaille
                              listerapport[0]["motif"]="Absence non justifié"
                              listerapport[0]["tempabsence"]=str(timeab[0])
                              

                              return listerapport
                           else:
                              l[0]['motif']="Absence non justifié"
                              l[0]['tempabsence']=str(timeab[0])
                        
                              
                              return l
                        else:#abs justifié
                           if listerapport:#if employé  absent mais il travaille
                              deficit=0.0
                              if float(listerapport[0]['deficit'])>timeab[0]:
                                 deficit=float(listerapport[0]['deficit'])-timeab[0]
                              listerapport[0]["motif"]="Absence justifié"
                              listerapport[0]["tempabsence"]=str(timeab[0])
                              listerapport[0]["deficit"]=deficit
                              return listerapport
                           else:
                              l[0]['motif']="Absence justifié"
                              l[0]['tempabsence']=str(timeab[0])
                              if float(l[0]['deficit'])>timeab[0]:
                                 deficit=float(l[0]['deficit'])-timeab[0]
                              l[0]['deficit']=deficit
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
                 
                     if listepointages[0]>finentrehoraire:
                   
                        if listerapport:
                           tra=float(listerapport[0]["presencenormal"])/2
                           listerapport[0]['motif']="Abs demi-journée"
                           listerapport[0]['heuretravail']=tra
                           listerapport[0]['deficit']=(float(listerapport[0]["presencenormal"])-tra)
                           return listerapport
            

                     elif nbpointages % 2 !=0:
                
                        if listerapport:
                           listerapport[0]['motif']="Pointage impair"
                           return listerapport
                     # elif nbpointages<4:
                     #    if listerapport:
                     #       listerapport[0]['motif']="Pointage manquant"
                     #       return listerapport
                     else:
                        
                        if listerapport:#si il y'a pointages
                                 
                           return listerapport
                        else:
                     
                           l[0]['motif']="Absent"
                           return l
                                          
                           
                  else:
                     
                     if listerapport:#si il y'a pointages
                              
                        return listerapport
                     else:
                  
                        l[0]['motif']="Absent"
                        return l
               cache.set(
                 listerapport,json_data
               ) 
         else:
           listerapport.append({"motif":"pas de planning","Entree": "00:00:00", "Sortie": "00:00:00", "earlyEntree": "0.0", "lateEntree": "0.0", "earlySortie": "0.0", "lateSortie": "0.0", "user_name": user['user_name'] if user else None, "matricule":user['matricule'] if user else None, "date_pointage": d1, "planing":'pas de planning', "heuretravail": "0.0", "pause": "0.0", "presencenormal": "0.0", "jourtravaille": 0,"iduser":idemploye,"entreepointage":"00:00:00","sortiepointage":"00:00:00","heureauthorisation":"0.0","deficit":"0.0","iduser":idemploye,"pointages":"","tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","tempsconge":"0.0","last_name":user['last_name'] if user else None,"heuretravailbrute":"0.0","retardmidi":"0.0" , "departement" : department_name if user else None , "typepaie" : typepaie })
           return listerapport