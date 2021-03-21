import os
import psycopg2
import psycopg2.extras


def get_connection_string():

    os.environ['PSQL_USER_NAME'] = 'qlivddshxthsze'
    os.environ['PSQL_PASSWORD'] = '285a731efc1aec209c7a3b51143688e435aa243e064f8b1cc0dbb37f652298d2'
    os.environ['PSQL_HOST'] = 'ec2-52-71-161-140.compute-1.amazonaws.com'
    os.environ['PSQL_DB_NAME'] = 'd6t4m8edivndrk'

    user_name = os.environ.get('PSQL_USER_NAME')
    password = os.environ.get('PSQL_PASSWORD')
    host = os.environ.get('PSQL_HOST')
    database_name = os.environ.get('PSQL_DB_NAME')

    env_variables_defined = user_name and password and host and database_name

    if env_variables_defined:
        return f'postgresql://{user_name}:{password}@{host}/{database_name}'

    else:
        raise KeyError("Some necessary environment variable are not defined")


def open_database():
    try:
        connection_string = get_connection_string()
        connection = psycopg2.connect(connection_string)

        connection.autocommit = True

    except psycopg2.DatabaseError as exception:
        print("Database connection problem")

        raise exception

    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()

        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()

        return ret_value

    return wrapper
