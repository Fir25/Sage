from . calcul_func import *
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db import connection
from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from django.db.models import Max
from datetime import datetime
class Pointageaujourdhui(generics.ListAPIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
         idemploye=self.kwargs['pk']
         dateaujourdhui=datetime.now().date()
         #pointage avec ordre croissant
         plist=list(pointage.objects.filter(employes=idemploye,date_pointage__date=dateaujourdhui).values().all().order_by('date_pointage__hour','date_pointage__minute','date_pointage__second'))
         lista=[]
         sortie=''
         sortiepause='' 
         verifpausedej=None
         debutsortie=None
         finsortie=None
         finpausedej=None
         debutpausedej=None
         pauses=[]
         pauselist=[]
         nbfoisrestant=0
         nbpausedej=0
         pausedejeuner=''
         pau=[]
         testifpause=True
         foisnb = 0   
         nb = 0
         if plist:
            pp=plist[-1]#get the last element in list 
            nombrepointage = len(plist)
            queryplanning=NewUser.objects.filter(id=idemploye).prefetch_related('planningemp')#jointure user avec planning         
            for test in queryplanning:
                  listaidplanings=list(test.planningemp.values('id'))#get the ids of planning
            testplaning=SearchPlaning(str(dateaujourdhui),listaidplanings)#get the planning of employe today 
            if testplaning!=False:#if user has planning
               parameters=searchDay(str(dateaujourdhui),idemploye,testplaning)#return horaire of user today
               horaire=parameters[12]
               finsortie=parameters[2]

               debutsortie=parameters[5]
               pau=list(Pauses.objects.filter(idhoraire=horaire).values().all())#pause list of horaire
               #pau.append
               if pp.get('etat') == 1 :
                   testifpause =True
               if pp.get('idpause_id')!= None and pp.get('etat') == 0 :
                  testifpause =False
                  print("---------------------------------------------")
                  print(list(Pauses.objects.filter(id=pp.get('idpause_id')).values().all())[0])
                  pauseaa=list(Pauses.objects.filter(id=pp.get('idpause_id')).values().all())[0]
                  pauselist.append(pauseaa) 
              
               for p in pau:#loop in list of pauses
                
                  now = datetime.now()
                
                  current_time = now.strftime("%H:%M:%S")
               
                  print(pp)
                  print(p,p.get('id'))
                  nb=pointage.objects.filter(employes=idemploye,idpause=p.get('id'),date_pointage__date=dateaujourdhui).count()#déterminer le nombre des pointages de pause aujourd'hui
               
                  foisnb=p.get('nbfois')#déterminer le nombre de fois de pause
                  print(foisnb)
                 
                  if now >  datetime.combine(datetime.today().date(), p.get('dpause')) and now < datetime.combine(datetime.today().date(), p.get('fpause')) and testifpause :
                    
                     
                     if foisnb*2>nb:#si le double de nombre de fois de pauses est supérieur au nombre de fois des pointages pauses alors on remplit la liste
                         pauselist.append(p) 
               nbfoisrestant=foisnb-nb                  

               if pp.get('idpause_id')==None:#if last element=>pas de pause =>employé =entrée ou sortie
                     if pp.get('etat')==0:#entrée
                        if debutsortie!=None and finsortie!=None:
                           if debutsortie<=datetime.now().time()<=finsortie  :
                              sortie=1
                           
                              sortiepause=2#entré pause

                        else:   
                           sortie=1
                        
                     else:#sortie 
                        sortie=2#il faut entrer
               else:#il y a paus
                     
                     if pp.get('etat')==0:#entrée
                        sortiepause=1#il faut sortir (aprés pause)
                     else:#sortie pause
                        #if on a dans la plage d'hoaraire sortie alors il faut sortir si non une autre pause
                        if debutsortie!=None and finsortie!=None:
                        
                           if debutsortie<=datetime.now().time()<=finsortie  :
                              sortie=1
                              sortiepause=2
                           else:
                              
                              sortiepause=2#entré pause

                        else:   
                           
                           sortie=1#pas de fin sortie et entrée donc pas de pause

            else:
               if pp.get('etat')==0:#entrée
               
                        sortie=1
                        sortiepause=2
             
               else:   
                     sortie=2
                  
     
            lista.append({"sortie":sortie,"sortiepause":sortiepause,"pauses":pauselist,"nbfoisrestant":nbfoisrestant,"pausedejeuner":pausedejeuner})
            print("sortie" , sortie,"sortiepause" , sortiepause,"pauses " , pauselist,"nbfoisrestant" , nbfoisrestant,"pausedejeuner" ,pausedejeuner)
         else:
            lista.append({"sortie":2,"sortiepause":sortiepause,"pauses":pauselist,"nbfoisrestant":nbfoisrestant,"pausedejeuner":pausedejeuner})
            print("sortie" , sortie,"sortiepause" , sortiepause,"pauses " , pauselist,"nbfoisrestant" , nbfoisrestant,"pausedejeuner" ,pausedejeuner)
         return JsonResponse(lista, safe=False)
     
class pauseaujourdhui(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        idemploye = self.kwargs['pk']
        dateaujourdhui = datetime.now().date()

        # pointage avec ordre croissant
        plist = list(pointage.objects.filter(employes=idemploye,date_pointage__date=dateaujourdhui).order_by('date_pointage__hour','date_pointage__minute','date_pointage__second').values())

        # initialize variables
        lista = []
        pau = []            
        quota = 0
        nbfoisrestante=0
        # get the list of planning ids for the employee
        queryplanning = NewUser.objects.filter(id=idemploye).prefetch_related('planningemp')
        if queryplanning.exists():
            listaidplanings = list(queryplanning[0].planningemp.values('id'))

            # get the employee's planning for today
            testplaning = SearchPlaning(str(dateaujourdhui), listaidplanings)

            if testplaning != False:
                # return the employee's schedule for today
                parameters = searchDay(str(dateaujourdhui), idemploye, testplaning)
                horaire=parameters[12]
                finsortie=parameters[2]

                debutsortie=parameters[5]

                # get the list of pauses for the employee's schedule
                pau = list(Pauses.objects.filter(idhoraire=horaire, planifie=True).values())

                for p in pau:
                    # calculate the number of remaining times the employee can take this pause
                    tempspause = 0
                    pointagepauses = list(pointage.objects.filter(employes=idemploye,idpause=p.get('id'),date_pointage__date=dateaujourdhui).values())
                    
                    hm = pointage.objects.filter(employes=idemploye,idpause=p.get('id'),date_pointage__date=dateaujourdhui,etat=0).count()
                    nbfois = p.get('nbfois')
                    nbfoisrestante = nbfois - hm
                    quota = p.get('quota')
                    nompause = p.get('nom')

                    if pointagepauses:
                        # calculate the time remaining for this pause
                        tempspause = calcul_temps_sortie_entree(pointagepauses)
                        print(tempspause , "****************")
                    

                    lista.append({
                        "pause": nompause,
                        "nombre de fois": nbfois,
                        "quota ": quota,
                        "nombre de minutes restantes ": tempspause,
                        "nombre de fois restantes": nbfoisrestante
                    })
            else:
                lista.append({
                    "pause": 0,
                    "nombre de fois": 0,
                    "quota ": 0,
                    "nombre de minutes restantes ": 0,
                    "nombre de fois restantes": nbfoisrestante
                })
        else:
            lista.append({
                "pause": 0,
                "nombre de fois": 0,
                "quota ": 0,
                "nombre de minutes restantes ": 0,
                "nombre de fois restantes": nbfoisrestante
            })

        return JsonResponse(lista, safe=False)   
      
class LastPointageTodayView(APIView):
    def get(self, request, pk):
      
        idemploye=self.kwargs['pk']

        today=datetime.now().date()
        last_pointage_query = pointage.objects.filter(date_pointage__date=today , employes=idemploye)
        last_pointage = last_pointage_query.aggregate(Max('date_pointage'))

        if last_pointage['date_pointage__max']:
          last_pointage_obj = pointage.objects.get(date_pointage=last_pointage['date_pointage__max'])
          last_pointage_time = datetime.strptime(str(last_pointage_obj.date_pointage), '%Y-%m-%d %H:%M:%S.%f').strftime('%H:%M:%S')
          response_data = {'last_pointage': last_pointage_time}
          return JsonResponse(response_data)
        else:
           return JsonResponse({})  
       
         
class Ticketrestau(APIView):
  permission_classes = [AllowAny]
  def get(self,request,pk):
   
    legendesemaine=[]
    idemploye=self.kwargs['pk']
    jsondata=[]
    ticketrestau=0
   #  today = datetime.now()
    start = datetime.today().replace(day=1)
    end = datetime.today()
    for single_date in daterange(start.date(), end.date()):
     date = str(single_date)
     a = Rapportunjour(int(idemploye), date)  # appel au fonction rapport un jour
     pointages = ""
     day = findDay(date)  # found the day
     if a:
        travailchart = int(float(a[0]["heuretravail"]) // 60)  # convert minutes to hours => Chart bar
        pointages = a[0]['pointages']
        motif = a[0]["motif"]
        tra = float(a[0]["heuretravail"])

        if tra == 0.0:
            heurestravail = '00:00'
        else:
            if tra < 0:
                # Handle negative time value
                print("Negative time value for date:", date)
                continue  # Skip further processing for this date

            heurestravail = minutes_hours(tra)  # convert minutes to hours:minutes

            try:
                # Check if heurestravail is in a valid format
                datetime.strptime(heurestravail, '%H:%M')
            except ValueError:
                print("Invalid time format for date:", date)
                continue  # Skip further processing for this date

            print(heurestravail)
            if datetime.strptime(heurestravail, '%H:%M') >= datetime.strptime('07:00', '%H:%M'):
                ticketrestau += 1

    legendesemaine.append({"heuretravail": ticketrestau})

    return JsonResponse(legendesemaine,safe=False)  

class Accueil(APIView):
  permission_classes = [AllowAny]
  def get(self,request,pk):
    legendesemaine=[]
    idemploye=self.kwargs['pk']
    jsondata=[]
    debut=''
    fin=''
   #  end=datetime.now()-datetime.timedelta(days=1)
   #  start=end-datetime.timedelta(days=7)
    today = datetime.now()
    start = datetime.now() - timedelta(days=today.weekday())
    end = start + timedelta(days=6)

    for single_date in daterange(start.date(), end.date()):
        queryplanning = NewUser.objects.filter(id=idemploye).prefetch_related('planningemp')
        if queryplanning.exists():
            listaidplanings = list(queryplanning[0].planningemp.values('id'))

            # get the employee's planning for today
            testplaning = SearchPlaning(str(single_date), listaidplanings)
            if testplaning != False:
                # return the employee's schedule for today
                parameters = searchDay(str(single_date), idemploye, testplaning)
                debut=parameters[6]
                fin=parameters[7]
        date=str(single_date)
        a=Rapportunjour(int(idemploye),date)#appel au fonction rapport un jour
        
        pointages=""
        day=findDay(date)#found the day
        if a:
           travailchart=int(float(a[0]["heuretravail"])// 60)#convert minutes to hours =>Chart bar
           pointages=a[0]['pointages']
           motif=a[0]["motif"]
           tra=float(a[0]["heuretravail"])
           
           if tra==0.0:
              heurestravail=0
           else:
              heurestravail=minutes_hours(float(a[0]["heuretravail"]))#convert minutes to hours:minutes
            
           pointagemanquant=0
           conge=0
           present=0
           absent=0
           absencejustifie=0
           absencenonjustifie=0
           authorisation=0
           mission=0 
           ferie=0
           repos=0 
           teletravail=0  
           demijour=0 
           if motif=="" or motif=="Pointage impair":#if pointage impair
              present=1

      
           elif motif =="Congé":
              conge=1

           elif motif=="Absent" :
              absent=1

           elif motif=="Absence justifié":
              absencejustifie=1

           elif motif=="Absence non justifié":

              absencenonjustifie=1

           elif motif=="Autorisation":
   
              authorisation=1  

           elif motif=="Mission":

              mission=1 

           elif motif=="Jour Ferié":

              ferie=1

           elif motif=="Repos":
 
              repos=1 
           elif motif=="Abs demi-journée":
              demijour=1      
           elif motif=="Téletravail":
              teletravail=1
           elif motif=="Pointage manquant":
              pointagemanquant=1
           legendesemaine.append({'pointagemanquant':pointagemanquant,'travailchart':travailchart,"pointages":pointages,"heuretravail":heurestravail,"absencejustifie":absencejustifie,"absencenonjustifie":absencenonjustifie,"absent":absent,"present":present,"conge":conge,"ferie":ferie,"mission":mission,"authorisation":authorisation,"date":date,"day":day,"idemploye":str(idemploye),"repos":repos,"demijour":demijour,"teletravail":teletravail , "debut": debut , "fin": fin})  
    
    
    return JsonResponse(legendesemaine,safe=False)  