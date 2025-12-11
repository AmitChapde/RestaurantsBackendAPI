USE restaurant_db;

START TRANSACTION;

-- Restaurants
INSERT INTO restaurants (name, city) VALUES
  ('Hyderabadi Spice House', 'Hyderabad'),
  ('Bombay Bistro', 'Mumbai');

-- Vars for restaurant IDs
SET @r1 := (SELECT id FROM restaurants WHERE name='Hyderabadi Spice House' LIMIT 1);
SET @r2 := (SELECT id FROM restaurants WHERE name='Bombay Bistro' LIMIT 1);

-- Menu items
INSERT INTO menu_items (restaurant_id, name, price) VALUES
  (@r1, 'Chicken Biryani', 220.00),
  (@r1, 'Mutton Biryani', 320.00),
  (@r1, 'Veg Biryani', 180.00),
  (@r2, 'Pav Bhaji', 150.00),
  (@r2, 'Vada Pav', 40.00),
  (@r2, 'Butter Chicken', 300.00);

-- Vars for menu item IDs
SET @mi_chicken := (SELECT id FROM menu_items WHERE restaurant_id=@r1 AND name='Chicken Biryani' LIMIT 1);
SET @mi_mutton  := (SELECT id FROM menu_items WHERE restaurant_id=@r1 AND name='Mutton Biryani' LIMIT 1);
SET @mi_veg     := (SELECT id FROM menu_items WHERE restaurant_id=@r1 AND name='Veg Biryani' LIMIT 1);

SET @mi_pavbhaji := (SELECT id FROM menu_items WHERE restaurant_id=@r2 AND name='Pav Bhaji' LIMIT 1);
SET @mi_vadapav  := (SELECT id FROM menu_items WHERE restaurant_id=@r2 AND name='Vada Pav' LIMIT 1);
SET @mi_butter   := (SELECT id FROM menu_items WHERE restaurant_id=@r2 AND name='Butter Chicken' LIMIT 1);

-- Procedure to insert N orders with randomized created_at
DROP PROCEDURE IF EXISTS make_orders;
DELIMITER $$
CREATE PROCEDURE make_orders(IN p_menu_item_id INT, IN p_restaurant_id INT, IN p_n INT)
BEGIN
  DECLARE i INT DEFAULT 0;
  WHILE i < p_n DO
    INSERT INTO orders (restaurant_id, menu_item_id, created_at)
    VALUES (p_restaurant_id, p_menu_item_id, NOW() - INTERVAL FLOOR(RAND()*365) DAY);
    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;

-- Hyderabadi Spice House
CALL make_orders(@mi_chicken, @r1, 96);  -- ensures orderCount = 96 for Chicken Biryani
CALL make_orders(@mi_mutton,  @r1, 42);
CALL make_orders(@mi_veg,     @r1, 30);

-- Bombay Bistro
CALL make_orders(@mi_vadapav,  @r2, 50);
CALL make_orders(@mi_pavbhaji, @r2, 20);
CALL make_orders(@mi_butter,   @r2, 12);

COMMIT;
