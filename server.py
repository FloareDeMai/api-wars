from flask import Flask, render_template, redirect, request, url_for, abort, session, flash
import util_password
import database_manager
from flask import jsonify
from functools import wraps

app = Flask(__name__)
app.secret_key = 'alleluia'


def login_forbidden(func):
    @wraps(func)
    def wrap(*args, **kwargs):
        if 'id' not in session:
            return func(*args, **kwargs)
        else:
            flash(f"You are already logged with {session['username']} !")
            return redirect(url_for('index_page'))
    return wrap


def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


@app.route("/")
def index_page():
    return render_template("index-page.html")


@app.route("/registration")
def register_page():
    return render_template("register-page.html")


@app.route("/registration", methods=['POST'])
def register_page_post():
    new_user_obj = request.form.to_dict()
    hashed_password = util_password.generate_hash_password(request.form.get("password"))
    new_user_obj['password'] = hashed_password
    if database_manager.add_user(new_user_obj) is False:
        flash('Username already exists, please choose another one!')
        return redirect(url_for("register_page"))

    database_manager.add_user(new_user_obj)
    flash("Successful registration. Log in to continue.")
    return redirect(url_for('login_page'))


@app.route("/login")
@login_forbidden
def login_page():
    return render_template("login.html")


@app.route("/login", methods=['POST'])
def login_page_post():
    username = request.form.get('username')
    plain_text_password = request.form.get('password')
    user_details = database_manager.get_user_details(username)

    if not user_details:
        flash("Invalid username/password combination")
        return redirect(url_for('login_page'))
    else:
        verified_password = util_password.check_hash_password(user_details['password'], plain_text_password)

    if not verified_password:
        flash("Invalid username/password combination")
        return redirect(url_for('login_page'))
    else:
        session['id'] = user_details['id']
        session['username'] = user_details['username']
        return redirect(url_for('index_page'))


@app.route("/logout")
def logout():
    session.pop('id', None)
    session.pop('username', None)
    return redirect(url_for('register_page'))


@app.route('/api/vote-planets', methods=['POST'])
def vote_planets():
    data = request.json
    database_manager.vote_planet_by_planet_name(data)
    return jsonify({'success': True})


@app.route('/api/get-planets-votes')
def get_planets_votes():
    statistics = database_manager.get_vote_statistics()
    return jsonify(statistics)


if __name__ == "__main__":
    app.run(debug=True)