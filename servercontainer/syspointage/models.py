from django.db import models
from django.db.models.deletion import SET_DEFAULT, SET_NULL
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import datetime
from django.db.models.signals import post_save,pre_save
from datetime import datetime, date,timedelta

class CustomAccountManager(BaseUserManager):

    def create_superuser(self,  password, matricule, user_name , **other_fields):   
        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)
        
        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')

        return self.create_user(   password, matricule, user_name , **other_fields)

    def create_user(self,  password, matricule, user_name , **other_fields):

        
        if not matricule:
            raise ValueError(_('You must provide a matricule '))

       
        user = self.model( password = password  , matricule = matricule ,user_name=user_name, **other_fields)
        user.set_password(password)
        user.save()
        return user          
  

class pointeuse (models.Model):
    nom_pointeuse = models.CharField(max_length=200 , null=True , blank=True )
    adresse_ip = models.CharField(max_length=200 ,  unique=True)
    SIV = models.CharField(max_length=200 , null=True , blank=True )
    port =  models.CharField(max_length=200 , null=True , blank=True )
    
class role (models.Model):
      rolename  = models.CharField(max_length=200 )   
      rh=models.BooleanField(default=False)
      DRH=models.BooleanField(default=False)
      view_conge=models.BooleanField(default=False)
      view_employé=models.BooleanField(default=False)
      modifier_employé=models.BooleanField(default=False)
      delete_employé=models.BooleanField(default=False)
      view_departements=models.BooleanField(default=False)
      view_departements_edit=models.BooleanField(default=False)
      view_departements_del=models.BooleanField(default=False)
      view_espacepdg=models.BooleanField(default=False)

      view_contrats=models.BooleanField(default=False)
      contratsedit=models.BooleanField(default=False)
      contartdelete=models.BooleanField(default=False)

      view_pointeuse=models.BooleanField(default=False)
      pointeuseedit=models.BooleanField(default=False)
      pointeusedelete=models.BooleanField(default=False)

      view_horaire=models.BooleanField(default=False)
      horaireedit=models.BooleanField(default=False)
      horairedelete=models.BooleanField(default=False)

      view_absence=models.BooleanField(default=False)
      absenceedit=models.BooleanField(default=False)
      absencedelete=models.BooleanField(default=False)

      view_planing=models.BooleanField(default=False)
      planningedit=models.BooleanField(default=False)
      planningdelete=models.BooleanField(default=False)
      
      view_Sites=models.BooleanField(default=False)
      Sitesedit=models.BooleanField(default=False)
      Sitesdelete=models.BooleanField(default=False)

      view_pointage=models.BooleanField(default=False)
      pointageedit=models.BooleanField(default=False)
      pointagedelete=models.BooleanField(default=False)
      
      view_demanderh=models.BooleanField(default=False)
      demanderhedit=models.BooleanField(default=False)
      demanderhdelete=models.BooleanField(default=False)
      
      view_demandeaut=models.BooleanField(default=False)
      demandeautedit =models.BooleanField(default=False)
      demandeautdelete=models.BooleanField(default=False)
      
      view_rapports=models.BooleanField(default=False)
      view_mouchard=models.BooleanField(default=False)
      view_historique=models.BooleanField(default=False)
      view_teletravail=models.BooleanField(default=False)
      view_autorisation=models.BooleanField(default=False)
      view_mission=models.BooleanField(default=False)
      
      view_employe_rh=models.BooleanField(default=False)
      view_dep_rh=models.BooleanField(default=False)
      view_contrat_rh=models.BooleanField(default=False)
      view_horaire_rh=models.BooleanField(default=False)
      view_planinng_rh=models.BooleanField(default=False)

      view_abscence_rh=models.BooleanField(default=False)
      
      view_historique_rh=models.BooleanField(default=False)
      viewlistcontrats_admin=models.BooleanField(default=False)
      viewlistcontrats_rh=models.BooleanField(default=False)
      viewlistTeletravail_drh=models.BooleanField(default=False)
      viewdirecteur=models.BooleanField(default=False)
      affectationopause=models.BooleanField(default=False)
      accuiel=models.BooleanField(default=False)
      directionoperations=models.BooleanField(default=False)
      wfm=models.BooleanField(default=False)
      def __str__(self):
          return self.rolename

            
