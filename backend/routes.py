from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from db_opers import *


app = Flask(__name__)
CORS(app)


@app.route("/api/registration", methods=["POST"])
def register_user():
    display_name = request.get_json()['display_name']
    email = request.get_json()['email']
    password = request.get_json()['password']

    status = db_insert_user(display_name, email, password)

    if status == "23514":
        return make_response(jsonify(
            {'code: ': 514,
             'reason: ': 'Display name must be > 5 characters.'
             },
        ), 400)

    elif status == "23505":
        return make_response(jsonify(
            {'code: ': 505,
             'reason: ': 'Email already exists.'
             },
        ), 400)

    else:
        resp = make_response(jsonify(True), 200)
        return resp


@app.route("/api/login", methods=["POST"])
def login():
    email = request.get_json()['email']
    password = request.get_json()['password']

    auth_status = db_verify_user(email, password)

    if auth_status is False:
        return make_response(jsonify(False), 400)

    else:
        resp = make_response(jsonify('true'), 200)
        resp.set_cookie('token', auth_status, httponly=True)
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp


@app.route("/api/logout", methods=["DELETE"])
def logout():
    token = request.cookies.get('token')
    db_logout_user(token)
    resp = make_response(jsonify('true'), 200)
    resp.set_cookie('token', '', httponly=True, expires=0)
    return resp


@app.route("/api/users", methods=["GET"])
def get_users():
    users = db_get_users_list()
    return jsonify(users)


@app.route("/api/group_creation", methods=["POST"])
def create_group():
    group_name = request.get_json()['group_name']
    group_desc = request.get_json()['group_desc']
    token = request.cookies.get('token')

    create_group_status = db_create_group(group_name, token, group_desc)

    if create_group_status is True:
        return make_response(jsonify(True), 200)

    else:
        return make_response(jsonify(
            {'code: ': 502,
             'reason: ': 'Group name/group description cannot be empty.'
             }
        ), 400)


@app.route("/api/invitation", methods=["POST"])
def send_invite():
    user_email = request.get_json()['user_email']
    group_id = request.get_json()['group_id']
    token = request.cookies.get('token')

    invite_status_code = db_send_invite(user_email, group_id, token)

    if invite_status_code == "23502":
        return make_response(jsonify(
            {'code: ': 502,
             'reason: ': 'Cannot invite group admin into his own group.'
             }
        ), 400)

    elif invite_status_code == "23505":
        return make_response(jsonify(
            {'code: ': 505,
             'reason: ': 'Already invited user to this group.'
             }
        ), 400)

    else:
        return make_response(jsonify(True), 200)


@app.route("/api/request_membership", methods=["POST"])
def send_request():
    group_id = request.get_json()['group_id']
    user_id = request.cookies.get('token')

    request_status_code = db_send_request(user_id, group_id)

    if request_status_code == "23505":
        return make_response(jsonify(
            {'code: ': 505,
             'reason: ': 'Already requested to be added to this group.'
             }
        ), 200)

    elif request_status_code is True:
        return make_response(jsonify(True), 200)


@app.route("/api/my_invites", methods=["GET"])
def get_invites():
    token = request.cookies.get('token')

    invites = db_get_my_invites(token)

    if invites is False:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No invites found.'
             }
        ), 200)

    else:
        return make_response(jsonify(invites), 200)


@app.route("/api/my_requests", methods=["GET"])
def get_requests():
    token = request.cookies.get('token')

    requests = db_get_my_group_requests(token)

    if requests is False:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No requests found.'
             }
        ), 200)

    else:
        return make_response(jsonify(requests), 200)


@app.route("/api/accept_invite", methods=["POST"])
def accept_invite():
    group_id = request.get_json()['group_id']
    token = request.cookies.get('token')

    accept_status = db_accept_invite(token, group_id)

    return make_response(jsonify(accept_status), 200)


@app.route("/api/accept_request", methods=["POST"])
def accept_request():
    user_email = request.get_json()['user_email']
    group_id = request.get_json()['group_id']

    accept_status = db_accept_request(user_email, group_id)

    return make_response(jsonify(accept_status), 200)


@app.route("/api/delete_invite", methods=["DELETE"])
def delete_invite():
    group_id = request.args.get('group_id')
    token = request.cookies.get('token')

    delete_status = db_delete_invite(token, group_id)

    if delete_status is True:
        return make_response(jsonify(delete_status), 200)

    else:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'This invite most likely does not exist.'}
        ), 200)


@app.route("/api/delete_request", methods=["DELETE"])
def delete_request():
    email = request.args.get('email')
    group_id = request.args.get('group_id')

    delete_status = db_delete_request(email, group_id)

    if delete_status is True:
        return make_response(jsonify(delete_status), 200)

    else:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'This group request most likely does not exist.'}
        ), 200)


@app.route("/api/groups", methods=["GET"])
def get_my_groups():
    token = request.cookies.get('token')

    groups = db_get_my_groups(token)

    if groups is False:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No groups found.'
             }
        ), 200)

    else:
        return make_response(jsonify(groups), 200)


@app.route("/api/quiz", methods=["GET", "POST"])
def quiz():
    if request.method == "POST":
        quiz = request.get_json()['quiz']

        status = db_create_quiz(quiz)

        if status is True:
            questions = quiz[0]['question_list']
            quiz_name = quiz[0]['quiz_name']
            group_id = quiz[0]['group_id']
            q_status = db_create_questions(questions, quiz_name, group_id)

            if q_status is True:
                return make_response(jsonify(True), 200)
            elif q_status == "23505":
                quiz_id = quiz[0]['quiz_name'] + ":" + str(quiz[0]['group_id'])
                db_rollback_quiz_creation(quiz_id)
                return make_response(jsonify('Question already exists.'), 400)

        elif status == "23505":
            return make_response(jsonify('A Quiz with that name already exists.'), 400)

    elif request.method == "GET":
        quiz_name = request.get_json()['quiz_name']
        group_id = request.get_json()['group_id']

        quiz = db_get_quiz(quiz_name, group_id)
        return make_response(jsonify(quiz), 200)


@app.route("/api/quiz_list", methods=["GET"])
def quiz_list():
    user_id = request.cookies.get('token')

    quiz_list = db_quiz_list(user_id)

    if len(quiz_list) != 0:
        return make_response(jsonify(quiz_list), 200)

    else:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No groups found.'
             }
        ), 200)


@app.route("/api/questions", methods=["GET"])
def questions():
    quiz_id = request.get_json()['quiz_id']

    questions = db_get_questions(quiz_id)

    if len(questions) != 0:
        return make_response(jsonify(questions), 200)

    else:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No questions found.'
             }
        ), 200)
