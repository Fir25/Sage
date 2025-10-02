from datetime import datetime, time, timedelta
from .models import *
from dateutil.relativedelta import relativedelta
from dateutil import rrule
from django.http import HttpResponse, JsonResponse
from django.db import connection
import locale


   

def to_time(val):
    """Convertit en datetime.time si string, sinon retourne tel quel"""
    if isinstance(val, str):
        try:
            return datetime.strptime(val, "%H:%M:%S").time()
        except ValueError:
            return None
    return val
def get_shift_for_entry(entreepointage,sortiepointage):
    try:
        # Conversion de l'entrée en objet time si nécessaire
     if isinstance(entreepointage, str):
            entreepointage = datetime.strptime(entreepointage, "%H:%M:%S").time()
            sortiepointage = datetime.strptime(sortiepointage, "%H:%M:%S").time()
     if (entreepointage and sortiepointage ):
        # Récupération du shift correspondant à l'heure de pointage
        shift = HoraireJour.objects.filter(
            debutentree__lte=entreepointage,
            finentree__gte=sortiepointage
        ).values('id', 'nom').first()
        
        if shift:
            return {
                "shift_id": shift['id'],
                "shift_nom": shift['nom']
            }
        else:
            return "Aucun shift trouvé pour l'heure de pointage donnée."
    
    except Exception as e:
        return {"error": str(e)}
def default_values():
    """
    Retourne les valeurs par défaut si aucun horaire n'est trouvé.
    """
    zero = datetime.strptime("00:00:00", '%H:%M:%S').time()
    return ["00:00:00", zero, zero, "00:00:00", zero, zero, zero, zero, "0", "0", None, None, None, None]
def searchDay(day, idemp, entreepointage, sortiepointage):
    try:
        # Obtenir l'indice du jour de la semaine (0 = Lundi, 5 = Samedi, 6 = Dimanche)
        dayy = datetime.strptime(day, "%Y-%m-%d").weekday()

        print('entreepointageentreepointageentreepointage',entreepointage)
        if entreepointage or sortiepointage :
            if entreepointage:
                with connection.cursor() as cursor:
                    # Requête filtrée par shifts autorisés et priorité selon le jour de la semaine
                    query = """
                    SELECT nom 
                    FROM syspointage_horairejour 
                    WHERE %s::time BETWEEN debutentree AND finentree 
                    AND nom IN ('SHIFT APM', 'SHIFT MATIN', 'SHIFT NUIT', 'ADM', 'ADM SAMEDI')
                    ORDER BY 
                        CASE 
                            WHEN nom = 'ADM SAMEDI' AND %s = 5 THEN 0
                            WHEN nom = 'ADM' AND %s != 5 THEN 1
                            ELSE 2
                        END
                    LIMIT 1;
                    """
                    cursor.execute(query, (entreepointage, dayy, dayy))
                    nome = cursor.fetchone()

            else:
                with connection.cursor() as cursor:
                    query = """
                        SELECT nom 
                                FROM syspointage_horairejour 
                                WHERE %s::time BETWEEN debutsortie AND finsortie + INTERVAL '2 HOUR'
                                AND nom IN ('SHIFT APM', 'SHIFT MATIN', 'SHIFT NUIT', 'ADM')
                                ORDER BY 
                                    CASE 
                                        WHEN nom = 'ADM SAMEDI' AND %s = 5 THEN 0
                                        WHEN nom = 'ADM' AND %s != 5 THEN 1
                                        ELSE 2
                                    END
                                LIMIT 1;

                    """  
                    cursor.execute(query, (sortiepointage, dayy, dayy))
                    nome = cursor.fetchone() 

            nome = nome[0]
            print('nome',nome)
                # Recherche via ORM
            horaire = horairejour.objects.filter(nom=nome).first()
            print('horaire',horaire)
            if not horaire:
                return default_values()

                # Recherche de la pause déjeuner si elle existe
            pauses = Pauses.objects.filter(idhoraire=horaire.id, pausedejeuner=True).first()
            dpause = pauses.dpause if pauses else None
            fpause = pauses.fpause if pauses else None
            quota = pauses.quota if pauses else None

            return [
                    horaire, horaire.finentree, horaire.finsortie,
                    None, horaire.debutentree, horaire.debutsortie,
                    horaire.debut, horaire.fin, horaire.margedepartant,
                    horaire.margeretard, dpause, fpause, quota, horaire.nom
            ]
        else:
            return default_values()    

    except Exception as e:
        return default_values()







