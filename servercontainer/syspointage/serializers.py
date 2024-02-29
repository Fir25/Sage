from ctypes import pointer
from rest_framework import serializers
from .models import *
from rest_framework_recursive.fields import RecursiveField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer,TokenVerifySerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from jwt import decode as jwt_decode
from django.conf import settings
class PlanningSerializer(serializers.ModelSerializer) : 
    
     class Meta : 
        model = planning
        fields = [
                 'id',
                 'title',
                 'start' ,
                 'end' ,
                 'plantravail',
                 'created_at',
                 'employe',
        ]  
class arborenscenceSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    label = serializers.CharField(source='nom', read_only=True)
    value = serializers.CharField(source='id', read_only=True)

    class Meta:
        model = arborescence
        fields = [
            'id',
            'nom',
            'parent',
            'children',
            'label',
            'value',
        ]

    def get_children(self, obj):
        # Handle recursive relationship for children
        children = arborescence.objects.filter(parent=obj)
        serializer = arborenscenceSerializer(children, many=True)
        return serializer.data
        
class SiteSerializer(serializers.ModelSerializer) : 
    class Meta : 
        model = Site
        fields = [
                'id',
                'nomsite',
               
        ]
class CustomUserSerializer(serializers.ModelSerializer):

    #email = serializers.EmailField(required=True)
    user_name = serializers.CharField(required=True)
   
    
    nomcontrat=serializers.CharField(source="idcontrat.contratname",read_only=True)
    roles=serializers.CharField(source="role.rolename",read_only=True)
    #pp=serializers.PlanningSerializer(many=True)
    nomsit=serializers.CharField(source="site.nomsite",read_only=True)
    #aa=arborenscenceSerializer(many=True,read_only=True,source="arborescence_set")
    label= serializers.SerializerMethodField()
    value=serializers.SerializerMethodField()
    nomplannings=serializers.SerializerMethodField()
    nomdepartements=serializers.SerializerMethodField()
    contrat=serializers.SerializerMethodField()# return list of contrats (user is en relation many to many with contrats ) 
    class Meta:
        model = NewUser
        fields = [
         'id',
         'email',
         'user_name', 
         'password', 
         'newpassword',      
         'matricule', 
         'role',
         'sex',
         'planningemp',
         'matriculecnss',
         'datedemarrage',
         #'datefin',
         #'rappel1',
         #'rappel2',
         #'démarrageContrat',
         'idcontrat',
         'datedenaissance',
         'CIN' ,
         'nbEnfants',
         'tel' ,
         'commentaire',
         'is_staff', 
         'is_superuser',
         'is_active',
         'arborescence',
         'roles',
         'solde',

         'situation_sociale',
         'teletravail',
         'motifparti',
         'last_name',
         'activite',
         'site',
         'nomcontrat',
         'nomsit',
         'label',
         'value',
         'nomdepartements',
         'nomplannings',
         'matriculepaie',
         'globale',
         'soldemaladie',
         'contrat',
         'typepaie'
         

        


         #'saisonier'
  
         
         ]
    def get_contrat(self,obj):
        querycontrats=NewUser.objects.filter(id=obj.id).prefetch_related('idcontrat')#join  user
        d=[]
        for c in querycontrats:
          
            l=c.idcontrat.values('contratname','detailscontratsemployes').all()
        for i in l :
            d=d+list(DetailsContratsEmployes.objects.filter(id=i.get('detailscontratsemployes')).values().all())
     
        return d
    def get_nomplannings(self,obj):
        
        queryplanning=NewUser.objects.filter(id=obj.id).prefetch_related('planningemp')
        for test in queryplanning:
            lista=test.planningemp.values_list('title')
        return list(lista)
    def get_nomdepartements(self,obj):
        
        querydep=NewUser.objects.filter(id=obj.id).prefetch_related('arborescence')
        for test in querydep:
            lista=test.arborescence.values_list('nom')
        return list(lista)
    def get_label(self, obj):
        return '{} {}'.format(obj.user_name, obj.last_name)        
    def get_value(self, obj):
        return '{} {} '.format(obj.id,'_', obj.email) 
      
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        arborescence = validated_data.pop('arborescence', [])
        # as long as the fields are the same, we can just use this
       
        obj = super().create(validated_data)
        if password is not None:
            
            obj.set_password(password)
            obj.arborescence.set(arborescence)
        obj.save()
        
        return obj
    def update(self, instance, validated_data):
        
        if 'password' in validated_data:
            password = validated_data.pop('password', None)
            newpassword = validated_data.pop('newpassword', None)
            #arborescence = validated_data.pop('arborescence', [])
            

            if password==newpassword:
               instance.set_password(password)
                
            #instance.arborescence.set(arborescence)
             
        return super().update(instance, validated_data) 
        

 
         


