# Northcoders News API

The link to the hosted version of the app: https://nc-news-1yod.onrender.com/api/articles

This project is an API connected to the nc_news SQL database. It contains articles, comments, users and topics which can be
viewed by going to the specific path. The paths have also been designed to POST, PATCH and DELETE data.

Steps to Follow

1. Install NodeJs (minimum v16.20.2) and PostgreSQL (minimum v14.10).
2. Clone this repository from https://github.com/gpynadath/nc-news.git
3. Install the required dependancies using npm install.
4. Create two .env files. One named as .env.test and .env.development.
5. Into the .env.test file add PGDATABASE = nc_news_test and for the .env.development add PGDATABASE=nc_news.
6. Set up the database using npm run setup-dbs.
7. Seed the database using npm run seed..
8. Run the API using npm run.
9. Test the API using npm test.
