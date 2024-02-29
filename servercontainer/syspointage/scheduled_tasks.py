from schedule import Scheduler
import threading    
from django.http import HttpResponse,JsonResponse
from . rapport_journalier import Rapportunjour
from rest_framework.views import APIView
from . calcul_func import *
from datetime import datetime
from django.http import HttpResponse,JsonResponse
import calendar
from . send_mail import send_email_template
from pointage import settings
from django.db import connection
from . models import *
import time 
from django.views.decorators.csrf import csrf_exempt
from django.template import loader
from . rapport_mensuel import rapportmensul
#scheduler
def run_continuously(self, interval=1):


    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run

Scheduler.run_continuously = run_continuously
def SendAuxchefs():
   listEmployes=[]
   a=arborescence.objects.values().all()
   details=''
   json_data = []
   
   for b in a:#parccourir la liste d'arboresence

      idarboresence=b.get('id')
   
      #query pour parccourir la liste children of departement
      query = 'WITH children  AS  (SELECT syspointage_arborescence.id FROM syspointage_arborescence WHERE id=%s UNION ALL SELECT syspointage_arborescence.id FROM children, syspointage_arborescence WHERE syspointage_arborescence.parent_id = children.id) SELECT syspointage_arborescence.id FROM syspointage_arborescence, children WHERE children.id = syspointage_arborescence.id'%idarboresence

      cursor = connection.cursor()
      cursor.execute(query)
      data = cursor.fetchall()
      emailchef=''
      emailrh=''
      for obj in data:
         #slects ids employés in this departeùe
         quer="SELECT u.user_name,u.id,a.chef_id,a.rh_id,u.email,u.matricule from  syspointage_newuser as u   left join syspointage_newuser_arborescence as ua on ua.newuser_id=u.id left join syspointage_arborescence as a on  ua.arborescence_id=a.id	where ua.arborescence_id='%s'"%(str(int(''.join(map(str, obj)))))
         #is_active=1 c'a dire emlpoyés non partis ont un compte active
         cc=connection.cursor()
         cc.execute(quer)
         employes=cc.fetchall()
         
         lista=[]
         lisanomalies=[]
         for objj in employes:
             if objj[2]:
               emailchef=str(NewUser.objects.filter(id=objj[2]).values()[0].get('email'))
             if objj[3]: 
               emailrh=str(NewUser.objects.filter(id=objj[3]).values()[0].get('email'))
             json_data.append({"user_name":objj[0],"iduser":objj[1],"chef_id":objj[2],"rh_id":objj[3],"emailemploye":objj[4],"emailchef":emailchef,"emailrh":emailrh,"matricule":objj[5]})
         for ele in json_data:
               rap=Rapportunjour(ele['iduser'],str((datetime.now()-timedelta(days=1)).date()))
               
               if rap:
                  if rap[0]['motif']=="Pointage impair":
                     lisanomalies.append({
                                    'user_name': str(rap[0]['user_name']),
                                    'last_name':str(rap[0]['last_name']),
                                    'matricule':  str(rap[0]['matricule']),
                                    'date':str(rap[0]['date_pointage']),
                                    'pointages':str(rap[0]['pointages'])                        
                     })
                  if str(rap[0]['earlySortie'])!="0.0" and str(rap[0]['lateEntree'])!="0.0":
                     lista.append(                                    {
                                    'user_name': str(rap[0]['user_name']),
                                    'last_name':str(rap[0]['last_name']),
                                    'matricule':  str(rap[0]['matricule']),
                                    'lateEntree':str(minutes_hours((float(rap[0]['lateEntree'])))),
                                    'earlySortie':str(minutes_hours((float(rap[0]['earlySortie']))))
                        

                                    
                                 })

                  #details+='<table><tr><th>Employé</th><th></th> :'+str(ele['user_name'])+'  '+'de matciule :' +str(ele['matricule'])+"a un retard d'entrée"+str(rap[0]['lateEntree'])+" et sortie avent l'heure :"+rap[0]['earlySortie']+",le  "+str(datetime.now().date()) +"/n "
                  #details+="<table><tr><th>Employé</th><th>Matricule</th> <th>Retard d entrée</th><th>Temps avant sortie</th></tr> <tr><td>"+str(ele['user_name'])+" </td><td>" +str(ele['matricule'])+"</td><td>"+str(rap[0]['lateEntree'])+"</td><td>"+rap[0]['earlySortie']+"</td> </tr></table> "
               #details.append({"user_name":ele[0],"matricule":ele[7],"lateEntree",rap[0]['lateEntree'],"earlySortie":rap[0]['earlySortie']})
         #send mail

         context={'result':lista,'anomalie':lisanomalies}
         html_message  = loader.render_to_string(
                     'Mail.html',
                     context

         )

      if context['result']!=[]:
         send_email_template(
            'suivi de l’assiduité et la ponctualité',
            'TLF',
            
            settings.EMAIL_HOST_USER,
            [json_data[0]['emailchef']],
            fail_silently=False,
            html_message=html_message

         )
      json_data=[]
         



   return HttpResponse(status=200)


