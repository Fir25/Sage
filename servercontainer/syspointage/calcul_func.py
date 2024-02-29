from datetime import datetime , timedelta
from . models import  *
from dateutil.relativedelta import relativedelta
from dateutil import rrule
from django.http import HttpResponse,JsonResponse
import locale


def searchDay(day,idemp,idplaning):
      
    zero=datetime.strptime(str("00:00:00"),'%H:%M:%S').time()
    a=planning.objects.select_related('plantravail').filter(id=idplaning).order_by('-created_at').first()
    nomplanning=a.title
    c = plansemaine.objects.filter(id=a.plantravail_id).values().all()
    dayy=datetime.strptime(day,"%Y-%m-%d").weekday()
    if(dayy==0):
      lu=horairejour.objects.filter(id=c[0].get('lundi_id')).all()
      lu_pauses = Pauses.objects.filter(idhoraire=c[0].get('lundi_id'), pausedejeuner=True).all()
     
      if lu :#si il'ya un horaire dans le tabelau plan semaine
         return [lu[0],lu[0].finentree,lu[0].finsortie,lu,lu[0].debutentree,lu[0].debutsortie,lu[0].debut,lu[0].fin,lu[0].margedepartant,lu[0].margeretard,c,nomplanning,c[0].get('lundi_id') , lu_pauses[0].dpause if lu_pauses else None , lu_pauses[0].fpause if lu_pauses else None  , lu_pauses[0].quota if lu_pauses else None]
      else: 
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]
    elif(dayy==1):    
      ma=horairejour.objects.filter(id=c[0].get('mardi_id')).all() 
      ma_pauses = Pauses.objects.filter(idhoraire=c[0].get('mardi_id'), pausedejeuner=True).all()
     
      if ma:   
         return [ma[0],ma[0].finentree,ma[0].finsortie,ma,ma[0].debutentree,ma[0].debutsortie,ma[0].debut,ma[0].fin,ma[0].margedepartant,ma[0].margeretard,c,nomplanning,c[0].get('mardi_id')  , ma_pauses[0].dpause if ma_pauses else None , ma_pauses[0].fpause if ma_pauses else None  , ma_pauses[0].quota if ma_pauses else None]
      else:
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]
    elif(dayy==2):
      me=horairejour.objects.filter(id=c[0].get('mercredi_id')).all()  
      me_pauses = Pauses.objects.filter(idhoraire=c[0].get('mercredi_id'), pausedejeuner=True).all()
      if me:
         return [me[0],me[0].finentree,me[0].finsortie,me,me[0].debutentree,me[0].debutsortie,me[0].debut,me[0].fin,me[0].margedepartant,me[0].margeretard,c,nomplanning,c[0].get('mercredi_id'), me_pauses[0].dpause if me_pauses else None , me_pauses[0].fpause if me_pauses else None , me_pauses[0].quota if me_pauses else None]
      else:
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]
    elif(dayy==3):
      je=horairejour.objects.filter(id=c[0].get('jeudi_id')).all()
      je_pauses = Pauses.objects.filter(idhoraire=c[0].get('jeudi_id'), pausedejeuner=True).all()
      if je:
         return [je[0],je[0].finentree,je[0].finsortie,je,je[0].debutentree,je[0].debutsortie,je[0].debut,je[0].fin,je[0].margedepartant,je[0].margeretard,c,nomplanning,c[0].get('jeudi_id') , je_pauses[0].dpause if je_pauses else None , je_pauses[0].fpause if je_pauses else None  , je_pauses[0].quota if je_pauses else None ]
      else:
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]
    elif(dayy==4):
      ve=horairejour.objects.filter(id=c[0].get('vendredi_id')).all()
      ve_pauses = Pauses.objects.filter(idhoraire=c[0].get('vendredi_id'), pausedejeuner=True).all()
      if ve:       
         return [ve[0],ve[0].finentree,ve[0].finsortie,ve,ve[0].debutentree,ve[0].debutsortie,ve[0].debut,ve[0].fin,ve[0].margedepartant,ve[0].margeretard,c,nomplanning,c[0].get('vendredi_id') , ve_pauses[0].dpause if ve_pauses else None, ve_pauses[0].fpause if  ve_pauses else None , ve_pauses[0].quota if ve_pauses else None ]
      else:   
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]
    elif(dayy==5):
      sa=horairejour.objects.filter(id=c[0].get('samedi_id')).all()
      sa_pauses = Pauses.objects.filter(idhoraire=c[0].get('samedi_id'), pausedejeuner=True).all()
      if sa:
         return [sa[0],sa[0].finentree,sa[0].finsortie,sa,sa[0].debutentree,sa[0].debutsortie,sa[0].debut,sa[0].fin,sa[0].margedepartant,sa[0].margeretard,c,nomplanning,c[0].get('samedi_id')  , sa_pauses[0].dpause if sa_pauses else None , sa_pauses[0].fpause if sa_pauses else None , sa_pauses[0].quota if sa_pauses else None ]
      else:    
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]
    elif(dayy==6):#il va calculer le rapport si et seulement si il a un horaire en dimanche
      di=horairejour.objects.filter(id=c[0].get('dimanche_id')).all() 
      di_pauses = Pauses.objects.filter(idhoraire=c[0].get('dimanche_id'), pausedejeuner=True).all()
      if di:
         return [di[0],di[0].finentree,di[0].finsortie,di,di[0].debutentree,di[0].debutsortie,di[0].debut,di[0].fin,di[0].margedepartant,di[0].margeretard,c,nomplanning,c[0].get('dimanche_id') , di_pauses[0].dpause if di_pauses else None, di_pauses[0].fpause if di_pauses else None ,di_pauses[0].quota if di_pauses else None ]
      else:
         return ["00:00:00",zero,zero,"00:00:00",zero,zero,zero,zero,"0","0",[],"",None , None , None , None]

