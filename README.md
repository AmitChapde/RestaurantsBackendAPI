# Restaurant API (Node + MySQL)

A simple API that returns each restaurant with its top-selling dish and order count.

## Tech
- Node.js (Express)
- MySQL 8.0 (window functions)
- mysql2/promise

## API
- GET `/api/restaurants?city=Hyderabad`
  - Response:
    ```json
    [
      {
        "restaurantId": 1,
        "restaurantName": "Hyderabadi Spice House",
        "city": "Hyderabad",
        "dishName": "Chicken Biryani",
        "dishPrice": 220,
        "orderCount": 96
      },
      {
        "restaurantId": 2,
        "restaurantName": "Bombay Bistro",
        "city": "Mumbai",
        "dishName": "Vada Pav",
        "dishPrice": 40,
        "orderCount": 50
      }
    ]
    ```
  - If `city` is omitted, returns top dish for all restaurants.

## Prerequisites
- Node.js 18+
- MySQL 8.0+ (required for window functions)
- Optional: Docker/Docker Compose

## Local Setup (MySQL installed)
1. Clone this folder (or copy content) into `restaurant-api`
2. Install deps:
   ```bash
   npm ci
# RestaurantsBackendAPI