#scheduler = Scheduler()
#scheduler.every().day.at("16:17").do(SendAuxchefs)
#scheduler.run_continuously()
#function in tlf project to import csv file 

@csrf_exempt
def sendMailRappelsContrats():
   
   lsta=[]
   rr1=DetailsContratsEmployes.objects.filter(rappel1=datetime.now().date().strftime('%Y-%m-%d'))
   rr2=DetailsContratsEmployes.objects.filter(rappel2=datetime.now().date().strftime('%Y-%m-%d'))
   
   attr=[]
   ids=list(rr1.values_list('employe'))+list(rr2.values_list('employe'))

   if rr1.exists() or rr2.exists():
       for idd in ids:
          idemp=int(''.join(map(str, idd)))
          xx=NewUser.objects.filter(id=idemp)
          
          nomprenom=list(xx.values('user_name','last_name').all())
          employe=['{} {}'.format(obj['user_name'],obj['last_name']) for obj in nomprenom]
          attr=attr+nomprenom
          queryarborescence=xx.prefetch_related('arborescence')
          print(queryarborescence)
          for test in queryarborescence:
               arb=test.arborescence.values('id')
               if arb:
                  listaidarborescence=arb[0].get('id')
                 
                  query="WITH parents AS (SELECT syspointage_arborescence.*, 0 AS relative_depth FROM syspointage_arborescence WHERE id =%s UNION ALL SELECT syspointage_arborescence.*, parents.relative_depth - 1 FROM syspointage_arborescence,parents WHERE syspointage_arborescence.id = parents.parent_id) SELECT  TOP 1  rh_id FROM parents where rh_id is not null    ORDER BY relative_depth DESC "%(listaidarborescence)
                 
                  cursor = connection.cursor()
                  cursor.execute(query)
                  data = cursor.fetchall()
         
                  if data:
                  
                     
                     send_email_template(
                     "Rappel de contrat",
                     "Bonjour , ceci est un rappel pour la fin de contrat! ",
                     settings.EMAIL_HOST_USER,
                     [NewUser.objects.filter(id=data[0][0]).values('email')[0].get('email')],
                     fail_silently=False,
                     html_message="<p style='line-height: 300%;'>Bonjour ,<br/> Ceci est un rappel pour la fin de contrat des employés "+str(' ,'.join(employe))+"! <br>IPS Time</p>"
                     ) 
                  queryrh2="WITH parents AS (SELECT syspointage_arborescence.*, 0 AS relative_depth FROM syspointage_arborescence WHERE id =%s UNION ALL SELECT syspointage_arborescence.*, parents.relative_depth - 1 FROM syspointage_arborescence,parents WHERE syspointage_arborescence.id = parents.parent_id) SELECT  TOP 1  rh2_id FROM parents where rh2_id is not null    ORDER BY relative_depth DESC "%(listaidarborescence)
                 
                  cursorrh2 = connection.cursor()
                  cursorrh2.execute(queryrh2)
                  datarh2 = cursorrh2.fetchall()
         
                  if datarh2:

                     send_email_template(
                     "Rappel de contrat",
                     "Bonjour , ceci est un rappel pour la fin de contrat! ",
                     settings.EMAIL_HOST_USER,
                     [NewUser.objects.filter(id=datarh2[0][0]).values('email')[0].get('email')],
                     fail_silently=False,
                     html_message="<p style='line-height: 300%;'>Bonjour ,<br/> Ceci est un rappel pour la fin de contrat des employés "+str(' ,'.join(employe))+"! <br>IPS Time</p>"
                     )      
                  

       drhsss=NewUser.objects.select_related('role').filter(role__DRH=True).values_list('email', flat=True)
                     
      
       uu=['{} {}'.format(obj['user_name'],obj['last_name']) for obj in attr]
     
       send_email_template(
       "Rappel de contrat",
       "Bonjour , ceci est un rappel pour la fin de contrat! ",
       settings.EMAIL_HOST_USER,
       list(drhsss),
       fail_silently=False,
       html_message="<p style='line-height: 300%;'>Bonjour ,<br/> Ceci est un rappel pour la fin de contrat des employés "+str(' ,'.join(uu))+"! <br>IPS Time</p>"
       ) 

   return HttpResponse(status=200)


