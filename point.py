import pandas as pd
import psycopg2

# File path for your Excel file
file_path = '/home/srv-pointage/projet/Classeur3.xlsx'

# PostgreSQL connection details
conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)

cur = conn.cursor()

# Load Excel file without headers if they are not present
data = pd.read_excel(file_path, header=None)

# Function to handle NULL values for clean display
def handle_null(value):
    return None if pd.isna(value) or value == '' else value

# Function to handle integers
def handle_integer(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

# Function to convert to boolean
def convert_to_boolean(value):
    if isinstance(value, bool):
        return value
    if str(value).lower() in ['si', 'yes', 'true', '1']:
        return True
    return False

for index, row in data.iterrows():
    try:
        # Handling all necessary fields
        intitule_etablissement = handle_null(row[4])
        ligne_de_production = handle_null(row[7])
        superviseur = handle_null(row[8])
        poste = handle_null(row[9])
        type_de_travail = handle_null(row[10])
        categorie_sage_fc = handle_null(row[11])
        fonction_fiche_de_paie = handle_null(row[12])
        nbre_jours_restants_echeance = handle_integer(row[15])
        motifparti = handle_null(row[17])
        type_depart = handle_null(row[18])
        type_contrat = handle_null(row[19])
        statut = handle_null(row[20])
        premier_contrat_sage_tunisia = handle_null(row[25])
        mois_embauche = handle_null(row[26])
        annee_embauche = handle_null(row[27])
        annee_titularisation = handle_null(row[28])
        anciennete = handle_null(row[29])
        tranche_anciennete = handle_null(row[30])
        age = handle_null(row[32])
        tranche_age = handle_null(row[33])
        cnss = handle_null(row[34])
        Cle_cnss = handle_null(row[35])
        cin = handle_null(row[36])
        sex = handle_null(row[38]) or 'M'
        situation_social = handle_null(row[39])
        nbenfants = handle_null(row[40])
        niveau_scolaire = handle_null(row[41])
        categorie = handle_null(row[42])
        echelon = handle_null(row[43])
        prochaine_date_echelon = handle_null(row[44])
        type_salaire = handle_null(row[45])
        cout_h = handle_null(row[46])
        rib_banquaire = handle_null(row[47])
        banque = handle_null(row[48])
        rib_virement = handle_null(row[49])
        verif_nbr_rib = convert_to_boolean(handle_null(row[50]))
        adresse = handle_null(row[51])
        commune = handle_null(row[52])
        code_postale = handle_null(row[53])
        visite_medicale = convert_to_boolean(handle_null(row[54]))
        telephone_contact_fam = handle_null(row[56])
        bien_de_la_societe = handle_null(row[57])
        destination = handle_null(row[58])
        departement_bulletin = handle_null(row[59])

        # Add required fields that may cause issues with constraints
        password = handle_null(row.get('password', 'default_password'))  # Assuming there's no password column in the file
        is_staff = convert_to_boolean(row.get('is_staff', False))  # Default to False if not present

        # Prepare the INSERT statement
        insert_query = """
        INSERT INTO syspointage_newuser (intitule_etablissement, ligne_de_production, superviseur, poste, type_de_travail, 
        categorie_sage_fc, fonction_fiche_de_paie, nbre_jours_restants_echeance, type_depart, type_contrat, statut, 
        premier_contrat_sage_tunisia, mois_embauche, annee_embauche, annee_titularisation, anciennete, tranche_anciennete, 
        age, tranche_age, Cle_cnss, niveau_scolaire, categorie, echelon, prochaine_date_echelon, type_salaire, cout_h, 
        rib_banquaire, banque, rib_virement, verif_nbr_rib, adresse, commune, code_postale, visite_medicale, 
        telephone_contact_fam, bien_de_la_societe, destination, departement_bulletin, password, is_staff)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s);
        """
        print(f"Row {index}: {values}")  # Ajouter cette ligne avant `cur.execute`
        # Execute the insert statement
        cur.execute(insert_query, (
            intitule_etablissement, ligne_de_production, superviseur, poste, type_de_travail, categorie_sage_fc, 
            fonction_fiche_de_paie, nbre_jours_restants_echeance, type_depart, type_contrat, statut, premier_contrat_sage_tunisia, 
            mois_embauche, annee_embauche, annee_titularisation, anciennete, tranche_anciennete, age, tranche_age, Cle_cnss, 
            niveau_scolaire, categorie, echelon, prochaine_date_echelon, type_salaire, cout_h, rib_banquaire, banque, rib_virement, 
            verif_nbr_rib, adresse, commune, code_postale, visite_medicale, telephone_contact_fam, bien_de_la_societe, 
            destination, departement_bulletin, password, is_staff
        ))

        # Commit the changes to the database
        conn.commit()

    except Exception as e:
        # Rollback in case of an error and print detailed error
        conn.rollback()
        print(f"Error at row {index}: {e}")
        continue

# Close the connection
cur.close()
conn.close()
