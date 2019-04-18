import psycopg2
import json
from os import urandom
from helpers import *


# For debugging, password is simply 'password'
# Change method name to something else

def db_insert_user(display_name, email, password):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """insert into users values(%s, %s, %s, %s, %s, %s)"""

        p_salt = urandom(32)
        p_hash = generate_p_hash(password, p_salt)
        user_id = generate_user_id()

        cur.execute(sql, (display_name, email, p_salt, p_hash, None, user_id))
        cur.close()
        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_verify_user(email, password):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select p_salt, p_hash from users where email = %s"""

        cur.execute(sql, (email,))
        row = cur.fetchone()

        if row is None:
            return False

        auth_status = verify_user(row, password)

        if auth_status:
            time_now = get_current_time()

            sql = """select user_id from users where email = %s"""
            cur.execute(sql, (email,))
            user_id = cur.fetchone()[0]

            sql = """insert into active_sessions values (%s, %s)"""
            cur.execute(sql, (user_id, time_now,))
            cur.close()
            return user_id

        else:
            cur.close()
            return False

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return False

    finally:
        disconnect_db(conn)


def db_logout_user(token):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """delete from active_sessions
                where user_id = %s"""
        cur.execute(sql, (token,))
        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_users_list():
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select display_name, email from users"""

        cur.execute(sql)
        db_users = cur.fetchall()

        json_keys = ['display_name', 'email']
        users = convert_to_json(json_keys, db_users)

        cur.close()
        return users

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    finally:
        disconnect_db(conn)


# Need to capture errors
def db_create_group(group_name, group_admin, description):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_for_count = """select count(*) from quiz_groups"""
        cur.execute(sql_for_count)
        count = cur.fetchone()[0]

        sql = """insert into quiz_groups values (%s, %s, %s, %s)"""

        cur.execute(sql, (group_name, group_admin, count + 1, description,))
        cur.close()
        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    finally:
        disconnect_db(conn)


def db_send_invite(user_email, group_id, token):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_user_id = """select u.user_id from users u
                            where u.email = %s
                            and u.user_id != %s"""
        cur.execute(sql_get_user_id, (user_email, token,))
        user_id = cur.fetchone()
        time_now = get_current_time()

        sql_insert_invite = """insert into invites values (%s, %s, %s)"""
        cur.execute(sql_insert_invite, (user_id, group_id, time_now,))
        cur.close()
        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_send_request(user_id, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        time_now = get_current_time()
        sql = """insert into requests values (%s, %s, %s)"""

        cur.execute(sql, (user_id, group_id, time_now,))
        cur.close()
        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_my_invites(token):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select q.group_name, q.group_desc, i.group_id, i.invite_timestamp
                from invites i, quiz_groups q
                where i.group_id = q.group_id
                and i.user_id = %s
                order by i.invite_timestamp desc"""

        cur.execute(sql, (token,))
        db_invites = cur.fetchall()

        json_keys = ['group_name', 'group_desc', 'group_id', 'timestamp']
        invites = convert_to_json(json_keys, db_invites)

        cur.close()
        if len(invites) != 0:
            return invites

        else:
            return False

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_my_group_requests(token):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select u.display_name, u.email, r.request_timestamp,
                r.group_id, q.group_name
                from users u, requests r, quiz_groups q
                where q.group_admin = %s
                and u.user_id = r.user_id
                and q.group_id = r.group_id"""

        cur.execute(sql, (token,))
        db_requests = cur.fetchall()

        json_keys = ['user_dname', 'user_email',
                     'timestamp', 'group_id', 'for_group']
        requests = convert_to_json(json_keys, db_requests)

        if len(requests) != 0:
            return requests

        cur.close()
        return False

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


# Delete from invites and requests both

def db_accept_invite(token, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_add_user = """insert into group_memberships values (%s, %s)"""
        cur.execute(sql_add_user, (token, group_id,))

        sql_remove_invite = """delete from invites
                                where user_id = %s
                                and group_id = %s"""
        cur.execute(sql_remove_invite, (token, group_id,))

        cur.close()
        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_accept_request(user_email, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_user_id = """select user_id from users
                            where email = %s"""
        cur.execute(sql_get_user_id, (user_email,))
        user_id = cur.fetchone()

        sql_add_to_group = """insert into group_memberships
                                values (%s, %s)"""
        cur.execute(sql_add_to_group, (user_id, group_id,))

        sql_remove_request = """delete from requests
                                where user_id = %s
                                and group_id = %s"""
        cur.execute(sql_remove_request, (user_id, group_id))

        cur.close()
        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_delete_invite(token, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """delete from invites
                where user_id = %s
                and group_id = %s"""
        cur.execute(sql, (token, group_id,))
        cur.close()

        return True

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_delete_request(email, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select user_id from users
                where email = %s"""
        cur.execute(sql, (email,))
        user_id = cur.fetchone()[0]

        sql = """delete from requests
                where user_id = %s
                and group_id = %s"""
        cur.execute(sql, (user_id, group_id,))
        cur.close()

        return True

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_my_groups(token):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_groups_ids = """select group_id
                                from group_memberships
                                where user_id = %s"""
        cur.execute(sql_get_groups_ids, (token,))
        db_group_ids = cur.fetchall()
        group_ids = get_group_ids(db_group_ids)

        sql = """select group_name, group_desc, num_of_members, group_admin
                from quiz_groups
                where group_id = any(%s::int[])
                or group_admin = %s"""
        cur.execute(sql, (group_ids, token,))
        db_rows = cur.fetchall()

        json_keys = ['group_name', 'group_desc', 'num_of_members', 'is_admin']
        groups = groups_convert_to_json(json_keys, db_rows, token)

        if len(groups) != 0:
            return groups

        cur.close()
        return False

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_create_quiz(quiz_name, quiz_desc, group_id, num_of_qs, avlbl_from, avlbl_to, is_visible):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        quiz_id = quiz_name + ":" + str(group_id)

        sql_create_quiz = """insert into quizzes
                        values(%s, %s, %s, %s, %s, %s, %s, %s)"""

        cur.execute(sql_create_quiz,
                    (quiz_name, quiz_desc, group_id,
                     num_of_qs, avlbl_from, avlbl_to, is_visible, quiz_id,))
        cur.close()
        return True

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_quiz(quiz_name, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_quiz = """select quiz_name, quiz_description, num_of_questions, available_to, quiz_id
                            from quizzes
                            where quiz_name = %s
                            and group_id = %s"""
        cur.execute(sql_get_quiz, (quiz_name, group_id,))
        db_rows = cur.fetchall()
        json_keys = ['quiz_name', 'quiz_desc', 'num_of_questions', 'available_to', 'quiz_id']

        quiz = convert_to_json(json_keys, db_rows)

        cur.close()
        return quiz

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_create_questions(questions, quiz_name, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_quiz = """select quiz_id
                            from quizzes
                            where quiz_name = %s
                            and group_id = %s"""
        cur.execute(sql_get_quiz, (quiz_name, group_id,))
        quiz_id = cur.fetchone()[0]

        sql = """insert into questions
                values (%s, %s, %s, %s, %s)"""

        for q in questions:
            q_text = q['question']
            q_answers = q['answers']
            correct_ans = q['correct_answer']
            q_id = q_text + ":" + str(quiz_id)
            cur.execute(sql, (q_text, quiz_id, json.dumps(q_answers), correct_ans, q_id,))

        cur.close()
        return True

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)
