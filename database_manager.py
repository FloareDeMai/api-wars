from psycopg2.extras import RealDictCursor
import database_common


@database_common.connection_handler
def check_if_username_exists(cursor: RealDictCursor, username):
    query = """
        SELECT * FROM users WHERE  username = %(username)s;
    """
    cursor.execute(query, {'username': username})
    return cursor.fetchone()


@database_common.connection_handler
def add_user(cursor: RealDictCursor, user_obj):
    if check_if_username_exists(user_obj['username']):
        return False
    query = """
        INSERT INTO users (username, password, submission_time)
        VALUES (%s, %s, NOW())
    """
    cursor.execute(query, (user_obj["username"],
                           user_obj['password']))


@database_common.connection_handler
def get_user_details(cursor: RealDictCursor, username):
    query = """
        SELECT * FROM users WHERE username = %(username)s;
    """
    cursor.execute(query, {'username': username})
    return cursor.fetchone()


@database_common.connection_handler
def vote_planet_by_planet_name(cursor: RealDictCursor, data_obj):
    query = '''
        INSERT INTO planet_votes (planet_id, planet_name, user_id, submission_time) 
        VALUES (%s, %s, %s, NOW()) 
    '''
    cursor.execute(query, (data_obj['planet_id'],
                           data_obj['planet_name'],
                           data_obj['user_id']))


@database_common.connection_handler
def get_vote_statistics(cursor: RealDictCursor):
    query = '''
    select planet_name, count(planet_id) as recived_votes from planet_votes
    group by planet_name
    '''
    cursor.execute(query)
    return cursor.fetchall()
