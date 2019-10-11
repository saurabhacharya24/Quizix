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

        sql = """insert into users values(%s, %s, %s, %s, %s)"""

        p_salt = urandom(32)
        p_hash = generate_p_hash(password, p_salt)
        user_id = generate_user_id()

        cur.execute(sql, (display_name, email, p_salt, p_hash, user_id))
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


def db_logout_user(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """delete from active_sessions
                where user_id = %s"""
        cur.execute(sql, (user_id,))
        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_users_list(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select display_name, email from users where user_id != %s"""

        cur.execute(sql, (user_id,))
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


def db_send_invite(user_email, group_id, user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_user_id = """select u.user_id from users u
                            where u.email = %s
                            and u.user_id != %s"""
        cur.execute(sql_get_user_id, (user_email, user_id,))
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


def db_get_my_invites(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select q.group_name, q.group_desc, i.group_id, i.invite_timestamp
                from invites i, quiz_groups q
                where i.group_id = q.group_id
                and i.user_id = %s
                order by i.invite_timestamp desc"""

        cur.execute(sql, (user_id,))
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


def db_get_my_group_requests(user_id):
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

        cur.execute(sql, (user_id,))
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

def db_accept_invite(user_id, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_add_user = """insert into group_memberships values (%s, %s)"""
        cur.execute(sql_add_user, (user_id, group_id,))

        sql_remove_invite = """delete from invites
                                where user_id = %s
                                and group_id = %s"""
        cur.execute(sql_remove_invite, (user_id, group_id,))

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


def db_delete_invite(user_id, group_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """delete from invites
                where user_id = %s
                and group_id = %s"""
        cur.execute(sql, (user_id, group_id,))
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


def db_get_my_groups(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_groups_ids = """select group_id
                                from group_memberships
                                where user_id = %s"""
        cur.execute(sql_get_groups_ids, (user_id,))
        db_group_ids = cur.fetchall()
        group_ids = get_group_ids(db_group_ids)

        sql = """select group_id, group_name, group_desc, num_of_members, group_admin
                from quiz_groups
                where group_id = any(%s::int[])
                or group_admin = %s"""
        cur.execute(sql, (group_ids, user_id,))
        db_rows = cur.fetchall()

        json_keys = ['group_id', 'group_name', 'group_desc', 'num_of_members', 'is_admin']
        groups = groups_convert_to_json(json_keys, db_rows, user_id)

        if len(groups) != 0:
            return groups

        cur.close()
        return False

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_create_quiz(quiz):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        q = quiz[0]

        quiz_name = q['quiz_name']
        quiz_desc = q['quiz_desc']
        group_id = q['group_id']
        num_of_qs = q['num_of_questions']
        avlbl_from = q['available_from']
        avlbl_to = q['available_to']
        is_visible = q['is_visible']
        quiz_id = quiz_name + ":" + str(group_id)
        review_date = q['review_date']

        sql_create_quiz = """insert into quizzes
                        values(%s, %s, %s, %s, %s, %s, %s, %s, %s)"""

        cur.execute(sql_create_quiz,
                    (quiz_name, quiz_desc, group_id,
                     num_of_qs, avlbl_from, avlbl_to, is_visible, quiz_id, review_date,))
        cur.close()
        return True

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


def db_rollback_quiz_creation(quiz_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """delete from questions where quiz_id = %s"""
        cur.execute(sql, (quiz_id,))
        sql = """delete from quizzes where quiz_id = %s"""
        cur.execute(sql, (quiz_id,))

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode


def db_get_quiz(quiz_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql_get_quiz = """select quiz_name, quiz_description, num_of_questions, available_to, quiz_id, review_date
                            from quizzes
                            where quiz_id = %s"""
        cur.execute(sql_get_quiz, (quiz_id,))
        db_rows = cur.fetchall()
        json_keys = ['quiz_name', 'quiz_desc', 'num_of_questions', 'available_to', 'quiz_id', 'review_date']

        quiz = convert_to_json(json_keys, db_rows)

        cur.close()
        return quiz

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_quiz_list(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        time_now = get_current_time_object()
        sql_quiz_list = """select q.quiz_name, q.quiz_description, q.quiz_id, g.group_name, q.available_to
                            from quizzes q, quiz_groups g
                            where q.group_id in (select group_id from group_memberships where user_id = %s)
                            and q.quiz_id not in (select quiz_id from completed_quizzes where user_id = %s)
                            and q.group_id = g.group_id
                            and q.is_visible = true
                            and timestamp %s > q.available_from and timestamp %s < q.available_to
                            order by q.available_to"""
        cur.execute(sql_quiz_list, (user_id, user_id, time_now, time_now,))
        quiz_list = cur.fetchall()

        json_keys = ['quiz_name', 'quiz_desc', 'quiz_id', 'group_name', 'available_to']
        quiz_list = convert_to_json(json_keys, quiz_list)

        cur.close()
        return quiz_list

    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_questions(quiz_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select question, answers_list
                from questions
                where quiz_id = %s"""
        cur.execute(sql, (quiz_id,))
        db_questions = cur.fetchall()

        json_keys = ['question', 'answers_list']
        questions = convert_to_json(json_keys, db_questions)

        cur.close()
        return questions

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_submit_quiz(user_id, quiz_id, user_answers, review_date):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select correct_answer from questions where quiz_id = %s"""
        cur.execute(sql, (quiz_id,))
        correct_answers = cur.fetchall()

        marks = 0
        answer_correctness = []

        for i in range(0, len(correct_answers)):
            if user_answers[i]['answer'] == correct_answers[i][0]:
                marks += 1
                answer_correctness.append(user_answers[i]['answer'])
            #     answer_correctness['ans' + str(i + 1)] = True
            else:
                answer_correctness.append(user_answers[i]['answer'])

        marks = str(marks) + '/' + str(len(correct_answers))

        sql = """insert into user_marks values(%s,%s,%s,%s,%s)"""
        cur.execute(sql, (user_id, quiz_id, json.dumps(answer_correctness), marks, review_date))

        sql = """insert into completed_quizzes values(%s,%s)"""
        cur.execute(sql, (user_id, quiz_id,))
        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_completed_quizzes(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select q.quiz_name, q.quiz_id, g.group_name, u.marks, q.review_date
                from quizzes q, quiz_groups g, user_marks u
                where q.quiz_id in (select quiz_id
                                    from completed_quizzes
                                    where user_id = %s)
                and q.quiz_id = u.quiz_id
                and q.group_id = g.group_id"""
        cur.execute(sql, (user_id,))
        completed_quizzes = cur.fetchall()

        json_keys = ['quiz_name', 'quiz_id', 'group_name', 'marks', 'review_date']
        json_quizzes = convert_to_json(json_keys, completed_quizzes)

        cur.close()
        return json_quizzes

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_review_quiz(user_id, quiz_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select question, answers_list, correct_answer
                from questions
                where quiz_id = %s"""
        cur.execute(sql, (quiz_id,))
        quiz_info = cur.fetchall()

        json_keys = ['ques', 'answers', 'correct_answer']
        json_quiz_info = convert_to_json(json_keys, quiz_info)

        ans_sql = """select answer_correctness
                    from user_marks
                    where user_id = %s
                    and quiz_id = %s"""
        cur.execute(ans_sql, (user_id, quiz_id,))
        ans_info = cur.fetchall()

        final_info = wrap_object('quiz', json_quiz_info)

        ans_keys = ['user_answers']
        json_ans_info = convert_to_json(ans_keys, ans_info)
        final_info['user_answers'] = json_ans_info

        cur.close()
        return final_info

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)


def db_get_groups_list(user_id):
    conn = None
    try:
        conn = connect_to_db()
        cur = conn.cursor()

        sql = """select distinct g.group_name, g.group_desc, g.group_id
                from quiz_groups g, group_memberships m
                where g.group_id not in ((select group_id
                                        from quiz_groups
                                        where group_admin = %s)
                                        union
                                        (select group_id
                                        from group_memberships
                                        where user_id = %s)
                                        union
                                        (select group_id
                                        from requests
                                        where user_id = %s))"""

        cur.execute(sql, (user_id, user_id, user_id, ))
        groups = cur.fetchall()

        json_keys = ['group_name', 'group_desc', 'group_id']
        json_groups = convert_to_json(json_keys, groups)

        return json_groups
        cur.close()

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        return error.pgcode

    finally:
        disconnect_db(conn)
