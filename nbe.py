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

# Séparer les noms et prénoms


# Boucle sur chaque ligne du DataFrame
for index, row in data.iterrows():
    matricule = handle_null(row[1])  # 'Matricule' correspond à la colonne 1
    prenom = handle_null(row[4])
    nom = handle_null(row[3])
    

    # Impression pour le débogage
    print(f"Matricule: {matricule}, Prénom: {prenom}, Nom: {nom}, ")
    matricule_str = str(matricule)  
    # Requête SQL pour mettre à jour le prénom, nom et nbenfants en fonction du matricule
    update_query = """
        UPDATE syspointage_newuser
        SET  last_name = %s, user_name = %s
        WHERE matricule = %s;
    """
    
    # Exécution de la requête
    cur.execute(update_query, ( nom, prenom, matricule_str))

    # Validation de la transaction
    conn.commit()

# Fermeture de la connexion
cur.close()
conn.close()
