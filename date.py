import pandas as pd
import psycopg2

# Chemin du fichier Excel
file_path = '/home/srv-pointage/projet/Classeur3.xlsx'

# Détails de connexion PostgreSQL
conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)

cur = conn.cursor()

# Charger le fichier Excel
data = pd.read_excel(file_path, header=None)

# Fonction pour gérer les valeurs NULL
def handle_null(value):
    return None if pd.isna(value) or value == '' else value

# Fonction pour convertir en entier
def handle_integer(value):
    try:
        return int(value) if str(value).isdigit() else None
    except (ValueError, TypeError):
        return None

# Fonction pour convertir les dates
def handle_date(value):
    try:
        return pd.to_datetime(value) if not pd.isna(value) else None
    except (ValueError, TypeError):
        return None

# Boucle sur chaque ligne du DataFrame
for index, row in data.iterrows():
    matricule = handle_null(row[1])  # 'Matricule' correspond à la colonne 1
    
    # Dates correspondantes avec les bons noms de colonnes
    datedemarrage = handle_date(row[13])  # Date d'embauche société
    date_titularisation = handle_date(row[14])  # Date pour titulariser
    date_depart_societe = handle_date(row[16])  # Date de départ société
    date_debut_contrat_cdd = handle_date(row[21])  # Date début contrat CDD
    date_fin_contrat_cdd = handle_date(row[22])  # Date fin contrat CDD
    date_debut_contrat_caip = handle_date(row[23])  # Date début contrat CAIP
    date_fin_contrat_caip = handle_date(row[24])  # Date fin contrat CAIP
    datedenaissance = handle_date(row[31])  # Date de naissance
    date_delivrance_cin = handle_date(row[37])  # Date de délivrance CIN
    prochaine_date_echelon = handle_date(row[45])  # Prochaine date d'échelon
    
    matricule_str = str(matricule)
    
    # Impression pour le débogage
    print(f"Matricule: {matricule}, Date embauche: {datedemarrage}, Date titularisation: {date_titularisation}")

    # Requête SQL pour mettre à jour les dates en fonction du matricule
    update_query = """
        UPDATE syspointage_newuser
        SET datedemarrage = %s, 
            date_titularisation = %s, 
            date_depart_societe = %s, 
            date_debut_contrat_cdd = %s, 
            date_fin_contrat_cdd = %s, 
            date_debut_contrat_caip = %s, 
            date_fin_contrat_caip = %s, 
            datedenaissance = %s, 
            date_delivrance_cin = %s, 
            prochaine_date_echelon = %s
        WHERE matricule = %s;
    """
    
    # Exécution de la requête
    cur.execute(update_query, (
        datedemarrage, date_titularisation, date_depart_societe, date_debut_contrat_cdd, date_fin_contrat_cdd, 
        date_debut_contrat_caip, date_fin_contrat_caip, datedenaissance, date_delivrance_cin, 
        prochaine_date_echelon, matricule_str
    ))

    # Validation de la transaction
    conn.commit()

# Fermeture de la connexion
cur.close()
conn.close()
