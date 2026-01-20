
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("--- Raw Game Data ---")
try:
    cursor.execute("SELECT title, average_rating FROM core_game")
    for row in cursor.fetchall():
        print(f"Title: {row[0]}, Rating: '{row[1]}' (Type: {type(row[1])})")
except Exception as e:
    print(f"Error: {e}")

conn.close()
