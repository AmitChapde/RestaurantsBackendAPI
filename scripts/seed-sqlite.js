import pool from '../src/config/db.js';

async function seed() {
  await pool.run(
    `CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      created_at DATETIME DEFAULT (datetime('now'))
    );`
  );
  await pool.run(
    `CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    );`
  );
  await pool.run(
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
    );`
  );

  // Clear existing data to allow re-seed
  await pool.run('DELETE FROM orders;');
  await pool.run('DELETE FROM menu_items;');
  await pool.run('DELETE FROM restaurants;');

  // Insert restaurants
  await pool.run("INSERT INTO restaurants (name, city) VALUES ('Hyderabadi Spice House', 'Hyderabad');");
  await pool.run("INSERT INTO restaurants (name, city) VALUES ('Bombay Bistro', 'Mumbai');");

  const r1 = (await pool.get("SELECT id FROM restaurants WHERE name=? LIMIT 1", ['Hyderabadi Spice House'])).id;
  const r2 = (await pool.get("SELECT id FROM restaurants WHERE name=? LIMIT 1", ['Bombay Bistro'])).id;

  // Insert menu items
  await pool.run('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)', [r1, 'Chicken Biryani', 220.00]);
  await pool.run('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)', [r1, 'Mutton Biryani', 320.00]);
  await pool.run('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)', [r1, 'Veg Biryani', 180.00]);
  await pool.run('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)', [r2, 'Pav Bhaji', 150.00]);
  await pool.run('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)', [r2, 'Vada Pav', 40.00]);
  await pool.run('INSERT INTO menu_items (restaurant_id, name, price) VALUES (?, ?, ?)', [r2, 'Butter Chicken', 300.00]);

  const mi_chicken = (await pool.get('SELECT id FROM menu_items WHERE restaurant_id=? AND name=? LIMIT 1', [r1, 'Chicken Biryani'])).id;
  const mi_mutton = (await pool.get('SELECT id FROM menu_items WHERE restaurant_id=? AND name=? LIMIT 1', [r1, 'Mutton Biryani'])).id;
  const mi_veg = (await pool.get('SELECT id FROM menu_items WHERE restaurant_id=? AND name=? LIMIT 1', [r1, 'Veg Biryani'])).id;

  const mi_pavbhaji = (await pool.get('SELECT id FROM menu_items WHERE restaurant_id=? AND name=? LIMIT 1', [r2, 'Pav Bhaji'])).id;
  const mi_vadapav = (await pool.get('SELECT id FROM menu_items WHERE restaurant_id=? AND name=? LIMIT 1', [r2, 'Vada Pav'])).id;
  const mi_butter = (await pool.get('SELECT id FROM menu_items WHERE restaurant_id=? AND name=? LIMIT 1', [r2, 'Butter Chicken'])).id;

  // Insert orders - loop inserts to emulate counts
  async function makeOrders(menuItemId, restaurantId, n) {
    const insert = 'INSERT INTO orders (restaurant_id, menu_item_id, created_at) VALUES (?, ?, datetime("now", "-" || ? || " days"))';
    for (let i = 0; i < n; i++) {
      // randomize days between 0 and 365
      const days = Math.floor(Math.random() * 365);
      await pool.run(insert, [restaurantId, menuItemId, days]);
    }
  }

  // Hyderabadi Spice House
  await makeOrders(mi_chicken, r1, 96);
  await makeOrders(mi_mutton, r1, 42);
  await makeOrders(mi_veg, r1, 30);

  // Bombay Bistro
  await makeOrders(mi_vadapav, r2, 50);
  await makeOrders(mi_pavbhaji, r2, 20);
  await makeOrders(mi_butter, r2, 12);

  console.log('SQLite DB seeded at data/restaurant.sqlite');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
