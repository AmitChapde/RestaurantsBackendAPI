import pool from '../config/db.js';

export async function getRestaurantsTopDishes(req, res, next) {
  try {
    const { city } = req.query || {};

    const sql = `
      WITH dish_counts AS (
        SELECT
          r.id AS restaurantId,
          r.name AS restaurantName,
          r.city AS city,
          mi.id AS menuItemId,
          mi.name AS dishName,
          mi.price AS dishPrice,
          COUNT(o.id) AS orderCount
        FROM restaurants r
        JOIN menu_items mi ON mi.restaurant_id = r.id
        LEFT JOIN orders o ON o.menu_item_id = mi.id
        WHERE (? IS NULL OR r.city = ?)
        GROUP BY r.id, r.name, r.city, mi.id, mi.name, mi.price
      ),
      ranked AS (
        SELECT
          restaurantId, restaurantName, city,
          menuItemId, dishName, dishPrice, orderCount,
          ROW_NUMBER() OVER (
            PARTITION BY restaurantId
            ORDER BY orderCount DESC, menuItemId ASC
          ) AS rn
        FROM dish_counts
      )
      SELECT restaurantId, restaurantName, city, dishName, dishPrice, orderCount
      FROM ranked
      WHERE rn = 1
      ORDER BY restaurantName;
    `;

    const params = [city ?? null, city ?? null];
    const [rows] = await pool.query(sql, params);

    res.json(rows.map(r => ({
      restaurantId: r.restaurantId,
      restaurantName: r.restaurantName,
      city: r.city,
      dishName: r.dishName,
      dishPrice: Number(r.dishPrice),
      orderCount: Number(r.orderCount)
    })));
  } catch (err) {
    next(err);
  }
}

/**
 * GET /search/dishes?name=...&minPrice=...&maxPrice=...
 * Returns the top 10 restaurants where the named dish has been ordered the most
 * and the dish price is within the mandatory price range.
 */
export async function searchDishes(req, res, next) {
  try {
    const { name, minPrice, maxPrice } = req.query || {};

    if (!name) {
      return res.status(400).json({ error: 'Missing required query param: name' });
    }
    const minP = Number(minPrice);
    const maxP = Number(maxPrice);
    if (Number.isNaN(minP) || Number.isNaN(maxP)) {
      return res.status(400).json({ error: 'minPrice and maxPrice must be numbers' });
    }
    if (minP > maxP) {
      return res.status(400).json({ error: 'minPrice cannot be greater than maxPrice' });
    }

    const sql = `
      SELECT
        r.id AS restaurantId,
        r.name AS restaurantName,
        r.city AS city,
        mi.name AS dishName,
        mi.price AS dishPrice,
        COUNT(o.id) AS orderCount
      FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      LEFT JOIN orders o ON o.menu_item_id = mi.id
      WHERE mi.name LIKE ? AND mi.price BETWEEN ? AND ?
      GROUP BY r.id, r.name, r.city, mi.id, mi.name, mi.price
      ORDER BY orderCount DESC
      LIMIT 10;
    `;

    const params = [`%${name}%`, minP, maxP];
    const [rows] = await pool.query(sql, params);

    res.json({
      restaurants: rows.map(r => ({
        restaurantId: r.restaurantId,
        restaurantName: r.restaurantName,
        city: r.city,
        dishName: r.dishName,
        dishPrice: Number(r.dishPrice),
        orderCount: Number(r.orderCount)
      }))
    });
  } catch (err) {
    next(err);
  }
}
