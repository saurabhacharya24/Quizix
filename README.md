# Quizix
Quizix - the web app that helps anyone take and create quizzes.

(This project makes use of PostgresQL, React, TypeScript, Python, HTML and SCSS, so make sure you've installed the relevant up-to-date packages to run this on your own system [Frontend modules to be installed in `frontend/quizix_frontend/` directory])

### Notes:
- You need to create a Postgres database named 'quizix', after which you can use the `quizix_dump` file to populate the database 
- A `database.ini` file needs to be created inside the `backend/` directory with the following information:
```
[postgresql]
host=localhost
database=quizix
user=YOUR_USER_NAME
password=YOUR_PASSWORD
```