def Day(finpause,debutpause,finsortie,norr,finentree,debutentree,debutsortie,debut,sortie,marge_anticipe,retard,entreepointage,sortiepointage,plansem,listepointages,ttzero,json_data,nomplannig,idemploye,pointages,pausee , dpausedej , fpausedej , quota ):
      #cette fonction va calculer les heures de travail...
      earlyEntree=0.0
      earlySortie=0.0
      lateEntree=0.0
      lateSortie=0.0
       
      heureTravailBrute=0.0
    
      heureTravailBrute=0.0
      jourtravaille=0
      retardmidi=0.0
      listerapport=[]
      defi=0.0

     
      if dpausedej is not None and fpausedej is not None:
         # Convert TimeField values to datetime.time objects
         dpause_time = datetime.strptime(str(dpausedej), '%H:%M:%S').time()
         fpause_time = datetime.strptime(str(fpausedej), '%H:%M:%S').time()

         time_difference = timedelta(hours=fpause_time.hour, minutes=fpause_time.minute) - timedelta(hours=dpause_time.hour, minutes=dpause_time.minute)

   




      presencenormale=minute_interval(ttzero,datetime.strptime(str(norr),'%H:%M:%S').time()) - quota #présence normale en minutes
    
      heureeffective=timedelta(hours=0)
      hi=0
      hi_brute=0

      
      if(entreepointage<debutentree):#si  1er pointages est inférieur au début entré donc l'employé démarre son travail avant le'heure de début
         early=minute_interval(datetime.strptime(str(entreepointage),'%H:%M:%S').time(),datetime.strptime(str(debutentree),'%H:%M:%S').time())
         
         earlyEntree=str(early)

      if(entreepointage>debut):#si le 1er pointage est supérieur au début alors employé a fait un retard
         late=minute_interval(datetime.strptime(str(debut),'%H:%M:%S').time(),datetime.strptime(str(entreepointage),'%H:%M:%S').time())
         lateEntree=str(late)
      if(sortiepointage<debutsortie):#si sortie est inférieur au début sortie donc l'employé a quitté son travail avant l'heure de sortie
         earlyS=minute_interval(datetime.strptime(str(sortiepointage),'%H:%M:%S').time(),datetime.strptime(str(debutsortie),'%H:%M:%S').time())
         earlySortie=str(earlyS)
         
      if(sortiepointage>finsortie):#si la derniére  pointage est supérieur à fin de sortie alors  l'employé sortit aprés fin
         lateS=minute_interval(datetime.strptime(str(finsortie),'%H:%M:%S').time(),datetime.strptime(str(sortiepointage),'%H:%M:%S').time())
         lateSortie=str(lateS)  
      if  entreepointage and dpausedej and sortiepointage and dpausedej :
       if(entreepointage<dpausedej and sortiepointage>dpausedej):
         jourtravaille=1

      for i in range (0,len(listepointages)-1,2):#pas =2
      

         entreepoint=listepointages[i]
         sortiepoint=listepointages[i+1]
         
         
         diffsortieentreebrute=abs(datetime.combine(date.min, sortiepoint)-datetime.combine(date.min, entreepoint))#calcule différence entre deux pointages
      
         hi_brute=hi_brute+minute_interval(ttzero, datetime.strptime(str(diffsortieentreebrute),"%H:%M:%S").time())#somme
      
      heureTravailBrute=hi_brute#travail brute :sortie-entrée 
      if plansem:
         if plansem[0].get('motifplan')=='administratif':#si plan semaine est administratif 
         
            if sortiepointage>finsortie:#si dernier pointage est superieur à sortie alors sortiepointage=fin sortie
               sortiepoint=finsortie
               listepointages[-1]=finsortie
            if entreepointage<debutentree:#si 1er pointage est inférieur à début entrée alors entrée pointage=début entrée
               entreepoint=debutentree
               listepointages[0]=debutentree#1er pointage=début entrée
            
      for i in range (0,len(listepointages)-1,2):#pas =2
         #travailpause=datetime.timedelta(hours=0)

         entreepoint=listepointages[i]
         sortiepoint=listepointages[i+1]
         #cas projet de  tunisie leasing (pause =50 minutes par exemple ,debut pause,fin pause)
         if retardmidi==0.0 and i-1>=0:
            if debutpause<=entreepoint<=finpause and debutpause<=listepointages[i-1]<=finpause:#si  pointage(finpause) entre début pause/ fin pause ,et le pointage i-1(debutpause) entre debut pause et fin pause 
               pausepointage=minute_interval(listepointages[i-1], datetime.strptime(str(entreepoint),"%H:%M:%S").time())#calcul la pause 
               if pausepointage>pausee:#si la pause est supérieur au pause fixé (50min)=>alors employé a fait un retard
                  retardmidi=pausepointage-pausee
               
         diffsortieentree=abs(datetime.combine(date.min, sortiepoint)-datetime.combine(date.min, entreepoint))
         hi=hi+minute_interval(ttzero, datetime.strptime(str(diffsortieentree),"%H:%M:%S").time())#somme de différence de pointage 
                       
   
                         
      if len(listepointages)==2 and hi > quota*2 :
           
            heureeffective=hi-quota
      else : 

         heureeffective=hi

      
      pause=pausee


      
      if presencenormale>heureeffective:#calucul déficit
         defi=presencenormale-heureeffective
       
         
      
      listerapport.append({"motif":"","Entree":entreepointage,"Sortie":sortiepointage,"earlyEntree":earlyEntree,"lateEntree":lateEntree,"earlySortie":earlySortie,"lateSortie":lateSortie,"user_name":json_data[0]['user_name'],"matricule":json_data[0]['matricule'],"date_pointage":json_data[0]['date_pointage'],"planing":nomplannig,"heuretravail":str(heureeffective),"pause":pause,"presencenormal":presencenormale,"jourtravaille":jourtravaille,"iduser":json_data[0]['iduser'],"entreepointage":json_data[0]['heure'],"sortiepointage":json_data[-1]['heure'],"heureauthorisation":"0","deficit":defi,"iduser":idemploye,"pointages":pointages,"tempabsence":"0.0","jourconge":"0","tempsMission":"0.0","tempsconge":"0.0","last_name":json_data[0]['last_name'],"heuretravailbrute":str(heureTravailBrute),"retardmidi":str(retardmidi)})
      return listerapport



  
