from zk import ZK, const
import pyodbc
conn = None

server_ip = '10.100.192.128'      # IP address of the server
db_name = 'ipstime'               # Replace with your database name
username = 'IP-SOFT'        # SQL Server username
password = 'pointage2024*'        # SQL Server password

# Create a connection string for SQL Server 2019
conn_str = (
    f"Driver={{ODBC Driver 17 for SQL Server}};"
    f"Server={server_ip};"
    f"Database={db_name};"
    f"UID={username};"
    f"PWD={password};"
)
cnxn = pyodbc.connect(conn_str)
cursor = cnxn.cursor()
sqlpointeuse = f"select adresse_ip , port , id from syspointage_pointeuse"
cursor.execute(sqlpointeuse)
resultp = cursor.fetchall()
for pointeuse in resultp :
 zk = ZK(pointeuse[0], port=int(pointeuse[1]), timeout=65, force_udp=False, ommit_ping=True)
 try:
    # connect to device
     conn = zk.connect()
 
     users = conn.get_users()
    #fingerprints
     attendances = conn.get_attendance()
     print(attendances)
     attendances = conn.get_attendance()
     for single in attendances :
             att= str(single).split()
            
             if att[3] and att[4] :

                pointagedate =att[3]+ " "+att[4]
            
                print(pointagedate+" "+att[1])
                sqlinsertemp = f"select id from syspointage_newuser where matricule = {att[1]}"
                cursor.execute(sqlinsertemp)
                results = cursor.fetchall()
                if  results : 
                 sqlpoinatge = f"select * from syspointage_pointage where date_pointage = '{pointagedate}' and employes_id = (select id from syspointage_newuser where matricule = {att[1]})  "                
                 cursor.execute(sqlpoinatge)
                 resultpoinatge = cursor.fetchall()
                 if not  resultpoinatge :  
                   sql_insert = f"INSERT INTO syspointage_pointage (date_pointage , employes_id , pointeuse_id) VALUES ( '{pointagedate}' , (select id from syspointage_newuser where matricule = {att[1]}), {str(pointeuse[2])})"
                   print(sql_insert)
                   cursor.execute(sql_insert)
                   cnxn.commit()

 except Exception as e:
      print (e)
 finally:
      if conn:
        #conn.clear_attendance()

        conn.disconnect()

from zk import ZK, const
import pyodbc
conn = None

server_ip = '10.100.192.128'      # IP address of the server
db_name = 'ipstime'               # Replace with your database name
username = 'IP-SOFT'        # SQL Server username
password = 'pointage2024*'        # SQL Server password

# Create a connection string for SQL Server 2019
conn_str = (
    f"Driver={{ODBC Driver 17 for SQL Server}};"
    f"Server={server_ip};"
    f"Database={db_name};"
    f"UID={username};"
    f"PWD={password};"
)
cnxn = pyodbc.connect(conn_str)
cursor = cnxn.cursor()
sqlpointeuse = f"select adresse_ip , port , id from syspointage_pointeuse"
cursor.execute(sqlpointeuse)
resultp = cursor.fetchall()
for pointeuse in resultp :
 zk = ZK(pointeuse[0], port=int(pointeuse[1]), timeout=65, force_udp=False, ommit_ping=True)
 try:
    # connect to device
     conn = zk.connect()
 
     users = conn.get_users()
    #fingerprints
     attendances = conn.get_attendance()
     print(attendances)
     attendances = conn.get_attendance()
     for single in attendances :
             att= str(single).split()
            
             if att[3] and att[4] :

                pointagedate =att[3]+ " "+att[4]
            
                print(pointagedate+" "+att[1])
                sqlinsertemp = f"select id from syspointage_newuser where matricule = {att[1]}"
                cursor.execute(sqlinsertemp)
                results = cursor.fetchall()
                if  results : 
                 sqlpoinatge = f"select * from syspointage_pointage where date_pointage = '{pointagedate}' and employes_id = (select id from syspointage_newuser where matricule = {att[1]})  "                
                 cursor.execute(sqlpoinatge)
                 resultpoinatge = cursor.fetchall()
                 if not  resultpoinatge :  
                   sql_insert = f"INSERT INTO syspointage_pointage (date_pointage , employes_id , pointeuse_id) VALUES ( '{pointagedate}' , (select id from syspointage_newuser where matricule = {att[1]}), {str(pointeuse[2])})"
                   print(sql_insert)
                   cursor.execute(sql_insert)
                   cnxn.commit()

 except Exception as e:
      print (e)
 finally:
      if conn:
        #conn.clear_attendance()

        conn.disconnect()
