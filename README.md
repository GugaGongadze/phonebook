# phonebook app

## To start locally without Docker:

- `cd server`

  - `npm i`
  - `npx prisma migrate dev --name init`
  - `npm run dev`

- `cd ui`
  - `npm i`
  - `npm start`
  - Go to `http://localhost:3000`

## Start with Docker:

Run `docker-compose up` and go to `http://localhost:3000`.
