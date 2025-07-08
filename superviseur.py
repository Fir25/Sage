import pandas as pd
import psycopg2

# Chemin du fichier Excel
file_path = '/home/srv-pointage/projet/Book3.xlsx'

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

# Fonction pour normaliser les matricules
def normalize_matricule(matricule):
    if matricule is None:
        return None
    matricule = str(matricule).strip()  # Supprimer les espaces
    if len(matricule) < 4:  # Si la longueur est inférieure à 4, ajouter des zéros devant
        matricule = matricule.zfill(4)
    return matricule

# Boucle sur chaque ligne du DataFrame
try:
    for index, row in data.iterrows():
        mat = handle_null(row[1])  # 'Nom' correspond à la colonne 3
        superviseur = handle_null(row[8])  # 'Superviseur' correspond à la colonne 8

        # Normaliser le matricule
        matricule = normalize_matricule(mat)

        # Vérifier les valeurs NULL
        if matricule is None:
            print(f"Attention : Matricule manquant à la ligne {index + 1}")
            continue
        if superviseur is None:
            print(f"Attention : Superviseur manquant pour le matricule {matricule}")
            continue

        # Impression pour le débogage
        print(f"Traitement : Matricule={matricule}, Superviseur={superviseur}")

        # Requête SQL pour mettre à jour le superviseur en fonction du matricule
        update_query = """
            UPDATE syspointage_newuser
            SET superviseur = %s
            WHERE matricule = %s;
        """
        # Exécution de la requête
        cur.execute(update_query, (superviseur, matricule))

    # Validation de la transaction
    conn.commit()
    print("Mise à jour terminée avec succès.")

    # Requête pour sélectionner les utilisateurs avec un superviseur spécifique
    yousef_query = """
        SELECT user_name FROM syspointage_newuser WHERE superviseur = %s;
    """
    cur.execute(yousef_query, ('YOUSSEF KHALOUI',))
    results = cur.fetchall()

    # Affichage des résultats
    print("Utilisateurs avec le superviseur 'YOUSS EF KHALOUI':")
    for row in results:
        print(row[0])

    # Requête pour compter les utilisateurs sans superviseur
    no_superviseur_query = """
        SELECT COUNT(*) FROM syspointage_newuser WHERE superviseur IS NULL OR superviseur = '';
    """
    cur.execute(no_superviseur_query)
    no_superviseur_count = cur.fetchone()[0]

    # Affichage du nombre d'utilisateurs sans superviseur
    print(f"Nombre d'utilisateurs sans superviseur : {no_superviseur_count}")

except Exception as e:
    print(f"Une erreur s'est produite : {e}")
    conn.rollback()  # Annuler la transaction en cas d'erreur
finally:
    # Fermeture de la connexion
    cur.close()
    conn.close()