def default_start_time():
    now = datetime.now()
    start_time = now.replace(hour=00, minute=0, second=0, microsecond=0)
    return start_time             
class horairejour (models.Model):   
    nom  = models.TextField(max_length=250 , null=True , blank=True  ) 

    jourtravaille=models.CharField(max_length=200 , null=True ,blank=True)
    debut = models.TimeField('%H:%M %p' ,blank=True, null=True) 
    fin = models.TimeField('%H:%M %p',blank=True, null=True) 
    debutentree = models.TimeField('%H:%M %p' ,blank=True, null=True) 
    finentree = models.TimeField('%H:%M %p' ,blank=True, null=True) 
    margeretard =models.IntegerField( blank=True, null=True,default=0)
    margedepartant =models.IntegerField( blank=True, null=True,default=0)
    debutpause = models.TimeField('%H:%M %p',blank=True, null=True) 
    finpause =models.TimeField('%H:%M %p',blank=True, null=True)
    debutsortie= models.TimeField('%H:%M %p',blank=True, null=True)
    finsortie= models.TimeField('%H:%M %p',blank=True, null=True)
    pause =models.IntegerField( blank=True, null=True,default=0)
    
    
    def __str__(self):
        if str(self.debutpause)=="00:00:00" and str(self.finpause)=="00:00:00":
           Presence_normale=datetime.combine(date.today(), self.fin) - datetime.combine(date.today(),self.debut)
        else:
           Presence_normale=datetime.combine(date.today(), self.fin) - datetime.combine(date.today(),self.debut)

        return str(Presence_normale)


   
class plansemaine  (models.Model):      
        nomsemaine = models.CharField(max_length=200 , null=True ,blank=True)
        lundi = models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='lundi+' ,  verbose_name='lundi')
        mardi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='mardi +' ,  verbose_name='mardi')
        mercredi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='mercredi+' ,  verbose_name='mercredi')
        jeudi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='jeudi+' ,  verbose_name='jeudi')
        vendredi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='vendredi+' ,  verbose_name='vendredi')
        samedi =models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='samedi+' ,  verbose_name='samedi')
        dimanche = models.ForeignKey( horairejour, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='dimanche+' ,  verbose_name='dimanche')
        motifplan=models.CharField(max_length=200 , null=True ,blank=True)
class planning (models.Model): 
    title  = models.TextField(max_length=250 , null=True , blank=True  ) 
    start = models.DateField(blank=True,null=True)
    employe = models.ForeignKey( NewUser, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='employe' ,  verbose_name='nom employe ')
    end = models.DateField(blank=True,null=True)
    plantravail = models.ForeignKey( plansemaine, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='plansemaine' ,  verbose_name='plansemaine')
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
            return str(self.id)
    

class contrat(models.Model):
    contratname=models.CharField(max_length=200)
    def __str__(self):
        return self.contratname    
class Site (models.Model): 
     nomsite=models.CharField(max_length=200 , blank=True, null=True)  

class Equipe (models.Model): 
     nomequipe=models.CharField(max_length=200 , blank=True, null=True)       