from datetime import datetime

def get_jour_semaine(d1):
    """
    Retourne le nom du jour de la semaine en français pour une date donnée.

    Args:
        d1 (str): La date au format "YYYY-MM-DD".

    Returns:
        str: Nom du jour de la semaine (ex : "lundi", "dimanche").
    """
    # Dictionnaire de correspondance des jours en anglais vers le français
    jours_francais = {
        "Monday": "lundi",
        "Tuesday": "mardi",
        "Wednesday": "mercredi",
        "Thursday": "jeudi",
        "Friday": "vendredi",
        "Saturday": "samedi",
        "Sunday": "dimanche"
    }
    
    # Convertir la chaîne de date en un objet datetime
    date_obj = datetime.strptime(d1, "%Y-%m-%d")
    
    # Obtenir le jour en anglais et le mapper en français
    jour_anglais = date_obj.strftime("%A")
    return jours_francais[jour_anglais]

def est_nuit(heure_debut, heure_fin, heure_debut_nuit=22, heure_fin_nuit=6):
    """Détermine si un shift est de nuit.

    Args:
        heure_debut (datetime.time): Heure de début du shift.
        heure_fin (datetime.time): Heure de fin du shift.
        heure_debut_nuit (int, optional): Heure de début de la nuit (par défaut 22h).
        heure_fin_nuit (int, optional): Heure de fin de la nuit (par défaut 6h).

    Returns:
        bool: True si le shift est de nuit, False sinon.
    """
    # Convertir les heures de début et fin de nuit en objets time
    heure_debut_nuit = time(heure_debut_nuit, 0)
    heure_fin_nuit = time(heure_fin_nuit, 0)

    return (heure_debut >= heure_debut_nuit and heure_debut < time(23, 59)) or \
           (heure_fin > time(0, 0) and heure_fin <= heure_fin_nuit)



