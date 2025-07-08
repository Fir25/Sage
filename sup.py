import pandas as pd
import psycopg2

# File path de ton fichier Excel
file_path = '/home/srv-pointage/projet/Classeur31.xlsx'

# Connexion à PostgreSQL
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

# Fonction pour gérer les valeurs NULL et assurer une conversion en string
def handle_null(value):
    return str(value).strip() if pd.notna(value) and value != '' else None

# Parcourir chaque ligne du fichier Excel
for index, row in data.iterrows():
    matricule = handle_null(row[1])  # Supposons que la colonne 1 contient le matricule
    superviseur = handle_null(row[8])  # Supposons que la colonne 8 contient le superviseur

    # Vérifier que les valeurs ne sont pas vides
    if matricule and superviseur:
        update_query = """
        UPDATE syspointage_newuser
        SET superviseur = %s
        WHERE matricule = %s ;
        """

        # Exécuter la mise à jour
        cur.execute(update_query, (superviseur, matricule))
        conn.commit()

        # Afficher les informations sur la mise à jour effectuée
        print(f"Updated superviseur for matricule {matricule}: {superviseur}")
    else:
        # Afficher les valeurs manquantes pour identifier les problèmes
        print(f"Skipping row {index} due to missing matricule or superviseur.")
        print(f"Row {index}: matricule={matricule}, superviseur={superviseur}")

# Fermer la connexion
cur.close()
conn.close()