class NewUser(AbstractBaseUser, PermissionsMixin):  
     sex  = (
        ('homme' , 'homme'),
        ('femme','femme')
       
    )
     is_staff = models.BooleanField(default=False)
     is_active = models.BooleanField(default=True)
     matricule = models.CharField(max_length=200 , unique=True , null=True)
     user_name =  models.CharField(max_length=200 , blank=True, null=True)
     email =  models.EmailField(_('email address'),blank=True, null=True )
     password =  models.CharField(max_length=200 , null=False)
     matriculecnss = models.CharField(max_length=200 , blank=True, null=True ,default=None)
     sex= models.CharField(choices= sex ,max_length=50,blank=True)
     role = models.ForeignKey( role, blank=True, null=True,   on_delete=SET_DEFAULT,  default=None , related_name='role' ,  verbose_name='role de l employe ')
     arborescence= models.ManyToManyField('syspointage.arborescence',related_name='departement', blank=True , null=True )
     #planningemp = models.ManyToManyField('syspointage.planning', blank=True , null=True)
     
     datedemarrage= models.DateField(blank=True, null=True)
     """
     datefin= models.DateField(blank=True, null=True)
     rappel1= models.DateField(blank=True, null=True)
     rappel2= models.DateField(blank=True, null=True)
     démarrageContrat= models.DateField(blank=True, null=True)
     """
     idcontrat =models.ManyToManyField('syspointage.contrat', blank=True , null=True , through="DetailsContratsEmployes")
     #idcontrat = models.ForeignKey( contrat, blank=True , null=True,  on_delete=SET_DEFAULT,  default=None , related_name='contrat' ,  verbose_name='contrat de l employe'  )
     datedenaissance= models.DateField(blank=True, null=True)
     CIN = models.CharField(max_length=200 , blank=True, null=True)
     nbEnfants = models.IntegerField(max_length=200 , blank=True, null=True)
     tel = models.CharField(max_length=200 , blank=True, null=True)
     commentaire = models.CharField(max_length=200 , blank=True, null=True)
     objects = CustomAccountManager()
     #USERNAME_FIELD = 'matricule'
     #REQUIRED_FIELDS = ['password', 'matricule' ,'user_name']
     USERNAME_FIELD = 'matricule'
     REQUIRED_FIELDS = ['password','user_name']
     solde=models.FloatField(blank=True, null=True)
     #image=models.ImageField(upload_to='users/%Y/%m/%d/', height_field=None, width_field=None, max_length=100,default=None,verbose_name='imagee',null=True,blank=True)
     situation_sociale=models.CharField(max_length=200 , blank=True, null=True)
     teletravail=models.CharField(max_length=200 , blank=True, null=True)
     motifparti=models.CharField(max_length=200 , blank=True, null=True) 
     last_name=models.CharField(max_length=200 , blank=True, null=True,default='')
     newpassword=models.CharField(max_length=200 , null=True,blank=True)
     activite=models.BooleanField(default=True)#statut en active contact(activtité ou suspendu)
     typepaie=models.BooleanField(default=False)
     site= models.ForeignKey(Site , blank=True, null=True, on_delete=SET_DEFAULT,  default=None,related_name="site_set")
     equipe= models.ForeignKey(Equipe , blank=True, null=True, on_delete=SET_DEFAULT,  default=None,related_name="equipe_set")
     matriculepaie=models.CharField(max_length=200 , blank=True, null=True)
     globale=models.FloatField(blank=True, null=True)
     soldemaladie=models.FloatField(blank=True, null=True)
     def __str__(self):
        return str(self.email)

     
class motif_abs(models.Model): 
    motif =  models.CharField(max_length=200 , null=True ,blank=True)
    motifConge=models.BooleanField(default=False)
    nombrejours_ouvres=models.IntegerField( blank=True, null=True)
    motifmission=models.BooleanField(default=False)
    motifteletravail=models.BooleanField(default=False)
    motifautorisation=models.BooleanField(default=False)
    motifdemanderh=models.BooleanField(default=False)
    motifpointage=models.BooleanField(default=False)
    nbjours_retire=models.FloatField(blank=True, null=True)
    motifdemijournne=models.BooleanField(default=False)
    justifie=models.BooleanField(default=False)
    congemaladie=models.BooleanField(default=False)
    paye=models.BooleanField(default=False)
    def __str__(self):
        return self.motif

    
