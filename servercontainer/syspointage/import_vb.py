from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from . calcul_func import *
from datetime import datetime
from django.http import HttpResponse,JsonResponse

class Rapportpaie(APIView):
    #permission_classes = [AllowAny]
    def get(self, request,**kwargs):      
        listids=request.query_params.getlist('id')[0].split(',')
        jsondata=[]
        d1 = kwargs['date1']
        d2 = kwargs['date2']         
        for  i in listids:
                conge=0.0
                heuretheorique=0.0
                joursferie=0
                congenonp=0.0
                heuretravaille=0.0
                heuretravail=0.0
                heureabs=0.0
                presencenrml=0.0
                ticketrestau=0
                heuretravai=0.0
                day=0
                heureeffective=0
                heuresup=0
                heuresup25=0
                heuresup50=0
                heureferie=0
                jourtravail=0
                for single_date in daterange(datetime.strptime(d1,"%Y-%m-%d").date(), datetime.strptime(d2,"%Y-%m-%d").date()):       
                    a=Rapportunjour(int(i),str(single_date)) 
                    print(single_date.weekday())   
                    
                    if a:
                        tra=float(a[0]["heuretravail"])
                        heuresup+=tra
                        if int(single_date.weekday()) == 6 :
                           if heuresup> 2880 :
                              d=heuresup-2880
                              heuresup50+=d
                              heuresup25+=480
                            
                           elif heuresup>2400 :
                             d=heuresup-2400 
                             heuresup25 += d                            
                           heuresup=0     
                                               
                        tra=float(a[0]["heuretravail"])
                        heuretheorique+=float(a[0]['presencenormal'])  
                        heuretravaille +=float(a[0]['heuretravailbrute'])
                        heuretravai+=float(a[0]["heuretravail"]) if float(a[0]["heuretravail"]) <480 else 480

                        conge+=float(a[0]['tempsconge'])
                        heureabs+=float(a[0]["deficit"])
                        presencenrml+=float(a[0]['presencenormal'])
                       
                        day+=8
                        if  int(single_date.weekday()) != 5 and int(single_date.weekday()) != 6: 
                           if a[0]["motif"]=="Jour Ferié" :
                              joursferie+=1
                              heureferie+=float(a[0]['presencenormal'])
                             
                           jourtravail+=1   
                        if tra==0.0: 
                              heurestravail='00:00'
                        else:
                              heurestravail=minutes_hours(float(a[0]["heuretravail"]))#convert minutes to hours:minutes
                              print(heurestravail)
                              if datetime.strptime(heurestravail, '%H:%M')  >= datetime.strptime('07:00', '%H:%M'):
                                  ticketrestau+=1
                       
                jsondata.append({ "user_name": i,"heuretheorique": minutes_hours(jourtravail*480 - (joursferie*480)) ,"plannifagent": minutes_hours(heuretheorique - heureferie  ) , "heuretravaille": minutes_hours( heuretravaille ), "conge":minutes_hours(conge), "ht" : minutes_hours(heuretravai) ,"heureabs": minutes_hours(heureabs ), "presence": presencenrml , "motif":a[0]["motif"], "user_name": a[0]["user_name"], "matricule":a[0]["matricule"], 'heuretravail': minutes_hours(float(a[0]["heuretravail"])), 'pause': a[0]["pause"],'presencenormal': minutes_hours(float(a[0]['presencenormal']))  ,"jourtravaille":a[0]['jourtravaille'],"heureauthorisation": minutes_hours(float(a[0]['heureauthorisation'])),"deficit": minutes_hours(float(a[0]["deficit"])),"iduser":a[0]["iduser"],"tempabsence": minutes_hours(float(a[0]["tempabsence"])),"jourconge":a[0]["jourconge"],"tempsMission": minutes_hours(float(a[0]["tempsMission"])),"tempsconge": minutes_hours(float(a[0]['tempsconge'])),"last_name":a[0]['last_name'],"heuretravailbrute":minutes_hours(float(a[0]['heuretravailbrute'])),"retardmidi":minutes_hours(float(a[0]['retardmidi'])) , "restau" : ticketrestau , "jrfr" : joursferie , "plannif" : day , "heure25" : minutes_hours(heuresup25)  , "heuresup50" : minutes_hours(heuresup50) , "departement" : a[0]['departement'] , "typepaie" : a[0]['typepaie']})          
              
              
        return JsonResponse(jsondata, safe=False)