class RoleSerializer(serializers.ModelSerializer) : 
    class Meta : 
        model = role
        fields = [
                'id',
                'rolename',
                'rh',
                'view_conge',
                'view_employé',
                'modifier_employé',
                'delete_employé',
                'view_conge',
                'view_departements',
                'view_departements_edit',
                'view_departements_del',
                'view_espacepdg',
                'view_contrats',
                'view_pointeuse',
                'view_absence',
                'view_planing',
                'view_horaire',
                'contratsedit',
                'contartdelete',
                'pointeuseedit',
                'pointeusedelete',
                'horaireedit',
                'horairedelete',
                'planningedit',
                'planningdelete',
                 'absenceedit',
                 'absencedelete',
                 'Sitesedit',
                 'Sitesdelete',
                 'view_pointage',
                 'pointageedit',
                 'pointagedelete',
                'view_rapports',
                'view_historique',
                'view_mouchard',
                'view_teletravail',
                'view_mission',
                'view_autorisation',
                'view_Sites',
                'view_employe_rh',
                'view_dep_rh',
                'view_contrat_rh',
                'view_horaire_rh',
                'view_planinng_rh',
                'view_abscence_rh',
                'view_historique_rh',
                'DRH',
                'viewlistcontrats_admin',
                'viewlistcontrats_rh',
                'viewlistTeletravail_drh',
                'viewdirecteur',
                'affectationopause',
                'accuiel',
                'directionoperations',
                'wfm',
                
                'view_demanderh',
                'demanderhedit',
                'demanderhdelete',
                
                 'view_demandeaut',
                  'demandeautedit', 
                 'demandeautdelete',
             

        ]

class pointeusesSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = pointeuse
        fields = [
                'id',
                'nom_pointeuse',
                'adresse_ip', 
                'SIV', 
                'port',
        ]  
class PointageSerializer(serializers.ModelSerializer) : 
     pointeusename = serializers.CharField( source='pointeuse.nom_pointeuse' ,  read_only=True)
     employe=serializers.CharField( source='employes.user_name' ,  read_only=True)
     matricule=serializers.CharField( source='employes.matricule' ,  read_only=True)
     last_name=serializers.CharField( source='employes.last_name' ,  read_only=True)
     pause=serializers.CharField( source='idpause.nom' ,  read_only=True)
     class Meta : 
        model = pointage
        fields = [
    'id',
    'pointeuse' ,
    'pointeusename',
    'date_pointage', 
    'employes',
    'employe',
    'matricule',
    'last_name',
    'etat',
    'description',
    'idpause',
    'pause',
   


    
        ]                                                       

class EquipeSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = Equipe   
        fields = [
                'id',
                'nomequipe' ,]
class MotifabsSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = motif_abs
        fields = [
                'id',
                'motif',
                'motifConge',
                'nombrejours_ouvres',
                'motifmission',
                'motifteletravail',
                'nbjours_retire',
                'motifdemijournne',
                'justifie',
                'congemaladie',
                'motifautorisation',
                'motifdemanderh', 
                'motifpointage',
        ]   
