# campuses & students — server

backend api for our campuses & students app (csci 39548 final project).
express + prisma + postgres.

a campus has many students, and a student is either at one campus or none.
deleting a campus doesn't delete its students, they just become unenrolled.

## stack

- node + express
- prisma
- postgres (neon in prod)

## running it

you need a postgres database. so, have that locallyu installed beforehand. put its connection string in a .env as
DATABASE_URL, then:

```bash
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```

runs on http://localhost:3000.

## routes

campuses and students both have the usual crud:

- GET/POST `/campuses`, GET/PUT/DELETE `/campuses/:id`
- GET/POST `/students`, GET/PUT/DELETE `/students/:id`

input is checked on the server, bad requests come back as a 400.

## deployed

api link goes here once it's on render.
