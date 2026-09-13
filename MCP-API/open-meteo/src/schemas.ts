import { z } from "zod";

export const Coordinates = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1).max(100).default("auto")
});

export const ForecastQuery = Coordinates.extend({
  forecastDays: z.number().int().min(1).max(16).default(7),
  temperatureUnit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
  windSpeedUnit: z.enum(["kmh", "ms", "mph", "kn"]).default("kmh"),
  precipitationUnit: z.enum(["mm", "inch"]).default("mm")
});

export const DateRangeQuery = Coordinates.extend({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

export const SearchQuery = z.object({ name: z.string().trim().min(1).max(200), count: z.number().int().min(1).max(20).default(10), language: z.string().regex(/^[a-z]{2}$/i).default("en") });
export const ElevationQuery = z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180) });
export const FloodQuery = Coordinates.extend({ forecastDays: z.number().int().min(1).max(210).default(7) });