class AbsenceSerializer(serializers.ModelSerializer):
        employee = serializers.CharField(source='employes.user_name' ,read_only=True)
        employeelastname = serializers.CharField(source='employes.last_name' ,read_only=True)
        motif = serializers.CharField(source='motif_abs.motif',read_only=True)
        class Meta:
                model=absence
                fields=[
                        'id',
                        'employes',
                        'raison',
                        'datedebut',
                        'datefin',
                        'motif_abs',
                        'employee',
                        'motif',
                        'justifie',
                        'heure_debut',
                        'heure_fin',
                        'employeelastname'
                ]        

class ContratSerializer(serializers.ModelSerializer):
        class Meta:
                model = contrat
                fields=[
                        'id',
                        'contratname',
                ] 
                
class HoraireJourSerializer(serializers.ModelSerializer) : 
     class Meta : 
        model = horairejour
        fields = [
          'id',
          'nom', 
          'debut', 
          'fin',
          'debutentree',  
          'finentree',
          'margeretard', 
          'margedepartant',
          'debutpause',
          'finpause', 
          'debutsortie',
          'finsortie',
          'jourtravaille',
          'pause'
     
        ]  
      
            
                 
class PlanSemaineSerializer(serializers.ModelSerializer) : 
     
     lu=serializers.CharField(source='lundi.nom',read_only=True)
     ma=serializers.CharField(source='mardi.nom',read_only=True)
     me=serializers.CharField(source='mercredi.nom',read_only=True)
     je=serializers.CharField(source='jeudi.nom',read_only=True)
     ve=serializers.CharField(source='vendredi.nom',read_only=True)
     sa=serializers.CharField(source='samedi.nom',read_only=True)
     di=serializers.CharField(source='dimanche.nom',read_only=True)
     class Meta : 
        model = plansemaine
        fields = [
                 'id',
                 'nomsemaine',
                 'lundi',
                 'lu',
                 'mardi' ,
                 'ma',
                 'mercredi' ,
                 'me',
                 'jeudi',
                 'je',
                 'vendredi',
                 've',
                 'samedi',
                 'sa',
                 'dimanche',
                 'di',
                 'motifplan'
        ]                     
     
class congesSerializer(serializers.ModelSerializer):
        employemail=serializers.CharField(source='employes.email',read_only=True)
        employee=serializers.CharField( source='employes.user_name' ,  read_only=True)
        last_name=serializers.CharField( source='employes.last_name' ,  read_only=True)
        matricule=serializers.CharField( source='employes.matricule' ,  read_only=True)
        motif=serializers.CharField( source='motif_abs.motif' ,  read_only=True)
 
        demijournne=serializers.CharField( source='motif_abs.motifdemijournne' ,  read_only=True)
        class Meta :
                model=Conges
                fields=[
                'id',
                'motif_abs',
                'motif',
                'datedebut',
                'datefin',
                'contact',
                'adresse',
                'employes',
                'employemail',
                'heure_debut',
                'heure_fin',
                'date_autorisation',
                'mission',
                'nbjours',
                'personneinterimaire',
                #'datetimereprise',
                'commentaire',
                'validation',
                'validationrh',
                'destination',
                'villedepart',
                'transport',
                'teletravail',
                'employee',
                'matricule',
                'last_name',
                'demijournne',
                'matindebut',
                'matinfin',
                'nbjoursmaladiecoupe',
                'documentmaladie',
                'validationrh2',
                'remarquerh1',
                'remarquerh2',
                'remarqueemploye',
            
            
         
                ]
class JourFerieSerializer(serializers.ModelSerializer):
        class Meta:
                model=JourFerie
                fields=[
                        'id',
                        'nom',
                        'etat_jour',
                        'date',
                        'datefin',
                ]

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        

        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        print('bnj')
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)        

        return data 



class HistoriqueSerializer(serializers.ModelSerializer):
        employee=serializers.CharField( source='employe.user_name' ,  read_only=True)
        soldeactuelle=serializers.CharField( source='employe.solde' ,  read_only=True)
        last_name=serializers.CharField( source='employe.last_name' ,  read_only=True)
        class Meta :
                model=Historique
                fields=[
                   'id',
                   'anciennevaluer',
                   'nouvellevaluer',
                   'employe',
                   'datenow',
                   'idper_modifie',
                   'valeursolde_ajoute',
                   'employee',
                   'soldeactuelle',
                   'commentaire',
                   'last_name'
                  
                ]   
  
