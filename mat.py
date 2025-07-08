import pandas as pd
import psycopg2

# Chemin du fichier Excel
file_path = '/home/srv-pointage/projet/Classeur31.xlsx'

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

# Fonction pour formater le matricule avec des zéros
def format_string(input_string):
    """
    Cette fonction formate une chaîne pour qu'elle ait une longueur de 4 caractères.
    Si la chaîne est plus courte, elle ajoute des zéros au début.
    """
    input_string = str(input_string)  # S'assurer que la valeur est une chaîne
    return input_string.zfill(4) if input_string.isdigit() else input_string

# Boucle sur chaque ligne du DataFrame
for index, row in data.iterrows():
    matricule = handle_null(row[1])  # 'Matricule' correspond à la colonne 1
    
    # Appliquer le formatage pour ajouter des zéros si nécessaire
    matricule_formatted = format_string(matricule) if matricule else None

    # Impression pour le débogage
    print(f"Matricule: {matricule}, Matricule formaté : {matricule_formatted}")

    # Requête SQL pour mettre à jour le matricule formaté
    update_query = """
        UPDATE syspointage_newuser
        SET matricule = %s
        WHERE matricule = %s;
    """
    
    # Convertir le matricule (pour WHERE) en chaîne si nécessaire
    matricule_str = str(matricule) if matricule else None

    # Exécution de la requête
    cur.execute(update_query, (matricule_formatted, matricule_str))

    # Validation de la transaction
    conn.commit()

# Fermeture de la connexion
cur.close()
conn.close()
