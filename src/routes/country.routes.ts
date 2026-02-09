import { Router } from "express";
import { CountryController } from "../controllers/country.controller";

const router = Router();
const controller = new CountryController();

// GET /api/countries/search?q=germany
router.get("/search", controller.searchCountries);

// GET /api/countries/DEU
router.get("/:code", controller.getCountryDetails);

export default router;
