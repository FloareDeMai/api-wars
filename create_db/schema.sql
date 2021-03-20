ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS fk_user_id CASCADE;

DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username varchar(30) NOT NULL,
    password varchar(500) NOT NULL,
    submission_time timestamp without time zone
);

DROP TABLE IF EXISTS public.planet_votes CASCADE;

CREATE TABLE planet_votes(
    id SERIAL PRIMARY KEY NOT NULL,
    planet_id varchar(30) NOT NULL,
    planet_name varchar(50) NOT NULL,
    user_id INTEGER,
    submission_time timestamp without time zone
);

ALTER TABLE ONLY planet_votes ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);