class WorkflowConge(models.Model):
    nom = models.CharField(max_length=200)
    type_conge = models.ForeignKey(motif_abs, blank=True, null=True, on_delete=models.SET_DEFAULT, default=None, related_name='type_conge')
    valideur_1 = models.ManyToManyField(NewUser, related_name='valideur_1')
    valideur_2 = models.ManyToManyField(NewUser, related_name='valideur_2')
    valideur_3 = models.ManyToManyField(NewUser, related_name='valideur_3')
    valideur_4 = models.ManyToManyField(NewUser, related_name='valideur_4')
    departement = models.ForeignKey('syspointage.arborescence', on_delete=models.CASCADE, related_name='departementname')

    class Meta:
        unique_together = ('type_conge', 'departement')

    def __str__(self):
        return self.nom

class absence (models.Model):
    employes =  models.ForeignKey( NewUser , blank=False, null=False,  on_delete=SET_DEFAULT,  default=None)
    raison =  models.TextField(max_length=250 , null=True , blank=True  ) 
    datedebut = models.DateField(blank=True,null=True)
    datefin =  models.DateField(blank=True,null=True)
    motif_abs = models.ForeignKey( motif_abs , blank=True,null=True,  on_delete=SET_DEFAULT,  default=None)
    justifie=models.BooleanField(default=False)       
    heure_debut=models.TimeField(blank=True,null=True)
    heure_fin=models.TimeField(blank=True,null=True)

class arborescence(models.Model):
    nom = models.CharField(max_length=200)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='children', on_delete=models.SET_DEFAULT, default=None)
    chefs = models.ManyToManyField(NewUser, blank=True, related_name='arborescences_as_directiondesopérations')
class Conges(models.Model):
    motif_abs=models.ForeignKey(motif_abs , blank=True, null=True, on_delete=SET_DEFAULT,  default=None)
    datedebut=models.DateField(blank=True,null=True)
    datefin=models.DateField(blank=True,null=True)
    date_autorisation=models.DateField(blank=True,null=True)
    contact=models.CharField(max_length=200,blank=True,null=True)
    adresse=models.CharField(max_length=200,blank=True,null=True)
    heure_debut=models.TimeField(blank=True,null=True)
    heure_fin=models.TimeField(blank=True,null=True)
    employes = models.ForeignKey(NewUser , blank=True, null=True, on_delete=models.CASCADE,  default=None , related_name='empl')
    mission=models.BooleanField(default=False)
    nbjours=models.FloatField(blank=True, null=True)
    personneinterimaire=models.ForeignKey(NewUser , blank=True, null=True, on_delete=SET_DEFAULT,  default=None,related_name='personne')
    #datetimereprise=models.DateTimeField(blank=True, null=True)
    commentaire=models.TextField(max_length=250 , null=True , blank=True  ) 
    validation=models.CharField(max_length=200,blank=True,null=True )
    validationrh=models.IntegerField(max_length=200 , blank=True, null=True)
    destination=models.CharField(max_length=200,blank=True,null=True )
    villedepart=models.CharField(max_length=200,blank=True,null=True )
    transport=models.CharField(max_length=200,blank=True,null=True )
    teletravail=models.BooleanField(default=False)
    matindebut=models.BooleanField(default=True)
    matinfin=models.BooleanField(default=True)
    nbjoursmaladiecoupe=models.FloatField(blank=True, null=True)
    documentmaladie = models.FileField(upload_to ='media/', max_length=254,null=True,blank=True)   
    validationrh2=models.IntegerField(max_length=200 , blank=True, null=True)
    remarquerh1=models.CharField(max_length=200,blank=True,null=True ) 
    remarquerh2=models.CharField(max_length=200,blank=True,null=True ) 
    remarqueemploye=models.CharField(max_length=200,blank=True,null=True ) 