def AbsenceMission(listconges,d1,idemploye,testplaning,ttzero,finpause,debutpause,finsortiee,nor,finentre,pausee):
    lista=[]
    timec=0.0
    pause=0.0

    
    datefin=listconges[0].get('datefin')      
    datedebut=listconges[0].get('datedebut')  
    heurefin=listconges[0].get("heure_fin")  
    heuredebut=listconges[0].get("heure_debut") 
    justifie=listconges[0].get("justifie")
    #parcourir les dates entre date début et date fin 
    for single_date in daterange(datedebut,datefin):               
        lista.append(str(single_date))
    
    pause=pausee
    #convertir en minutes     
    minheuredebut=minute_interval(ttzero,datetime.strptime(str(heuredebut),'%H:%M:%S').time())
    minuheurefin=minute_interval(ttzero,datetime.strptime(str(heurefin),'%H:%M:%S').time())
    minfinpause=minute_interval(ttzero,datetime.strptime(str(finpause),'%H:%M:%S').time())
    mindebutpause=minute_interval(ttzero,datetime.strptime(str(debutpause),'%H:%M:%S').time())
    minfinsortie=minute_interval(ttzero,datetime.strptime(str(finsortiee),'%H:%M:%S').time())
    minfinentre=minute_interval(ttzero,datetime.strptime(str(finentre),'%H:%M:%S').time())
    if   d1 in str(datedebut) and   d1 in str(datefin):#si date= datedebut=date fin
         if minheuredebut<=mindebutpause: #si heure debut inférieur à debut pause
            if minuheurefin<=mindebutpause:#si heure fin inférieur à debut pause
               timec=minuheurefin-minheuredebut#heure fin -heure debut
               return [timec,justifie]
            if minuheurefin>=minfinpause:
               timec=minuheurefin-minheuredebut-pause
               return [timec,justifie]
            if mindebutpause<=minuheurefin<=minfinpause:
               timec=mindebutpause-minheuredebut
               return [timec,justifie]
         elif minheuredebut>=minfinpause: 
               timec=minuheurefin-minheuredebut
               return [timec,justifie] 
         elif mindebutpause<=minheuredebut<=minfinpause: 
            if minuheurefin>=minfinpause:           
               timec=abs(minuheurefin-minfinpause)
               return [timec,justifie]
            else:
               return [timec,justifie]            
         else:
            return [timec,justifie]
    if d1 in str(datedebut):
         
         if minheuredebut<=mindebutpause:
            timec=abs(minfinsortie-minheuredebut)-pause
            
            return [timec,justifie]
         elif minheuredebut>=minfinpause:
            timec=abs(minfinsortie-minheuredebut)

            return [timec,justifie] 
         if   mindebutpause<=minheuredebut<=minfinpause:            
            timec=minfinsortie-minfinpause

            return [timec,justifie]
         else:

            return [timec,justifie]

            
    elif d1 in str(datefin): 
         if minuheurefin<=mindebutpause:
            timec=abs(minuheurefin-minfinentre)
            return [timec,justifie]
         elif minuheurefin>=minfinpause:
            timec=abs(minuheurefin-minfinentre)-pause
            return [timec,justifie] 
         if   mindebutpause<=minuheurefin<=minfinpause:            
            timec=abs(minfinentre-mindebutpause)
            return [timec,justifie]
         else:
            return [timec,justifie]
      
    else:  
         for  a in lista :     
               if d1==a  : 

                  timec=minute_interval(ttzero,datetime.strptime(str(nor),'%H:%M:%S').time())
                  return [timec,justifie]

