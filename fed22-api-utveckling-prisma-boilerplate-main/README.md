# FED22 API-utveckling Prisma Boilerplate

This is a starter template/boilerplate for a TypeScript Node.js REST API using Express, Prisma and Express-validator.

## Usage

Create a new repository on your GitHub profile using this template by clicking on **Use this template** above the file list and selecting **Create a new repository**.

After your respository has been created on your GitHub profile, clone the repository, create an `.env` file and copy the contents from `.env.example`. Create a new MySQL-database and change the database-name in `DATABASE_URL` after the last slash to the name of your database.

Run `npm install` to install all packages and then start the server using `npm run dev`.

## Build

Delete the `build/` directory if it exists from a previous build, and then run `npm run build` to transpile TypeScript into JavaScript.