class LogSerializer(serializers.ModelSerializer) : 
    
     class Meta : 
        model = Log
        fields = [
                 'name_path',
                 'path_info',
                 'host' ,
                 'method' ,
                 'matricule',
                 'nomprenom',
                 'date'
        ]


class MouchardSerializer(serializers.ModelSerializer):
        
        class Meta :
                model=Mouchard
                fields=[
                'id',
                'anciennevaluer',
                'nouvellevaluer',
                'employe',
                'datenow',
                'idper_modifie',
                'objet'
              
                ]  
class EmailsSerializer(serializers.ModelSerializer):
        
        class Meta:
                model=Emails
                fields=[
                        'id',
                        'label',
                        'value'
                        
                ]
class MyTokenVerifySerializer(TokenVerifySerializer):
 
    token = serializers.CharField()

    def validate(self, attrs):
      
        datauser = jwt_decode(attrs['token'], settings.SECRET_KEY, algorithms=['HS256'])#return id user from his token
        idusercurrent=datauser['id']
        userrr=NewUser.objects.filter(id=idusercurrent)#filter user with his id
        rolee=userrr.select_related('role')
        data={}
        
        data['DRH']=False
        
        c=userrr.values()[0]
        
        
        if c.get('role_id'):
           rolesvalues=role.objects.filter(id=c.get('role_id')).values()[0]#return role list of user  
       
        if c.get('role_id')!=None and c.get('is_superuser')==False:#if user has role and he is superadmin
          
           iddepchef=None
           iddeprh=None

           testRH=None           

           emailsdrhs=list(NewUser.objects.select_related('role').filter(role__DRH=True).values('email','id').all())#get all the mails of drh 
           
           dataiddeprh=[]
           dataiddeprh = arborescence.objects.filter(
                 chefs__id=idusercurrent
                ).values_list('id', flat=True)

           
         
           data['iddep']=dataiddeprh  
          
           #if user has valid teletravail => data['teletravail_aujourdhui']=True
           verif_teletravail=Conges.objects.filter(employes=idusercurrent,validationrh=1,validationrh2=2,teletravail=True,datedebut__lte=datetime.now().date(), datefin__gte=datetime.now().date()).values()
           
           if verif_teletravail:
            
              data['teletravail_aujourdhui']=True
           drhhverif=NewUser.objects.select_related('role').filter(role__DRH=True,id=idusercurrent)
        
           if drhhverif:#if role has DRH(true) then user is drh
              data['DRH']=True
              data['emaildrh']=str(drhhverif.values('email')[0].get('email'))   

           data['id'] =idusercurrent
           data['view_absence'] = rolesvalues.get('view_absence')
           
           data['view_conge'] = rolesvalues.get('view_conge')
           data['view_employé'] = rolesvalues.get('view_employé')
           data['modifier_employé'] = rolesvalues.get('modifier_employé')
           data['delete_employé'] = rolesvalues.get('delete_employé')
           data['view_departements'] = rolesvalues.get('view_departements')
           data['view_departements_edit'] = rolesvalues.get('view_departements_edit')
           data['view_departements_del'] = rolesvalues.get('view_departements_del')
           data['view_contrats'] = rolesvalues.get('view_contrats')
           data['view_horaire'] = rolesvalues.get('view_horaire')
           data['view_planing'] = rolesvalues.get('view_planing')
           data['view_pointeuse'] =rolesvalues.get('view_pointeuse') 
           data['view_espacepdg'] = rolesvalues.get('view_espacepdg')
           data['view_rapports']=rolesvalues.get('view_rapports')
           data['view_historique']=rolesvalues.get('view_historique')
           data['view_mouchard']=rolesvalues.get('view_mouchard')
           data['contratsedit']=rolesvalues.get('contratsedit')
           data['contartdelete']=rolesvalues.get('contartdelete')
           data['pointeuseedit']=rolesvalues.get('pointeuseedit')
           data['pointeusedelete']=rolesvalues.get('pointeusedelete')
           data['horaireedit']=rolesvalues.get('horaireedit')
           data['horairedelete']=rolesvalues.get('horairedelete')
           data['planningedit']=rolesvalues.get('planningedit')
           data['planningdelete']=rolesvalues.get('planningdelete')
           data['absenceedit']=rolesvalues.get('absenceedit')
           data['absencedelete'] =rolesvalues.get('absencedelete')
           data['Sitesedit']=rolesvalues.get('Sitesedit')
           data['Sitesdelete']=rolesvalues.get('Sitesdelete')
           data['view_pointage']=rolesvalues.get('view_pointage')
           data['pointageedit']=rolesvalues.get('pointageedit')
           data['pointagedelete']=rolesvalues.get('pointagedelete')
           data['user_name']=c.get('user_name')  
           data['matricule']=c.get('matricule')    
           data['rolename']=rolesvalues.get('rolename')    
           data['solde']=c.get('solde')    
           data['soldemaladie']=c.get('soldemaladie')
           data['email']=c.get('email')    
           data['last_name']=c.get('last_name')  
           data['view_teletravail']=rolesvalues.get('view_teletravail')
           data['view_mission']=rolesvalues.get('view_mission')
           data['view_autorisation']=rolesvalues.get('view_autorisation')     
           data['view_Sites']=rolesvalues.get('view_Sites')
           data['view_employe_rh']=rolesvalues.get('view_employe_rh')
           data['view_dep_rh']=rolesvalues.get('view_dep_rh')
           data['view_contrat_rh']=rolesvalues.get('view_contrat_rh')
           data['view_horaire_rh']=rolesvalues.get('view_horaire_rh')
           data['view_planinng_rh']=rolesvalues.get('view_planinng_rh')
           data['view_abscence_rh']=rolesvalues.get('view_abscence_rh')
           data['view_historique_rh']=rolesvalues.get('view_historique_rh')
           data['viewlistcontrats_admin']=rolesvalues.get('viewlistcontrats_admin')
           data['viewlistcontrats_rh']=rolesvalues.get('viewlistcontrats_rh')
           data['viewlistTeletravail_drh']=rolesvalues.get('viewlistTeletravail_drh')
           data['emailsDRHS']=emailsdrhs
           data['viewdirecteur']=rolesvalues.get('viewdirecteur')
           data['affectationopause']=rolesvalues.get('affectationopause')
           data['accuiel']=rolesvalues.get('accuiel') 
           data['directionoperations']=rolesvalues.get('directionoperations')   
           data['wfm']=rolesvalues.get('wfm')  
           data['view_demanderh']=rolesvalues.get('view_demanderh')
           data['demanderhedit']=rolesvalues.get('demanderhedit')
           data['demanderhdelete']=rolesvalues.get('demanderhdelete')
           data['view_demandeaut']=rolesvalues.get('view_demandeaut')
           data['demandeautedit']=rolesvalues.get('demandeautedit')
           data['demandeautdelete']=rolesvalues.get('demandeautdelete')                
        else: #admin ou n'a pas un role=>admin
                data['admin']=True
                
                data['id'] =idusercurrent          
                data['role'] = "admin"
                data['view_absence'] = True
                data['view_conge'] = True
                data['view_employé'] = True
                data['modifier_employé'] = True
                data['delete_employé'] = True      
                data['view_departements'] = True
                data['view_departements_edit'] = True
                data['view_departements_del'] = True
                data['view_contrats'] = True
                data['view_horaire'] = True
                data['view_planing'] = True
                data['contratsedit']=True
                data['contartdelete']=True
                data['pointeuseedit']=True
                data['pointeusedelete']=True
                data['horaireedit']=True
                data['horairedelete']=True
                data['planningedit']=True
                data['planningdelete']=True
                data['view_pointeuse'] = True
                data['absenceedit']= True
                data['absencedelete'] = True
                data['Sitesedit']= True
                data['Sitesdelete']= True
                data['view_pointage']= True
                data['pointageedit']= True
                data['pointagedelete']= True
                data['view_espacepdg'] = True
                data['view_rapports']=True
                data['view_historique']=True
                data['view_mouchard']=True
                data['user_name']=c.get('user_name')  
                data['matricule']=c.get('matricule')    
                data['rolename']=""   
                data['solde']=c.get('solde')    
                data['soldemaladie']=c.get('soldemaladie')
                data['email']=c.get('email')    
                data['last_name']=c.get('last_name')  
                data['view_teletravail']=True
                data['view_mission']=True
                data['view_autorisation']=True
                data['teletravail_aujourdhui']=True
                data['view_Sites']=True
                data['view_employe_rh']=False
                data['view_dep_rh']=False
                data['view_contrat_rh']=False
                data['view_horaire_rh']=False
                data['view_planinng_rh']=False
                data['view_abscence_rh']=False
                data['view_historique_rh']=False
                data['viewlistcontrats_admin']=True
                data['viewlistcontrats_rh']=False
                data['viewlistTeletravail_drh']=True
                data['viewdirecteur']=True
                data['iddep']=[]
                data['affectationopause']=True  
                data['accuiel']= True
                data['directionoperations']=True
                data['wfm']= True
                data['view_demanderh']=True
                data['demanderhedit']=True
                data['demanderhdelete']=True
                data['view_demandeaut']=True
                data['demandeautedit']=True
                data['demandeautdelete']=True
        return data
