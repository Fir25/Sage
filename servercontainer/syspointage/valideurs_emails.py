from . calcul_func import *
from . models import *
from . serializers import *
from . valideurs_emails import *

def get_validators_for_conge_and_department(idconge , val):
    congee = Conges.objects.filter(id=idconge).select_related('motif_abs', 'employes').first()
    
    if congee:
        validators = []
        arboresence_instance = congee.employes.arborescence.first()
        
        if arboresence_instance:
            if val == 1 :
               conges_instances = WorkflowConge.objects.filter(
                type_conge__id=congee.motif_abs.id,
                departement__id=arboresence_instance.id
                   ).prefetch_related('valideur_1')
            if val == 2 :
               conges_instances = WorkflowConge.objects.filter(
                type_conge__id=congee.motif_abs.id,
                departement__id=arboresence_instance.id
                   ).prefetch_related('valideur_2')
            if val == 3 :
               conges_instances = WorkflowConge.objects.filter(
                type_conge__id=congee.motif_abs.id,
                departement__id=arboresence_instance.id
                   ).prefetch_related('valideur_3')  
            if val == 4 :
               conges_instances = WorkflowConge.objects.filter(
                type_conge__id=congee.motif_abs.id,
                departement__id=arboresence_instance.id
                   ).prefetch_related('valideur_4')      
            for conge_instance in conges_instances:
                validators.extend(conge_instance.valideur_1.all())

            unique_validators = list(set(validators))
            if unique_validators:
                 email_list = [validator.email for validator in unique_validators]
                
                 for email in email_list:
                     print(email)
                 return email_list  
            else:
              return [] 

    return []