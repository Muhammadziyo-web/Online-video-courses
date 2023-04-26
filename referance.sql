CREATE DATABASE exam8;

CREATE TABLE categories(
    cat_id SERIAL UNIQUE PRIMARY KEY,
    catName VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO
    categories(catName)
VALUES
    ('dasturlash'),
    ('dizayin'),
    ('marketing');

-- SUB CATEGORY
CREATE TABLE sap_categoriya(
    sapId SERIAL UNIQUE PRIMARY KEY,
    sapName VARCHAR(20) NOT NULL UNIQUE,
    catRefId INT NOT NULL REFERENCES categories(cat_id) ON DELETE CASCADE
);

INSERT INTO
    sap_categoriya(sapName, catRefId)
VALUES
    ('python', 1),
    ('java', 1),
    ('nodejs', 1),
    ('.net', 1),
    ('go', 1),
    ('logo', 2),
    ('interyer', 2),
    ('grafika', 2),
    ('.shrift', 2),
    ('muqova', 2),
    ('smm', 3),
    ('brand', 3),
    ('blog', 3),
    ('media', 3);

-- VID 
DROP TABLE videos CASCADE;

CREATE TABLE videos(
    videoId SERIAL UNIQUE PRIMARY KEY,
    userId INT,
    title VARCHAR(100),
    path VARCHAR(100),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    categoriesId INT REFERENCES categories(cat_id) ON DELETE CASCADE,
    sap_categoriyaId INT NOT NULL REFERENCES sap_categoriya(sapid) ON DELETE CASCADE
);

CREATE TABLE comments(
    commentId SERIAL,
    userId INT NOT NULL REFERENCES users(userId) ON DELETE CASCADE,
    videoId INT NOT NULL REFERENCES videos(videoId) ON DELETE CASCADE,
    comment VARCHAR(50) NOT NULL
);

INSERT INTO
    comments(userId, videoId, comment)
VALUES
    (1, '1', 'Gap yoq'),
    (2, '2', 'Gap yoq'),
    (3, '3', 'Gap yoq'),
    (3, '1', 'zor'),
    (1, '2', 'yaxshi'),
    (1, '1', 'boladi'),
    (1, '1', 'vashshe zor'),
    (1, '1', 'addushi');

CREATE TABLE users(
    userId SERIAL UNIQUE,
    username VARCHAR(15) NOT NULL,
    login VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50),
    token VARCHAR(50) PRIMARY KEY DEFAULT uuid_generate_v4()
);

INSERT INTO
    users(username, login, password)
VALUES
    (
        'Muhamadziyo',
        'Muhammadziyo',
        crypt('1112', 'hello')
    );