class DetailsContratsEmployesSerializer(serializers.ModelSerializer):
        user_name=serializers.CharField( source='employe.user_name' ,  read_only=True)
        nomcontrat=serializers.CharField(source="typecontrat.contratname",read_only=True)        
        last_name=serializers.CharField( source='employe.last_name' ,  read_only=True) 
        daterecrutement=serializers.CharField( source='employe.datedemarrage' ,  read_only=True)     
        class Meta:
                model=DetailsContratsEmployes
                fields=[
                        'id',
                        'employe',
                        'typecontrat',
                       'nomcontrat',
                        'datefin',
                        'rappel1',
                        'rappel2',
                        'démarrageContrat',
                        'user_name',
                        'last_name',
                        'daterecrutement'
                        
                ]


                
class PauseSerializer(serializers.ModelSerializer):
        horaire=serializers.SerializerMethodField()
        class Meta:
                model=Pauses
                fields=[
                        'id',
                        'dpause',
                        'fpause',
                        'quota',
                        'nbfois',
                        'planifie',
                        'horaire',
                        'idhoraire',
                        'nom',
                        'pausedejeuner',
                      
                        
                ]
       
        def get_horaire(self,obj):
                queryidhoraire=Pauses.objects.filter(id=obj.id).prefetch_related('idhoraire')
                d=[]
                for c in queryidhoraire:
                
                        d=c.idhoraire.values('nom')

        
                return list(d)    
                
class WorkflowSerializer(serializers.ModelSerializer):
       
    valideur_11 = serializers.CharField(source='valideur_1.user_name',read_only=True)
    valideur_21 = serializers.CharField(source='valideur_2.user_name',read_only=True)
    valideur_31 = serializers.CharField(source='valideur_3.user_name',read_only=True)
    valideur_41 = serializers.CharField(source='valideur_4.user_name',read_only=True)
    motif       =serializers.CharField(source='type_conge.motif',read_only=True)
    dddddd       =serializers.CharField(source= 'departement.nom',read_only=True)
    

    class Meta:
        model = WorkflowConge
        fields = [
            'id',
            'nom',
            'motif',
            'valideur_1',
            'valideur_2',
            'valideur_3',
            'valideur_4',
              'valideur_11',
            'valideur_21',
            'valideur_31',
            'valideur_41',
            'type_conge',
            'dddddd',
            'departement',
              
        ]
        def create(self, validated_data):
                departement_data = validated_data.pop('dddddd')
                departement = arborescence.objects.get(nom=departement_data)
                workflow_conge = WorkflowConge.objects.create(departement=departement, **validated_data)
                return workflow_conge
   
