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
    role = str(row['Poste Occupé']).strip()   # ✅ conversion en string
    matricule = row['Matricule']

    if pd.isna(matricule):
        print(f"⏭️ Ignoré : matricule NaN à la ligne {index+2}")
        continue

    matricule_str = str(matricule).strip()

    if matricule_str == "":
        print(f"⏭️ Ignoré : matricule vide à la ligne {index+2}")
        continue

    print(f"✅ Mise à jour : matricule {matricule_str} -> role: {role}")

    update_query = """
        UPDATE syspointage_newuser AS u
        SET role_id = l.id
        FROM syspointage_role AS l
        WHERE l.rolename = %s AND u.matricule_p = %s;
    """

    cur.execute(update_query, (role, matricule_str))


conn.commit()
cur.close()
conn.close()

print("✅ Mise à jour terminée sans erreurs.")