def findDay(date):#date=>found the day (lundi,mardi,mercredi...)
    locale.setlocale(locale.LC_TIME, '')
    day, month, year = (int(i) for i in date.split('-'))   
    born = datetime(day, month, year)
    return born.strftime("%A")

def compare(a, b):
    return (a > b) - (a < b)

def minute_interval(start, end):
     delta=0.0
     if start > end:

        delta = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0

     return delta

def minute_interval(start, end):#calculer les minutes entre deux horaires 
     reverse = False
     if start > end:
          start, end = end, start
          reverse = True

     delta = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0
     if reverse:
          delta = 24*60 - delta
     return delta     

def daterangeAns(start_date, end_date):
    end=end_date#to get the last date (date2)

    for n in range(int ((end.year - start_date.year))):
        

        a=start_date + relativedelta(years=+n) 
        yield a

#test
def daterangemonths(start_date, end_date):
    for dt in rrule.rrule(rrule.MONTHLY, dtstart=start_date, until=end_date):
    
      yield dt.date() 
      


def daterange(start_date, end_date):
    end=end_date+timedelta(days=1)#to get the last date (date2)
  
    for n in range(int ((end - start_date).days)):
        yield start_date + timedelta(n)  
def SearchPlaning(d1, json_data):
    latest_planning = None
    latest_date = None

    for data in json_data:
        planning_id = data['id']
        dates = planning.objects.filter(id=planning_id).values('start', 'end', 'created_at').first()

        start_date = dates.get('start')
        end_date = dates.get('end')
        created_date = dates.get('created_at')

        if start_date <= datetime.strptime(d1, '%Y-%m-%d').date() <= end_date:
            if latest_date is None or created_date > latest_date:
                latest_date = created_date
                latest_planning = planning_id

    return latest_planning if latest_planning else False
      
