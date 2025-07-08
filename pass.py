import psycopg2
from passlib.hash import pbkdf2_sha256

# Détails de connexion PostgreSQL
conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)

cur = conn.cursor()

# Fonction pour gérer les valeurs NULL
def handle_null(value):
    return None if value is None or value == '' else value

# Fonction pour formater le matricule avec des zéros
def format_string(input_string):
    """
    Cette fonction formate une chaîne pour qu'elle ait une longueur de 4 caractères.
    Si la chaîne est plus courte, elle ajoute des zéros au début.
    """
    input_string = str(input_string)  # S'assurer que la valeur est une chaîne
    return input_string.zfill(4) if input_string.isdigit() else input_string

# Charger les matricules de la base de données
select_query = "SELECT matricule FROM syspointage_newuser;"
cur.execute(select_query)

# Récupérer tous les matricules
rows = cur.fetchall()

# Mise à jour des mots de passe
for row in rows:
    matricule = handle_null(row[0])  # Le matricule
    if matricule:
        # Formater le matricule pour générer un mot de passe
        password_plain = format_string(matricule)

        # Générer le mot de passe chiffré
        password_hashed = pbkdf2_sha256.hash(password_plain)

        # Mise à jour du champ password
        update_query = """
            UPDATE syspointage_newuser
            SET password = %s
            WHERE matricule = %s;
        """
        cur.execute(update_query, (password_hashed, matricule))

        # Impression pour le débogage
        print(f"Matricule : {matricule}, Mot de passe chiffré : {password_hashed}")

# Validation des modifications
conn.commit()

# Fermeture de la connexion
cur.close()
conn.close()
