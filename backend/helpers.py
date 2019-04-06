from passlib.hash import pbkdf2_sha256
from os import urandom
import uuid
import psycopg2
import pytz
from config import config
from datetime import datetime


def connect_to_db():
    params = config()
    conn = psycopg2.connect(**params)
    conn.autocommit = True
    return conn


def disconnect_db(conn):
    if conn is not None:
        conn.close()
        print("Database connection closed.")


# Maybe return to UTC time and convert it to Aus time in frontend.
def get_current_time():
    tz = pytz.timezone('Australia/Sydney')
    time_now = datetime.now(tz).strftime('%Y-%m-%d %H:%M:%S')
    return time_now


def generate_p_hash(password):
    p_salt = urandom(32)
    p_hash = pbkdf2_sha256.using(salt=p_salt).hash(password)
    return p_hash


def generate_user_id():
    user_id = str(uuid.uuid4())
    return user_id


def verify_user(db_row, password):
    p_salt_in_db = db_row[0]
    p_salt_in_db = p_salt_in_db.encode('utf-8')
    p_hash_in_db = db_row[1]

    auth_status = pbkdf2_sha256.using(
        salt=b'p_salt_in_db').verify(password, p_hash_in_db)

    return auth_status


def convert_to_json(json_keys, db_rows):
    json_data = []

    for i in range(0, len(db_rows)):
        temp = {}
        for j in range(0, len(json_keys)):
            temp[json_keys[j]] = db_rows[i][j]
        json_data.append(temp)

    return json_data


def get_group_ids(db_group_ids):
    group_ids = []
    for i in db_group_ids:
        group_ids.append(i[0])

    s = '{'
    for i in range(0, len(group_ids)):
        if i == len(group_ids) - 1:
            s = s + str(group_ids[i])
        else:
            s = s + str(group_ids[i]) + ','
    s = s + '}'

    return s


def groups_convert_to_json(json_keys, db_rows, token):
    json_data = []

    for i in range(0, len(db_rows)):
        temp = {}
        for j in range(0, len(json_keys)):
            if json_keys[j] == 'is_admin':
                if db_rows[i][j] == token:
                    temp[json_keys[j]] = True
                else:
                    temp[json_keys[j]] = False
            else:
                temp[json_keys[j]] = db_rows[i][j]
        json_data.append(temp)

    return json_data