def minutes_hours(minutes):
   hours=minutes // 60
   minutes= minutes % 60
   x="%02i:%02i" % (int(hours), int(minutes))
   return x 

def startEndDate(year, calendar_week):       
    monday = datetime.strptime(f'{year}-{calendar_week}-1', "%Y-%W-%w").date()
    return [monday, monday + timedelta(days=6.9)]
def calcul_temps_sortie_entree(pointages):
    entrees = {}
    sorties = []
    temps_entre_sorties = []
    
    # Organiser les pointages en entrées et sorties
    for pointage in pointages:
        if pointage['etat'] == 0:
            entrees[pointage['date_pointage']] = pointage['date_pointage'].time()
        else:
            sorties.append(pointage)
    
    # Calculer le temps entre chaque sortie et l'entrée correspondante
    for sortie in sorties:
        entree = None
        temps_sortie_entree = None
        for date, heure in sorted(entrees.items(), reverse=True):
            if datetime.combine(date, heure) < sortie['date_pointage']:
                entree = (date, heure)
                temps_sortie_entree = (sortie['date_pointage'] - datetime.combine(date, heure)).total_seconds()
                break
        if entree:
            temps_entre_sorties.append(temps_sortie_entree)
    
    # Calculer la somme des temps entre chaque sortie et l'entrée correspondante
    somme_temps = timedelta(seconds=sum(temps_entre_sorties))
    
    # Retourner la somme des temps sous forme de chaîne de caractères au format "hh:mm:ss"
    total_seconds = somme_temps.total_seconds()
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    return "{:02d}:{:02d}:{:02d}".format(hours, minutes, seconds)


def get_utc_offset(request,id):

    today = datetime.now().date()
    has_pointage_today = pointage.objects.filter(employes_id=id , date_pointage__date=today).exists()

    if has_pointage_today:
        # Get the last pointage for today
        last_pointage = pointage.objects.filter(employes_id=id , date_pointage__date=today).latest('date_pointage')
        # Access the attributes of the last pointage
        last_pointage_date = last_pointage.date_pointage
        # Calculate the time difference in hours
        current_time = datetime.now()
        time_difference = current_time - last_pointage_date
      
        hours, remainder = divmod(time_difference.total_seconds(), 3600)
        minutes, seconds = divmod(remainder, 60)
        time_difference_str = f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}"
        data = {
           
            'last_pointage_date': last_pointage_date,
           
            'hours_difference': time_difference_str
        }
    else:
        data = {
          
            'last_pointage_date': None,  # No pointage today
            'hours_difference': None
        }

    return JsonResponse(data)