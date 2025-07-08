import psycopg2

# Connexion PostgreSQL
conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)

cur = conn.cursor()

# Ajouter la colonne matricule_p si elle n'existe pas déjà
cur.execute("""
    ALTER TABLE syspointage_newuser
    ADD COLUMN IF NOT EXISTS matricule_p VARCHAR;
""")
conn.commit()

# Récupérer les matricules existants
cur.execute('SELECT id, matricule FROM syspointage_newuser WHERE matricule IS NOT NULL')
rows = cur.fetchall()

for row in rows:
    user_id, matricule = row
    # Supprimer les zéros en début
    original_matricule = matricule.lstrip('0') if matricule else None

    # Pour éviter les valeurs vides
    if not original_matricule:
        continue

    # Mettre à jour la colonne matricule_p
    update_query = """
        UPDATE syspointage_newuser
        SET matricule_p = %s
        WHERE id = %s;
    """
    cur.execute(update_query, (original_matricule, user_id))
    conn.commit()

cur.close()
conn.close()

print("✅ Script terminé : 'matricule_p' mis à jour avec les matricules d'origine.")
