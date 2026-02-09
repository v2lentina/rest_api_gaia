import { Request, Response, NextFunction } from "express";
import {
  searchCountriesByName,
  getCountryByCode,
} from "../services/country.service";
import { ApiResponse, Country, CountryDetails } from "../types/api";

export class CountryController {
  /**
   * GET /api/countries/search?q=...
   * Search for countries by name
   */
  searchCountries = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = (req.query.q as string) || "";

      if (!query || query.trim() === "") {
        res.status(400).json({
          success: false,
          error: {
            error: "Bad Request",
            message: 'Query parameter "q" is required',
            statusCode: 400,
          },
        } as ApiResponse<never>);
        return;
      }

      const countries = await searchCountriesByName(query);

      res.status(200).json({
        success: true,
        data: countries,
      } as ApiResponse<Country[]>);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/countries/:code
   * Get detailed country information by CCA3 code
   */
  getCountryDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const code = req.params.code as string;

      if (!code || code.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: {
            error: "Bad Request",
            message: "Country code parameter is required",
            statusCode: 400,
          },
        } as ApiResponse<never>);
        return;
      }

      const countryDetails = await getCountryByCode(code);

      res.status(200).json({
        success: true,
        data: countryDetails,
      } as ApiResponse<CountryDetails>);
    } catch (error) {
      next(error);
    }
  };
}
