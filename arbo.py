import pandas as pd
import psycopg2

# File path for your Excel file
file_path = '/home/srv-pointage/projet/Classeur3.xlsx'

# PostgreSQL connection details
conn = psycopg2.connect(
    dbname='ipstime',
    user='root',
    password='root',
    host='192.168.1.113',
    port='5432'
)

cur = conn.cursor()

lissst = []
# Load Excel file without headers if they are not present
data = pd.read_excel(file_path, header=None)

# Function to handle NULL values for clean display
def handle_null(value):
    return None if pd.isna(value) or value == '' else value

# Function to convert active status to boolean
def convert_to_boolean(value):
    if value in ['si', 'yes', True, 1]:
        return True
    else:
        return False

# Loop over each row in the DataFrame
for index, row in data.iterrows():
    # Access data by column index (adjust these indices based on your file's structure)
    matricule = str(handle_null(row[1]))  # Convert to string if needed
    arborescence_name = handle_null(row[5])  # Assuming "arborescence" is in column 5
    
    # Retrieve the user ID from syspointage_newuser using matricule
    cur.execute("SELECT id FROM syspointage_newuser WHERE matricule = %s", (matricule,))
    newuser_id = cur.fetchone()
    
    if newuser_id is not None:
        newuser_id = newuser_id[0]  # Extract the user ID
    else:
        print(f"Warning: User with matricule '{matricule}' not found. Skipping insertion.")
        lissst.append(matricule)
        continue  # Skip this row if user not found

    # Retrieve the arborescence ID from syspointage_arborescence using arborescence_name
    cur.execute("SELECT id FROM syspointage_arborescence WHERE LOWER(nom) = LOWER(%s)", (arborescence_name,))
    arborescence_id = cur.fetchone()

    if arborescence_id is not None:
        arborescence_id = arborescence_id[0]  # Extract the arborescence ID
    else:
        print(f"Warning: Arborescence '{arborescence_name}' not found. Skipping insertion.")
        lissst.append(arborescence_name)
        continue  # Skip this row if arborescence not found

    # Prepare the INSERT statement with newuser_id and arborescence_id
    insert_query = """
    INSERT INTO syspointage_newuser_arborescence (newuser_id, arborescence_id)
    VALUES (%s, %s);
    """

    # Execute the insert statement
    cur.execute(insert_query, (newuser_id, arborescence_id))

    # Commit the changes to the database
    conn.commit()

# Close the connection
cur.close()
conn.close()

# Print any missing values
for i in set(lissst):
    print(i)
