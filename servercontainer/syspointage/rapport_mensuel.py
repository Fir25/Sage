from . models import *
from django.db import connection
from django.core.cache import cache
from . calcul_func import *
from . rapport_journalier import *
import calendar

def rapportmensul(listids,date1,date2):
        jsondata=[]
        listmois=[]
        minuts=0.0
        ttzero=datetime.datetime.strptime("00:00:00","%H:%M:%S").time()
        presencenor=0.0
        totalheuretheorique=0.0
        totalheureeffective=0.0
        travailminutesindirect=0.0
        travailminutesdirect=0.0
        heuretravail_direct=0.0
        heuretravail_indirect=0.0
        defiTotale=0.0
        earlysoriteTotal=0.0
        retardminutestotale=0.0
        minutes_absence_deficit=0.0
        totalabsencedeficit=0.0
        htt=''
        hte=''
        htdirect=''
        htindirect=''
        tota_ab_defi=''
        rapportmensulle=[]
        for y in listids:
            
            jsondata=[]
            minuts=0.0
            presencenor=0.0
            heuretravail_user_direct=''
            heuretravail_user_indirect=''
            heureavantsortie=0.0
            retard=0.0
            defi=0.0
        
            arrondi_deficit_absence=0.0  
            deficitminutes_total=''
            EarlySortie_totale=''
            rata_total='' 
            travailminutesindirect=0.0 
            travailminutesdirect=0.0  
            minutes_absence_deficit=0.0
            amplitude=0.0
            for ss in daterangemonths (date1,date2):

                
                jsondata=[]
                minuts=0.0
                presencenor=0.0
                heureavantsortie=0.0
                defi=0.0
      
                dayss=calendar.monthrange(ss.year, ss.month)[1]
                travailminutesindirect=0.0
                retard=0.0
                travailminutesdirect=0.0
                heuretravail_direct=0.0 
                minutes_absence_deficit=0.0
                arrondi_deficit_absence=0.0  
                nombrejours=0
                absnonjust=0
                jourtravaille=0
                jourconge=0
                impair=0
                amplitude=0.0
                for single_date in daterange(ss,(datetime.datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=dayss-1)).date()):
                #for single_date in daterange(ss,(datetime.datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=nombrejours)).date()):
                     a=Rapportunjour(int(y),str(single_date))
                  
                     if a:
                        jsondata.append({"motif":a[0]["motif"],"Entree": a[0]["Entree"], "Sortie": a[0]["Sortie"], "earlyEntree":a[0]["earlyEntree"], "lateEntree":a[0]["lateEntree"], "earlySortie":a[0]["earlySortie"], "lateSortie":a[0]["lateSortie"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], "date_pointage": a[0]["date_pointage"], "planing":a[0]["planing"],'heuretravail': a[0]["heuretravail"], 'pause': a[0]["pause"],'presencenormal':a[0]['presencenormal'],"jourtravaille":a[0]['jourtravaille'],"entreepointage":a[0]['entreepointage'],"sortiepointage":a[0]['sortiepointage'],"heureauthorisation":a[0]['heureauthorisation'],"deficit":a[0]["deficit"],"iduser":a[0]["iduser"],"pointages":a[0]["pointages"],"tempabsence":a[0]["tempabsence"],"jourconge":a[0]["jourconge"],"tempsMission":a[0]["tempsMission"],"last_name":a[0]['last_name']})  
                     
                   
                     
                     
                for i in range (len(jsondata)):
                    minuts=minuts+float(jsondata[i]['heuretravail'])
                    jourtravaille=jourtravaille+int(jsondata[i]['jourtravaille'])
                    jourconge=jourconge+int(jsondata[i]['jourconge'])
                    presencenor=presencenor+float(jsondata[i]['presencenormal'])
                    retard=retard+float(jsondata[i]['lateEntree'])
                    defi=defi+float(jsondata[i]['deficit'])
                    heuretravail=str(minutes_hours(minuts))
                    Presence_normale=str(minutes_hours(presencenor))
                    heureavantsortie=heureavantsortie+float(jsondata[i]['earlySortie'])
                    r=str(minutes_hours(retard))
                    earlysortie=str(minutes_hours(heureavantsortie))
                    dd=str(minutes_hours(defi))
                    if jsondata[i]['motif']=="Pointage impair":
                       impair+=1
                    
                    if jsondata[i]['motif']=="Absent" or jsondata[i]['motif']=="Absence non justifié":
                       absnonjust+=1
                if jourtravaille!=0:
                    amplitude=minuts/jourtravaille   


                       

              
                
               
                if jsondata:
                   if defi>=240:#if deficit superieur à 4 heures alores converssion en nombre de jours d'absence
                      nb_jours_absence_deficit=defi/480#Le nombre de jours d’absence est calculé en divisant le déficit horaire du mois par 8 heure 
                      arrondi_deficit_absence=(int)(2*nb_jours_absence_deficit+0.5)/2.0#arrondissant à la demi-journée la plus proche. Exemple : 2,1jr est arrondi à 2jr ; 2,4jr est arrondi à 2,5jr.
                      
                   if NewUser.objects.values().filter(activite=False , id=jsondata[0]['iduser']):
                      travailminutesindirect=minuts
                      heuretravail_user_indirect=heuretravail
                      heuretravail_user_direct=str(minutes_hours(0))
                       
                   else:
                      travailminutesdirect=minuts
                      heuretravail_user_direct=heuretravail
                      heuretravail_user_indirect=str(minutes_hours(0))
                   listmois.append({"amplitude":amplitude,"impair":impair,"absnonjust":absnonjust,"jourconge":jourconge,"jourtravaille":jourtravaille,"heuretravailindirect":heuretravail_user_indirect,"heuredtravaildirect":heuretravail_user_direct,"user_name":jsondata[0]["user_name"],"matricule":jsondata[0]["matricule"],"presencereele":heuretravail,'presencenormal':Presence_normale,'debutmois':str(ss),'finmois':str((datetime.datetime.strptime(str(ss),"%Y-%m-%d")+timedelta(days=dayss-1)).date()),"retardEntree":r,"heureavantsortie":earlysortie,"deficit":dd,"prnormalminutes":str(presencenor),"totalheureeffective":str(minuts),"heuretravail_direct":str(travailminutesdirect),"heuretravail_indirect":str(travailminutesindirect),"deficitminutes_total":str(defi),"heureavantsortieminutes":str(heureavantsortie),"retardminutes":str(retard),"iduser":jsondata[0]["iduser"],"absence_defi":str(arrondi_deficit_absence),"last_name":jsondata[0]["last_name"]})
            
        for obj in listmois:
            
            totalheuretheorique=totalheuretheorique+float(obj['prnormalminutes'])#total des heures normales(theoriques)
            htt=str(minutes_hours(totalheuretheorique))
            totalheureeffective=totalheureeffective+float(obj['totalheureeffective'])#total des heures de travail (pratiques/effectives)
            hte=str(minutes_hours(totalheureeffective))
            heuretravail_direct=heuretravail_direct+float(obj['heuretravail_direct'])
            htdirect=str(minutes_hours(heuretravail_direct))          
            heuretravail_indirect=heuretravail_indirect+float(obj['heuretravail_indirect'])
            htindirect=str(minutes_hours(heuretravail_indirect))
            defiTotale=defiTotale+float(obj['deficitminutes_total'])
            deficitminutes_total=str(minutes_hours(defiTotale))
            earlysoriteTotal=earlysoriteTotal+float(obj['heureavantsortieminutes'])
            EarlySortie_totale=str(minutes_hours(earlysoriteTotal))
            retardminutestotale=retardminutestotale+float(obj['retardminutes'])
            rata_total=str(minutes_hours(retardminutestotale))


        rapportmensulle.append({"htheorique_total":htt,"heffective_total":hte,"htravail_direct":htdirect,"htravail_indirect":htindirect,"deficit_totale":deficitminutes_total,"earlysoriteTotal":EarlySortie_totale,"retardminutestotale":rata_total,"list":listmois})
        return rapportmensulle