#ss = Scheduler()
#ss.every().day.at("14:23").do(sendMailRappelsContrats)
#ss.run_continuously()


def EnvoyerRapportParMois():
   #if datetime.now().day=="1":
   listids=list(NewUser.objects.values_list('id'))
   listaids=[]
   locale.setlocale(locale.LC_TIME, '')
   mois=calendar.month_name[datetime.now().month]
   for idd in listids:
      listaids.append((int(''.join(map(str, idd)))))
   rap=rapportmensul(listaids,datetime.now().date(),datetime.now().date())
   for a in rap[0]['list']:
      context={'result':[a],"mois":mois}
      html_message  = loader.render_to_string(
                  'RapportParMois.html',
                  context

      )
      
      emailemploye=NewUser.objects.filter(id=a.get('iduser')).values()[0].get('email')
      print(emailemploye,a)
      if context['result']!=[]:
         send_email_template(
            'Rapport de mois',
            'Ms solutions',
            
            settings.EMAIL_HOST_USER,
            [emailemploye],
            fail_silently=False,
            html_message=html_message

         )
   return HttpResponse(status=200)
   #return HttpResponse(status=202)
#schmois = Scheduler()
#schmois.every().day.at("11:27").do(EnvoyerRapportParMois)
#schmois.run_continuously()

def AjoutSolde():
   if (datetime.now().day=="1"):
      today = datetime.today()
      first_day_of_current_month = today.replace(day=1)
      last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
      first_day_of_previous_month = last_day_of_previous_month.replace(day=1)
      userss=NewUser.objects.all()
      for a in userss:
         soldeaajoute=0.0
         jourtravail=0.0
         joursferie=0.0
         heuretheorique=0.0
         for single_date in daterange(datetime.strptime(first_day_of_previous_month,"%Y-%m-%d").date(), datetime.strptime(last_day_of_previous_month,"%Y-%m-%d").date()):       
                    rap=Rapportunjour(int(a.id),str(single_date)) 
                    print(single_date.weekday())   
                    
                    if rap:
                        tra=float(rap[0]["heuretravail"])
                       
                                               
                      
                        heuretheorique+=float(a[0]['presencenormal'])  
                        # heuretravaille +=float(a[0]['heuretravailbrute'])
                        # heuretravai+=float(a[0]["heuretravail"]) if float(a[0]["heuretravail"]) <480 else 480

                        # conge+=float(a[0]['tempsconge'])
                      
                        # presencenrml+=float(a[0]['presencenormal'])
                       
                     
                        if  int(single_date.weekday()) != 5 and int(single_date.weekday()) != 6: 
                           if a[0]["motif"]=="Jour Ferié" :
                              joursferie+=1
                            
                             
                           jourtravail+=1   
                        
                        # if tra==0.0: 
                        #       heurestravail='00:00'
                        # else:
                        #       heurestravail=minutes_hours(float(a[0]["heuretravail"]))#convert minutes to hours:minutes
                        #       print(heurestravail)
                        #       if datetime.strptime(heurestravail, '%H:%M')  >= datetime.strptime('07:00', '%H:%M'):
                        #           ticketrestau+=1
         
         
        
         soldeactuelle=NewUser.objects.filter(id=int(a.id)).values()[0].get('solde')
         typeesolde = NewUser.objects.filter(id=int(a.id)).values()[0].get('typepaie')
         if typeesolde :
           soldeaajoute=(jourtravail*1.5)/22
         else : 
           
             soldeaajoute=(((float(a[0]["heuretravail"])/60)+ float(a[0]["jourconge"]) + joursferie )*1,5) /  ( heuretheorique/60  )
         if soldeactuelle==None:
            soldeactuelle=0.0

         

         soldeupdate=float(soldeactuelle)+soldeaajoute

         NewUser.objects.filter(id=a.id).update(solde=float(soldeupdate))
      return HttpResponse(status=200)
   return HttpResponse(status=202)
schesolde = Scheduler()
schesolde.every().day.at("00:01").do(AjoutSolde)
schesolde.run_continuously()
