# Define the two lists
import psycopg2

# File path for your Excel file
file_path = '/home/srv-pointage/projet/book1.xlsx'

# PostgreSQL connection details
conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)

cur = conn.cursor()

finallist = [
    "RESPONSABLE INGENIERIE",
    "Fire W",
    "INGENIEUR METHODE",
    "HR ADMINISTRATION",
    "Specialist flux coupe",
    "RESPONSABLE PRODUCTION",
    "INGENIEUR QUALITE",
    "Directeur Général",
    "Plannificateur",
    "RESPONSABLE APPROVISIONNEMENT",
    "Manager LOGISTIQUE",
    "RESPONSABLE LOGISTIQUE",
    "COORDINATEUR LOGISTIQUE",
    "MANITENTIONNAIRE",
    "FORMATRICE DE PRODUCTION",
    "COORDINATEUR PRODUCTION",
    "APPROVISIONNEUR-COORDINATEUR LOGISTIQUE",
    "RESPONSABLE MAGASIN"
]

shorter_list = [
    "INFERMIERE",
    "RESP COMPTA & FINANCE",
    "Directeur Général",
    "INVENTORISTE",
    "ERP MASTER DATA",
    "Training Specialist",
    "Ingénieur qualité",
    "TECHNICIEN MAINTENANCE",
    "RESPONSABLE PRODUCTION",
    "Couturière",
    "SUPERVISEUR MAINTENANCE",
    "Manager LOGISTIQUE",
    "JIT Operator",
    "RESPONSABLE INGENIERIE",
    "Technicien CAO",
    "COORDINATEUR QUALITE",
    "TECHNICIEN",
    "INGENIEUR QUALITE",
    "INGENIEUR METHODE",
    "RESPONSABLE QUALITE",
    "Alimentatrice",
    "Superviseur production",
    "Team leader",
    "RESPONSABLE APPROVISIONNEMENT",
    "Approvisionneur",
    "TECHNICIEN CAO & Méthodes",
    "Specialist flux coupe",
    "Fire W",
    "INGENIEUR INDUSTRIALISATION",
    "AMELIORATION CONTENUE",
    "Assistant industriel",
    "Manager Production",
    "Responsable de production",
    "Technicien logistique",
    "Opérateur logistique",
    "Superviseur logistique",
    "Responsable qualité logistique"
]

longer_list = [
    "Approvisionneur",
    "Contrôle Qualité",
    "RESPONSABLE RESSOURCES HUMAINES",
    "JIT Operator",
    "MANAGER QUALITE",
    "Team leader",
    "INGENIEUR PROCESS",
    "SUPERVISEUR DE PRODUCTION",
    "INGENIEUR FLYX LOGISTIQUE",
    "COORDINATEUR QUALITE",
    "Appolo",
    "CAMPO",
    "INGENIEUR QUALITE SYSTEM & FOURNISSUER",
    "WIRE",
    "AMELIORATION CONTENUE",
    "TECHNICIEN MAINTENANCE",
    "Auditrice",
    "Prép CAMPO",
    "RESP PLANIFICATION & APPROVISIONNEMENT",
    "APPROVISIONNEUR LOGISTIQUE",
    "SUPERVISEUR MAINTENANCE",
    "TECHNICIEN CAO & Méthodes",
    "HR MANAGER",
    "TECHNICIEN CAO",
    "Alimentatrice TAGLIO",
    "RESPONSABLE DE PRODUCTION",
    "RESPONSABLE COUPE",
    "INGENIEUR QUALITE PROJET/ CLIENT",
    "Alimentatrice LIGNE",
    "TECHNICIEN MACHINE A COUDRE",
    "Training Specialist",
    "ERP MASTER DATA",
    "prép CAMPO",
    "Superviseur production",
    "Planificateur",
    "Ingénieur qualité",
    "RESPONSABLE QUALITE",
    "INGENIEUR INDUSTRIALISATION",
    "alimentatrice",
    "RESPONSABLE INGENIERIE",
    "NULL",
    "RESP COMPTA & FINANCE",
    "Contrôleur de Gestion",
    "Technicien Transport",
    "INFERMIERE",
    "Aide soignante",
    "COUPEUR",
    "COORDINATRICE LOGISTIQUE",
    "OPERATRICE SUR MACHINE AUTOMATIQUE",
    "CSL",
    "Technicien CAO",
    "Contrôle qualité",
    "TECHNICIEN",
    "CHARGE CAO",
    "Ordonnanceur coupe",
    "INVENTORISTE",
    "INGENIEUR IT",
    "MAGASINIER",
    "TECHNICIEN INFORMATIQUE",
    "Alimentatrice",
    "RESPONSABLE MAINTENANCE",
    "CHEF DE PROJET",
    "Coupeur",
    "Responsable service client",
    "Contrôle qualité",
    "CAMPO",
    "WIRE",
    "COUPEUR",
    "CSL",
    "Prép CAMPO"
]

# Find elements in the first list that are not in the second
unique_to_shorter = [role for role in longer_list if role not in shorter_list]
sss = set(longer_list) - set(shorter_list)
print(sss)
for element in finallist : 
   zou= f"""INSERT INTO syspointage_role (
    "rolename", "rh", "DRH", "view_conge", "view_employé", "modifier_employé", "delete_employé",
    "view_departements", "view_departements_edit", "view_departements_del", "view_espacepdg",
    "view_contrats", "contratsedit", "contartdelete", "view_pointeuse", "pointeuseedit",
    "pointeusedelete", "view_horaire", "horaireedit", "horairedelete", "view_absence",
    "absenceedit", "absencedelete", "view_planing", "planningedit", "planningdelete",
    "view_Sites", "Sitesedit", "Sitesdelete", "view_pointage", "pointageedit",
    "pointagedelete", "view_demanderh", "demanderhedit", "demanderhdelete",
    "view_demandeaut", "demandeautedit", "demandeautdelete", "view_rapports",
    "view_mouchard", "view_historique", "view_teletravail", "view_autorisation",
    "view_mission", "view_employe_rh", "view_dep_rh", "view_contrat_rh", "view_horaire_rh",
    "view_planinng_rh", "view_abscence_rh", "view_historique_rh", "viewlistcontrats_admin",
    "viewlistcontrats_rh", "viewlistTeletravail_drh", "viewdirecteur", "affectationopause",
    "accuiel", "directionoperations", "wfm"
) VALUES

('{str(element)}', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
 FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
 FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
 FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
 FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE) ;"""
   cur.execute(zou)

    # Commit the changes to the database
   conn.commit()
