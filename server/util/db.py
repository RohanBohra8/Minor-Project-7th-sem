import sqlite3

def init_db():
    conn = sqlite3.connect('session.db')
    c = conn.cursor()
    c.execute('''
    CREATE TABLE IF NOT EXISTS Session (
        session_id INTEGER  PRIMARY KEY AUTOINCREMENT,
        article_content TEXT
    )
    ''')
    conn.commit()
    # conn.close()

if __name__ == '__main__':
    init_db()
