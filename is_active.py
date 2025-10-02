import pandas as pd
import psycopg2

file_path = '/home/srv-pointage/projet/Classeur31.xlsx'

conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)
cur = conn.cursor()

data = pd.read_excel(file_path)

for index, row in data.iterrows():
    status = str(row['Actif/Inactif']).strip()
    matricule = row['Matricule']

    if pd.isna(matricule):
        print(f"⏭️ Ignoré : matricule NaN à la ligne {index+2}")
        continue

    matricule_str = str(matricule).strip()

    if matricule_str == "":
        print(f"⏭️ Ignoré : matricule vide à la ligne {index+2}")
        continue

    # Conversion du statut en booléen
    is_active = True if status.lower() == "si" else False

    print(f"✅ Mise à jour : matricule {matricule_str} -> is_active = {is_active}")

    update_query = """
        UPDATE syspointage_newuser
        SET is_active = %s
        WHERE matricule_p = %s;
    """
    cur.execute(update_query, (is_active, matricule_str))

conn.commit()
cur.close()
conn.close()

print("✅ Mise à jour terminée sans erreurs.")
