# Restaurant API (Node + SQLite)

Small backend service that returns restaurants where a given dish has been ordered the most.

This repository runs with a local SQLite database (`data/restaurant.sqlite`) so you can run and test without MySQL. MySQL SQL files are retained under `sql/` for reference.

Tech

- Node.js (Express)
- SQLite (file-based) via `sqlite3`

  Quickstart

  1. Install dependencies:

  ```bash
     cd
     npm install
  ```

  2. Seed the database (creates `data/restaurant.sqlite`):

  ```bash
  node scripts/seed-sqlite.js
  ```

  3. Start the server:

  ```bash
   npm run dev
    # or
   npm start
  ```

  API - GET `/search/dishes` — search by dish name (partial) and mandatory price range. - Query params (required): `name`, `minPrice`, `maxPrice` - Example:

            `GET http://localhost:3000/search/dishes?name=biryani&minPrice=150&maxPrice=300`

          - Response shape:

        ```json
        {
          "restaurants": [
            {
              "restaurantId": 1,
              "restaurantName": "Hyderabadi Spice House",
              "city": "Hyderabad",
              "dishName": "Chicken Biryani",
              "dishPrice": 220,
              "orderCount": 96
            }
          ]
        }
        ```
- GET `/restaurants` — returns each restaurant with its top-selling dish and order count. Optional `?city=` filter.

        Example curl (search):

        ```bash
        curl -sG "http://localhost:3000/search/dishes" \
          --data-urlencode "name=biryani" \
          --data-urlencode "minPrice=150" \
          --data-urlencode "maxPrice=300" \
          -H "Accept: application/json"
        ```

        Project layout 
        - `src/index.js` — app entry
        - `src/config/db.js` — SQLite wrapper (exports `query`, `run`, `get`)
        - `src/controllers/restaurantsController.js` — search and restaurants logic
        - `src/routes/restaurants.js` — route definitions
        - `scripts/seed-sqlite.js` — seeds the SQLite DB
        - `data/restaurant.sqlite` — generated DB file after seeding

        Notes
        - The app reads `PORT` env var (default 3000).
        - If you want to run against MySQL instead, use the files in `sql/` and `scripts/run-sql.js` and set `DB_*` env vars accordingly.