def ajuster_shift_nuit(entreepointage, sortiepointage, d1, listepointages):
    if entreepointage:
        heure_entree = datetime.strptime(str(entreepointage), '%H:%M:%S').time()
        heure_limite_nuit = datetime.strptime("21:45:00", '%H:%M:%S').time()

        # Vérifier s'il y a un pointage plus tôt dans la journée
        pointage_avant = any(datetime.strptime(str(p), '%H:%M:%S').time() < heure_limite_nuit for p in listepointages)

        if heure_entree >= heure_limite_nuit and not pointage_avant:
            # Si l'entrée est après 21h45 et qu'aucun pointage n'a été fait avant, on ajuste la date
            d1 = (datetime.strptime(d1, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")

    return d1
def parse_to_time(value):
        if isinstance(value, time):
            return value
        if isinstance(value, str):
            value = value.strip()
            if value not in ('', '...', '00:00:00'):
                try:
                    return datetime.strptime(value, '%H:%M:%S').time()
                except ValueError:
                    pass
        return None

def Day(finpause, debutpause, finsortie, norr, finentree, debutentree, debutsortie, debut, sortie,
        marge_anticipe, retard, entreepointage, sortiepointage,  listepointages,
        ttzero, json_data, idemploye, pointages, pausee, dpausedej, fpausedej, quota,nomhoraire,refpointeuse,efpointeuse,departement_name,d1,Ligne_name,Superviseur_name,nom_pointeuse_entree,nom_pointeuse_sortie,shift_nuit):
    # Variables initiales
    earlyEntree, earlySortie, lateEntree, date_pointage,lateSortie = 0.0, 0.0, 0.0, 0.0 ,0.0
    heureTravailBrute, jourtravaille, retardmidi, defi = 0.0, 0, 0.0, 0.0
    heureeffectivee=0.0
    listerapport = []
    # print("listepointages",listepointages)
    # Calcul de la pause déjeuner
    if dpausedej and fpausedej:
        dpause_time = datetime.strptime(str(dpausedej), '%H:%M:%S').time()
        fpause_time = datetime.strptime(str(fpausedej), '%H:%M:%S').time()
        time_difference = timedelta(hours=fpause_time.hour, minutes=fpause_time.minute) - timedelta(hours=dpause_time.hour, minutes=dpause_time.minute)
    else:
        time_difference = timedelta()  # Pas de pause

    # pointeuses_entree = pointeuse.objects.filter(
    # id=refpointeuse ,
    # etat=True
    # ).values('id' ).first()
    # pointeuses_sortie = pointeuse.objects.filter(
    # id=efpointeuse ,
    # etat=False
    # ).values('id' ).first()
    # # Calcul de la présence normale
    presencenormale = minute_interval(ttzero, datetime.strptime(str(norr), '%H:%M:%S').time()) - (quota or 0) if norr else 0

    heureeffective = timedelta(minutes=0)
    hi, hi_brute = 0, 0
    heuresupvalide,heuresupp=0,0
    
    absen=0,0
    # Gestion des valeurs d’entrée/sortie
    if entreepointage and debutentree and entreepointage < debutentree:
        earlyEntree = minute_interval(datetime.strptime(str(entreepointage), '%H:%M:%S').time(),
                                      datetime.strptime(str(debutentree), '%H:%M:%S').time())

    if entreepointage and debut and entreepointage > debut:
        lateEntree = minute_interval(datetime.strptime(str(debut), '%H:%M:%S').time(),
                                     datetime.strptime(str(entreepointage), '%H:%M:%S').time())

    if sortiepointage and debutsortie and sortiepointage < debutsortie:
        earlySortie = minute_interval(datetime.strptime(str(sortiepointage), '%H:%M:%S').time(),
                                      datetime.strptime(str(debutsortie), '%H:%M:%S').time())

    if sortiepointage and finsortie and sortiepointage > finsortie:
        lateSortie = minute_interval(datetime.strptime(str(finsortie), '%H:%M:%S').time(),
                                     datetime.strptime(str(sortiepointage), '%H:%M:%S').time())

    # Calcul des heures de travail brutes
    hi_brute = 0  # valeur par défaut

    debut_time = parse_to_time(debut)
    sortie_time = parse_to_time(sortie)

    print("entree", entreepointage)
    print("sortie", sortiepointage)
    print("listepointages", listepointages)

    hi_brute = 0  # valeur par défaut

    if len(listepointages) >= 2 and not shift_nuit :
        # Cas normal : on a des paires entrée/sortie
        for i in range(0, len(listepointages) - 1, 2):
            entree_reelle = entreepointage
            sortie_reelle = sortiepointage 

            if debut_time :
             if entree_reelle is not None:
                entree_reelle = max(entree_reelle, debut_time)
             else: 
                entree_reelle = debut_time

            if sortie_time :
             if sortie_reelle is not None:
                sortie_reelle = min(sortie_reelle, sortie_time)
             else: 
                sortie_reelle = sortie_time
            # Calcul du delta en timedelta
            if sortie_reelle and entree_reelle:
                if sortie_reelle >= entree_reelle:
                    delta = datetime.combine(date.min, sortie_reelle) - datetime.combine(date.min, entree_reelle)
                else:
                    # Shift de nuit
                    delta = datetime.combine(date.min + timedelta(days=1), sortie_reelle) - datetime.combine(date.min, entree_reelle)

            hi_brute += delta.total_seconds() / 60
    else:
    # Cas spécial : shift de nuit avec une seule entrée/sortie
        if entreepointage and sortiepointage:
            entree_reelle = entreepointage
            sortie_reelle = sortiepointage

            # Appliquer max/min uniquement si on a des valeurs valides
            if debut_time :
                entree_reelle = max(entree_reelle, debut_time)

            if sortie_time and sortie_reelle:
                sortie_reelle = min(sortie_reelle, sortie_time)

            if sortie_reelle >= entree_reelle:
                delta = datetime.combine(date.min, sortie_reelle) - datetime.combine(date.min, entree_reelle)
            else:
                # Shift de nuit
                delta = datetime.combine(date.min + timedelta(days=1), sortie_reelle) - datetime.combine(date.min, entree_reelle)

            hi_brute = delta.total_seconds() / 60
        else:
            hi_brute = 0
    heureTravailBrute = hi_brute
    
    # Traitement du plan hebdomadaire
    # if plansem and plansem[0].get('motifplan') == 'administratif':
    #     if sortiepointage and finsortie and sortiepointage > finsortie:
    #         sortiepoint = finsortie
    #         listepointages[-1] = finsortie
    #     if entreepointage and debutentree and entreepointage < debutentree:
    #         entreepoint = debutentree
    #         listepointages[0] = debutentree

    # Calcul de `hi` avec la pause et retard
    for i in range(0, len(listepointages) - 1, 2):
        entreepoint = entreepointage if entreepointage else time(0, 0)
        sortiepoint = sortiepointage if sortiepointage else time(0, 0)
        diffsortieentree = abs(datetime.combine(date.min, sortiepoint) - datetime.combine(date.min, entreepoint))
        hi += minute_interval(ttzero, diffsortieentree)
        # diffsortieetravail=abs(datetime.combine(date.min, sortie) - datetime.combine(date.min, debut))
    # Calcul de l'heure effective et déficit
    heureeffective = hi - (quota or 0) if len(listepointages) == 2 and hi > (quota * 2 if quota else 0) else hi
    
   
    joure=get_jour_semaine(d1)
    if nomhoraire ==None or debut ==None or sortie ==None: 
        nomhoraire="... "
        debut="... "
        sortie="... "

    if debut_time and sortie_time:
        presence_plann_val = minute_intervale(debut_time, sortie_time)
    else:
        presence_plann_val = 0
    if nomhoraire =='ADM':
        heureTravailBrute = heureTravailBrute -60 
        print("heureTravailBrute",heureTravailBrute)
        presence_plann_val =minute_intervale(debut_time, sortie_time)-60
    heureeffectivee =minutes_hours(float(heureeffective))    
    if  sortiepointage != entreepointage and joure!="samedi":
         heuresupp=heureTravailBrute- presence_plann_val
         if heuresupp > 0:
             heuresupp=heuresupp
         else: 
             heuresupp=0
    else :
        heuresupp=0
    print('presence_plann_val',presence_plann_val)
    print('presencenormale',heureTravailBrute)
    defi = ( presence_plann_val-heureTravailBrute )
    
    print('defi',defi)
    if heureTravailBrute>480.0 :
        heureTravailBrute= 480.0 
    presence_plann_va= presence_plann_val/60
    # print("heurebrut",heureTravailBrute)
    # print("refpointeuse",refpointeuse)
    # print("heureplann",presence_plann_val)
    if entreepointage and sortiepointage:
        date_pointage = ajuster_shift_nuit(entreepointage, sortiepointage, d1,listepointages ) if d1 else '...'
        print ("date_pointage",date_pointage)
    else: date_pointage = d1 
    
    # Création du rapport
    listerapport.append({
         "motif": "",
    "Entree": entreepointage,
    "Sortie": sortiepointage if sortiepointage != entreepointage else "...",
    "earlyEntree": earlyEntree,
    "lateEntree": lateEntree,
    "earlySortie": earlySortie,
    "lateSortie": lateSortie,
    "user_name": json_data[0]['user_name'],
    "matricule": json_data[0]['matricule'],
    "date_pointage":date_pointage,
    "planing": "pas de planning ",
    "heuretravail": str(heureeffective),
    "pause": pausee,
    "presencenormal": heureTravailBrute,
    "jourtravaille": jourtravaille,
    "iduser": json_data[0]['iduser'],
    "entreepointage": json_data[0]['heure'],
    "sortiepointage": json_data[-1]['heure'],
    "heureauthorisation": "0",
    "deficit": defi,
    "pointages": pointages,
    "tempabsence": "0.0",
    "jourconge": "0",
    "tempsMission": "0.0",
    "tempsconge": "0.0",
    "last_name": json_data[0]['last_name'],
    "ligne_de_production": str(Ligne_name),
    "superviseur": str(Superviseur_name),
    "heuretravailbrute": str(heureTravailBrute),
    "retardmidi": str(retardmidi),
    "nomhoraire": str(nomhoraire),
    "debuthoraire": str(debut),
    "finhoraire": str(sortie),
    "refpointeuse": str(nom_pointeuse_entree),  
    "efpointeuse": str(nom_pointeuse_sortie),
    "jour_nrmlmn_travaille": str(heureeffective),
    "jour_travaille": str(heureTravailBrute),
    "retard": lateEntree,
    "depart_anticipe": "",
    "Absent": "...",
    "heuresup": heuresupp,
    "heuresupvalide": heuresupvalide,
    "presenceplann" :presence_plann_val,
    "departement_name": str(departement_name)
        


        
        
        

    })

    return listerapport

def AbsenceMission(listconges, d1, idemploye, ttzero, finpause, debutpause, finsortiee, nor, finentre, pausee):
    lista = []
    timec = 0.0
    pause = 0.0

    # Vérification des entrées
    if not listconges or not isinstance(listconges, list) or len(listconges) == 0:
        return [timec, False]

    try:
        datefin = listconges[0].get('datefin')      
        datedebut = listconges[0].get('datedebut')  
        heurefin = listconges[0].get("heure_fin")  
        heuredebut = listconges[0].get("heure_debut") 
        justifie = listconges[0].get("justifie", False)

        # Validation des champs obligatoires
        if None in [datedebut, datefin, heuredebut, heurefin]:
            return [timec, justifie]

        # Convertir en string pour les comparaisons
        str_d1 = str(d1)
        str_datedebut = str(datedebut)
        str_datefin = str(datefin)

        # Parcourir les dates entre date début et date fin 
        for single_date in daterange(datedebut, datefin):               
            lista.append(str(single_date))
            # print("lista",lista)
        pause = pausee if pausee else 0.0

        # Conversion en minutes avec validation
        try:
            minheuredebut = minute_interval(ttzero, datetime.strptime(str(heuredebut), '%H:%M:%S').time())
            minuheurefin = minute_interval(ttzero, datetime.strptime(str(heurefin), '%H:%M:%S').time())
            
            minfinpause = minute_interval(ttzero, datetime.strptime(str(finpause), '%H:%M:%S').time()) if finpause else 0
            mindebutpause = minute_interval(ttzero, datetime.strptime(str(debutpause), '%H:%M:%S').time()) if debutpause else 0
            minfinsortie = minute_interval(ttzero, datetime.strptime(str(finsortiee), '%H:%M:%S').time()) if finsortiee else 0
            minfinentre = minute_interval(ttzero, datetime.strptime(str(finentre), '%H:%M:%S').time()) if finentre else 0
        except (ValueError, TypeError, AttributeError):
            return [timec, justifie]

        # Logique principale
        if str_d1 in str_datedebut and str_d1 in str_datefin:  # si date= datedebut=date fin
            if minheuredebut <= mindebutpause:
                if minuheurefin <= mindebutpause:
                    timec = minuheurefin - minheuredebut
                elif minuheurefin >= minfinpause:
                    timec = minuheurefin - minheuredebut - pause
                elif mindebutpause <= minuheurefin <= minfinpause:
                    timec = mindebutpause - minheuredebut
            elif minheuredebut >= minfinpause:
                timec = minuheurefin - minheuredebut
            elif mindebutpause <= minheuredebut <= minfinpause:
                if minuheurefin >= minfinpause:
                    timec = abs(minuheurefin - minfinpause)
            
            return [timec, justifie]

        elif str_d1 in str_datedebut:
            if minheuredebut <= mindebutpause:
                timec = abs(minfinsortie - minheuredebut) - pause
            elif minheuredebut >= minfinpause:
                timec = abs(minfinsortie - minheuredebut)
            elif mindebutpause <= minheuredebut <= minfinpause:
                timec = minfinsortie - minfinpause
            
            return [timec, justifie]

        elif str_d1 in str_datefin: 
            if minuheurefin <= mindebutpause:
                timec = abs(minuheurefin - minfinentre)
            elif minuheurefin >= minfinpause:
                timec = abs(minuheurefin - minfinentre)
            elif mindebutpause <= minuheurefin <= minfinpause:
                timec = abs(minfinentre - mindebutpause)
            
            return [timec, justifie]

        else:
            for a in lista:
                if str_d1 == a:
                    try:
                        if nor:  # Vérifier que nor n'est pas None
                            timec = minute_interval(ttzero, datetime.strptime(str(nor), '%H:%M:%S').time())
                    except (ValueError, TypeError):
                        pass
                    return [timec, justifie]

    except Exception as e:
         print(f"Erreur dans AbsenceMission: {str(e)}")
    
    return [timec, justifie]

def findDay(date):  # date au format "YYYY-MM-DD"
    locale.setlocale(locale.LC_TIME, '')  # Définit la locale pour obtenir le nom du jour dans la langue système
    year, month, day = (int(i) for i in date.split('-'))  # Année, mois, jour dans le bon ordre
    born = datetime(year, month, day)
    return born.strftime("%A").lower()

def compare(a, b):
    return (a > b) - (a < b)

# def minute_interval(start, end):
#      delta=0.0
#      if start > end:

#         delta = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0

#      return delta



def minute_interval(start, end):
    # Vérifiez que start et end sont bien de type datetime.time
    if isinstance(start, timedelta):
        start = (datetime.combine(datetime.min, time(0, 0)) + start).time()
    if isinstance(end, timedelta):
        end = (datetime.combine(datetime.min, time(0, 0)) + end).time()

    reverse = False
    if start > end:
        start, end = end, start
        reverse = True

    # Calcul du delta en minutes
    delta = (end.hour - start.hour) * 60 + end.minute - start.minute + (end.second - start.second) / 60.0
    if reverse:
        delta = 24 * 60 - delta

    return delta
def minute_intervale(start, end):
    # Cas où start et end sont des time → calcul de timedelta
    if isinstance(start, time) and isinstance(end, time):
        dt_start = datetime.combine(datetime.today(), start)
        dt_end = datetime.combine(datetime.today(), end)
        delta = (dt_end - dt_start).total_seconds() / 60

        # Si end < start (par exemple shift de nuit)
        if delta < 0:
            delta += 24 * 60
        return delta
def minute_intervalee(start, end):
    """
    Calcule la différence en minutes entre start et end.
    start et end peuvent être :
        - datetime.time
        - datetime.datetime
        - timedelta
    """
    if isinstance(start, timedelta) and isinstance(end, timedelta):
        diff = end - start
    elif isinstance(start, (datetime, time)) and isinstance(end, (datetime, time)):
        # Convertir time en datetime
        if isinstance(start, time):
            start = datetime.combine(date.today(), start)
        if isinstance(end, time):
            end = datetime.combine(date.today(), end)
        diff = end - start
    else:
        raise ValueError(f"Types non supportés pour minute_intervalee: {type(start)}, {type(end)}")
    
    return diff.total_seconds() / 60

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
def convert_minutes_to_hhmm(minutes):
    try:
        minutes = float(minutes)
        hours = int(minutes // 60)
        remaining_minutes = int(minutes % 60)
        return f"{hours:02d}:{remaining_minutes:02d}"
    except Exception as e:
        return "00:00" 
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