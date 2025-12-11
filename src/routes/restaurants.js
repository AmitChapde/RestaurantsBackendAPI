import { Router } from "express";
import {
  getRestaurantsTopDishes,
  searchDishes,
} from "../controllers/restaurantsController.js";

const router = Router();

router.get("/search/dishes", searchDishes);

export default router;
