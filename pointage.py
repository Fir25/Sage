from zk import ZK, const
import psycopg2

# Connexion à la base de données PostgreSQL
server_ip = '192.168.1.113'  # Remplacez par l'adresse IP de votre serveur PostgreSQL
db_name = 'ipstime'           # Remplacez par votre nom de base de données
username = 'root'             # Nom d'utilisateur PostgreSQL
password = 'root'             # Mot de passe PostgreSQL

# Établir la connexion à PostgreSQL
conn = psycopg2.connect(
    dbname=db_name,
    user=username,
    password=password,
    host=server_ip,
    port='5432'  # Port par défaut pour PostgreSQL
)
cursor = conn.cursor()

# Requête pour obtenir les pointeurs
sqlpointeuse = "SELECT adresse_ip, port, id FROM syspointage_pointeuse"
cursor.execute(sqlpointeuse)
resultp = cursor.fetchall()

for pointeuse in resultp:
    zk = ZK(pointeuse[0], port=int(pointeuse[1]), timeout=65, force_udp=False, ommit_ping=True)
    try:
        # Connexion au périphérique
        conn_device = zk.connect()

        # Récupération des utilisateurs et des pointages
        attendances = conn_device.get_attendance()
        print(attendances)

        for single in attendances:
            att = str(single).split()
            if att[3] and att[4]:
                pointagedate = att[3] + " " + att[4]
                print(pointagedate + " " + att[1])
                
                # Vérification de l'existence de l'utilisateur dans la base de données
                sqlinsertemp = f"SELECT id FROM syspointage_newuser WHERE matricule = %s"
                cursor.execute(sqlinsertemp, (att[1],))
                results = cursor.fetchone()  # Récupération d'une seule ligne

                if results: 
                    user_id = results[0]  # Récupérer l'ID de l'utilisateur
                    sqlpoinatge = f"""
                        SELECT * FROM syspointage_pointage 
                        WHERE date_pointage = %s 
                        AND employes_id = %s
                    """
                    cursor.execute(sqlpoinatge, (pointagedate, user_id))
                    resultpoinatge = cursor.fetchone()  # Vérification d'une seule ligne
                    
                    if not resultpoinatge:  
                        sql_insert = """
                            INSERT INTO syspointage_pointage (date_pointage, employes_id, pointeuse_id) 
                            VALUES (%s, %s, %s)
                        """
                        print(sql_insert)
                        cursor.execute(sql_insert, (pointagedate, user_id, pointeuse[2]))
                        conn.commit()

    except Exception as e:
        print(e)
    finally:
        if conn_device:
            conn_device.disconnect()

# Fermeture de la connexion à PostgreSQL
cursor.close()
conn.close()
