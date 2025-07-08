from zk import ZK, const
import psycopg2

# Connexion à PostgreSQL
db = psycopg2.connect(
    host="192.168.1.113",
    user="root",
    password="root",
    dbname='ipstime'
)
cursor = db.cursor()

# Supposons que vous avez récupéré les informations des pointeuses directement dans PostgreSQL
sqlpointeuse = "SELECT adresse_ip, port, id FROM syspointage_pointeuse"
cursor.execute(sqlpointeuse)
resultp = cursor.fetchall()

# Boucle sur chaque pointeuse
for pointeuse in resultp:
    zk = ZK(pointeuse[0], port=int(pointeuse[1]), timeout=65, force_udp=False, ommit_ping=True)
    conn = None

    try:
        # Connexion au dispositif
        conn = zk.connect()

        # Récupération des pointages
        attendances = conn.get_attendance()
        for single in attendances:
            att = str(single).split()

            if att[3] and att[4]:
                pointagedate = att[3] + " " + att[4]
                matricule = att[1]

                # Recherche de l'employé par matricule
                sqlinsertemp = "SELECT id FROM syspointage_newuser WHERE matricule = %s"
                cursor.execute(sqlinsertemp, (matricule,))
                results = cursor.fetchall()

                if results:
                    # Vérification de la présence d'un pointage existant
                    sqlpoinatge = """
                        SELECT * FROM syspointage_pointage
                        WHERE date_pointage = %s
                        AND employes_id = (SELECT id FROM syspointage_newuser WHERE matricule = %s)
                    """
                    cursor.execute(sqlpoinatge, (pointagedate, matricule))
                    resultpoinatge = cursor.fetchall()

                    if not resultpoinatge:
                        # Insertion du pointage si aucun enregistrement n'existe déjà
                        sql_insert = """
                            INSERT INTO syspointage_pointage (date_pointage, employes_id, pointeuse_id)
                            VALUES (%s, (SELECT id FROM syspointage_newuser WHERE matricule = %s), %s)
                        """
                        cursor.execute(sql_insert, (pointagedate, matricule, pointeuse[2]))
                        db.commit()
                        print(f"Pointage inséré pour la date {pointagedate} et matricule {matricule}")

    except Exception as e:
        print(e)

    finally:
        # Déconnexion du dispositif ZK
        if conn:
            conn.disconnect()

# Fermer la connexion à PostgreSQL
cursor.close()
db.close()
