from zk import ZK, const
import psycopg2  # Utiliser psycopg2 pour PostgreSQL

conn = None
# Connexion à la base de données PostgreSQL
db = psycopg2.connect(
    host="192.168.1.113",
    user="root",
    password="root",
    dbname='ipstime'
)

mycursorbackup1 = db.cursor()

# Créer une instance ZK
zk = ZK("192.168.2.10", port=4370, timeout=25, force_udp=True, ommit_ping=False)

try:
    # Connexion à l'appareil
    conn = zk.connect()

    # Obtenir toutes les utilisateurs
    users = conn.get_users()
    # Obtenir les présences
    attendances = conn.get_attendance()

    for single in attendances:
        att = str(single).split()

        # Affiche le contenu de `att` pour comprendre la structure
        print(f"Contenu de att : {att}")
        print(f"Taille de att : {len(att)}")

        # Vérifier que la liste `att` contient au moins 5 éléments
        if len(att) > 4:
            # Si att[3] et att[4] existent
            pointagedate = att[3] + " " + att[4]
            
            # Vérification de la présence existante
            mycursorbackup1.execute("SELECT * FROM syspointage_pointage WHERE employes_id=%s AND date_pointage=%s", (att[1], pointagedate))
            print("SELECT * FROM syspointage_pointage WHERE employes_id=%s AND date_pointage=%s", (att[1], pointagedate))
            pointagedup1 = mycursorbackup1.fetchall()

            if mycursorbackup1.rowcount == 0:
                # Récupérer l'ID de la pointeuse à partir de la base de données
                mycursorbackup1.execute("SELECT id FROM syspointage_pointeuse WHERE adresse_ip = %s", ('192.168.2.10',))
                id_pointeuse_result = mycursorbackup1.fetchone()
                
                if id_pointeuse_result:  # Vérifier que l'ID a été trouvé
                    id_pointeuse = id_pointeuse_result[0]  # Récupérer l'ID
                    mycursorbackup1.execute("INSERT INTO syspointage_pointage (employes_id, date_pointage, pointeuse_id) VALUES (%s, %s, %s)", (att[1], pointagedate, id_pointeuse))  
                    print(f"INSERT INTO syspointage_pointage (employes_id, date_pointage, pointeuse_id) VALUES ({att[1]}, {pointagedate}, {id_pointeuse})")
                    db.commit()  # Valider les changements dans la base de données
                else:
                    print("Erreur: ID de la pointeuse non trouvé.")
        else:
            print("Erreur: Données insuffisantes dans `att` pour traiter cette présence.")
except Exception as e:
    print(e)
finally:
    if conn:
        conn.disconnect()  # Déconnecter de l'appareil
    if mycursorbackup1:
        mycursorbackup1.close()  # Fermer le curseur
    if db:
        db.close()  # Fermer la connexion à la base de données.
