from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from db_opers import *


app = Flask(__name__)
CORS(app)


@app.route("/api/registration", methods=["POST"])
def register_user():
    display_name = request.form.get('display-name')
    email = request.form.get('email')
    password = request.form.get('password')

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
        resp = make_response('Success', 200)
        return resp


@app.route("/api/login", methods=["POST"])
def login():
    email = request.get_json()['email']
    password = request.get_json()['password']

    auth_status = db_verify_user(email, password)

    if auth_status is False:
        return make_response(jsonify('False'), 400)

    else:

        resp = make_response(jsonify(auth_status), 200)
        return resp


@app.route("/api/logout", methods=["DELETE"])
def logout():
    token = request.headers.get('Authorization')
    db_logout_user(token)
    resp = make_response('', 200)
    return resp


@app.route("/api/users", methods=["GET"])
def get_users():
    users = db_get_users_list()
    return jsonify(users)


# Need to capture errors
@app.route("/api/group_creation", methods=["POST"])
def create_group():
    group_name = request.form.get('group-name')
    token = request.headers.get('Authorization')
    group_desc = request.form.get('group-desc')

    create_group_status = db_create_group(group_name, token, group_desc)

    if create_group_status is True:
        return make_response("Success", 200)


@app.route("/api/invitation", methods=["POST"])
def send_invite():
    user_email = request.form.get('user-email')
    group_id = request.form.get('group-id')
    token = request.headers.get('Authorization')

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
        return make_response("Success", 200)


@app.route("/api/request_membership", methods=["POST"])
def send_request():
    group_id = request.form.get('group-id')
    user_id = request.headers.get('Authorization')

    request_status_code = db_send_request(user_id, group_id)

    if request_status_code == "23505":
        return make_response(jsonify(
            {'code: ': 505,
             'reason: ': 'Already requested to be added to this group.'
             }
        ), 400)

    elif request_status_code is True:
        return make_response("Success", 200)


@app.route("/api/my_invites", methods=["GET"])
def get_invites():
    token = request.headers.get('Authorization')

    invites = db_get_my_invites(token)

    if invites is False:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No invites found.'
             }
        ), 404)

    else:
        return make_response(jsonify(invites), 200)


@app.route("/api/my_requests", methods=["GET"])
def get_requests():
    token = request.headers.get('Authorization')

    requests = db_get_my_group_requests(token)

    if requests is False:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'No requests found.'
             }
        ), 404)

    else:
        return make_response(jsonify(requests), 200)


@app.route("/api/accept_invite", methods=["POST"])
def accept_invite():
    token = request.headers.get('Authorization')
    group_id = request.form.get('group-id')

    accept_status = db_accept_invite(token, group_id)

    return make_response(jsonify(accept_status), 200)


@app.route("/api/accept_request", methods=["POST"])
def accept_request():
    user_email = request.form.get('user-email')
    group_id = request.form.get('group-id')

    accept_status = db_accept_request(user_email, group_id)

    return make_response(jsonify(accept_status), 200)


@app.route("/api/delete_invite", methods=["DELETE"])
def delete_invite():
    token = request.headers.get('Authorization')
    group_id = request.form.get('group-id')

    delete_status = db_delete_invite(token, group_id)

    if delete_status is True:
        return make_response(jsonify(delete_status), 200)

    else:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'This invite most likely does not exist.'}
        ), 400)


@app.route("/api/delete_request", methods=["DELETE"])
def delete_request():
    email = request.form.get('email')
    group_id = request.form.get('group-id')

    delete_status = db_delete_request(email, group_id)

    if delete_status is True:
        return make_response(jsonify(delete_status), 200)

    else:
        return make_response(jsonify(
            {'code: ': 000,
             'reason: ': 'This group request most likely does not exist.'}
        ), 400)
