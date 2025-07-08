from django.contrib import admin 
from  django.contrib.auth.models  import  Group


from .models import *
from import_export.admin import ImportExportModelAdmin 
@admin.register(NewUser)
class UserAdminConfig(ImportExportModelAdmin):
   

    search_fields = ('matricule','email', 'user_name')
 

    pass
admin.register(NewUser) 
@admin.register(arborescence)
class ArboAdmin(ImportExportModelAdmin):
      search_fields = ('nom','parent', 'chef','rh')
      pass
admin.register(arborescence)
admin.site.register(role )   
      
admin.site.register(pointage)  
admin.site.register(pointeuse)  
admin.site.register(motif_abs) 
admin.site.register(absence) 

admin.site.register(plansemaine)   
admin.site.register(horairejour)   
admin.site.register(planning)   
admin.site.register(Conges)  