class JourFerie(models.Model):
    nom=models.CharField(max_length=200,blank=True)
    etat_jour=models.CharField(max_length=200,blank=True)
    date= models.DateField(blank=False, null=False)
    datefin= models.DateField(blank=False, null=False)
    def __str__(self):
        return self.nom

class Historique(models.Model):
    anciennevaluer =  models.CharField(max_length=200 , blank=True, null=True)
    nouvellevaluer =  models.CharField(max_length=200 , blank=True, null=True)
    
    datenow=models.DateTimeField(default=datetime.now, blank=True)
    idper_modifie=models.IntegerField(max_length=200 , blank=True, null=True)
    valeursolde_ajoute=models.FloatField(blank=True, null=True)
    commentaire=models.TextField(max_length=255 , null=True , blank=True  ) 
    employe=models.ForeignKey( NewUser , blank=True, null=True,  on_delete=SET_DEFAULT,  default=None)


class Mouchard(models.Model):
    anciennevaluer =  models.CharField(max_length=200 , blank=True, null=True)
    nouvellevaluer =  models.CharField(max_length=200 , blank=True, null=True)
    employe=models.ForeignKey(NewUser,max_length=200 , blank=True, null=True,on_delete=models.CASCADE)#on_delete=models.CASCADE
    datenow=models.DateTimeField(default=datetime.now, blank=True)
    idper_modifie=models.IntegerField(max_length=200 , blank=True, null=True)
    objet=models.CharField(max_length=200 , blank=True, null=True)
    def __str__(self):
        return str(self.employe)
class Log(models.Model):
    name_path =  models.CharField(max_length=200 , blank=True, null=True)
    path_info =  models.CharField(max_length=200 , blank=True, null=True)
    host =  models.CharField(max_length=200 , blank=True, null=True)
    method =  models.CharField(max_length=200 , blank=True, null=True)
    matricule=models.CharField(max_length=200 , blank=True, null=True)
    nomprenom=models.CharField(max_length=200 , blank=True, null=True)
    date=models.DateTimeField(default=datetime.now, blank=True)




class Emails(models.Model):
   label=models.CharField(max_length=200 , blank=True, null=True)
   value=models.CharField(max_length=200 , blank=True, null=True)

class DetailsContratsEmployes(models.Model):
   employe=models.ForeignKey(NewUser,blank=True, null=True,   on_delete=SET_DEFAULT,  default=None )
   typecontrat=models.ForeignKey(contrat,blank=True, null=True,   on_delete=SET_DEFAULT,  default=None )
   datefin= models.CharField(max_length=200 , blank=True, null=True)
   rappel1= models.CharField(max_length=200 , blank=True, null=True)
   rappel2=models.CharField(max_length=200 , blank=True, null=True)
   démarrageContrat=models.CharField(max_length=200 , blank=True, null=True)
class Pauses(models.Model):
    nom=models.CharField(max_length=200 , blank=True, null=True)
    dpause=models.TimeField('%H:%M %p',blank=True, null=True) 
    fpause =models.TimeField('%H:%M %p',blank=True, null=True)
    quota =models.IntegerField( blank=True, null=True,default=0)
    nbfois=models.IntegerField( blank=True, null=True,default=0)
    planifie=models.BooleanField(default=False)
    idhoraire= models.ManyToManyField('syspointage.horairejour', blank=True , null=True)
    pausedejeuner=models.BooleanField(default=False)

    
class pointage (models.Model): 
    pointeuse = models.ForeignKey( pointeuse, blank=True,null=True,   on_delete=SET_DEFAULT,  default=None)
    date_pointage = models.DateTimeField(blank=True,null=True,default=datetime.now)
    employes = models.ForeignKey(NewUser , blank=False, null=False, on_delete=SET_DEFAULT,  default=None)
    idpause=models.ForeignKey(Pauses , blank=True, null=True, on_delete=SET_DEFAULT,  default=None)
    etat=models.IntegerField( blank=True, null=True,default=0)
    description=models.CharField(max_length=200 , blank=True, null=True)
 
    
