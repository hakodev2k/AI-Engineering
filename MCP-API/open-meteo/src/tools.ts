import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { OpenMeteoClient } from "./client.js";
import { DateRangeQuery, ElevationQuery, FloodQuery, ForecastQuery, SearchQuery } from "./schemas.js";

const text = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify({ untrustedProviderData: true, data }, null, 2) }] });
const assertRange = (startDate: string, endDate: string) => { if (startDate > endDate) throw new Error("startDate must be <= endDate"); };

export function registerTools(server: McpServer, client: OpenMeteoClient): void {
  server.tool("open_meteo.location.search", "Search Open-Meteo geocoding by place name. READ; no approval.", SearchQuery.shape, async (a) => {
    const p = SearchQuery.parse(a); return text(await client.get("https://geocoding-api.open-meteo.com", "/v1/search", p));
  });
  server.tool("open_meteo.weather.forecast", "Get current, hourly, and daily weather forecast. READ; no approval.", ForecastQuery.shape, async (a) => {
    const p = ForecastQuery.parse(a); return text(await client.get("https://api.open-meteo.com", "/v1/forecast", { latitude:p.latitude, longitude:p.longitude, timezone:p.timezone, forecast_days:p.forecastDays, temperature_unit:p.temperatureUnit, wind_speed_unit:p.windSpeedUnit, precipitation_unit:p.precipitationUnit, current:"temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m", hourly:"temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m", daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset" }));
  });
  server.tool("open_meteo.weather.history", "Get historical weather/reanalysis for a date range. READ; no approval.", DateRangeQuery.shape, async (a) => {
    const p = DateRangeQuery.parse(a); assertRange(p.startDate,p.endDate); return text(await client.get("https://archive-api.open-meteo.com", "/v1/archive", { latitude:p.latitude, longitude:p.longitude, timezone:p.timezone, start_date:p.startDate, end_date:p.endDate, hourly:"temperature_2m,relative_humidity_2m,precipitation,rain,snowfall,weather_code,wind_speed_10m", daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum" }));
  });
  server.tool("open_meteo.air_quality.forecast", "Get current and hourly air-quality values. READ; no approval.", ForecastQuery.shape, async (a) => {
    const p = ForecastQuery.parse(a); return text(await client.get("https://air-quality-api.open-meteo.com", "/v1/air-quality", { latitude:p.latitude, longitude:p.longitude, timezone:p.timezone, forecast_days:Math.min(p.forecastDays,7), current:"pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi,us_aqi", hourly:"pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi,us_aqi" }));
  });
  server.tool("open_meteo.marine.forecast", "Get marine wave forecast for coordinates. READ; no approval.", ForecastQuery.shape, async (a) => {
    const p = ForecastQuery.parse(a); return text(await client.get("https://marine-api.open-meteo.com", "/v1/marine", { latitude:p.latitude, longitude:p.longitude, timezone:p.timezone, forecast_days:p.forecastDays, hourly:"wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,swell_wave_direction,swell_wave_period", daily:"wave_height_max,wave_direction_dominant,wave_period_max" }));
  });
  server.tool("open_meteo.elevation.get", "Get terrain elevation for coordinates. READ; no approval.", ElevationQuery.shape, async (a) => {
    const p = ElevationQuery.parse(a); return text(await client.get("https://api.open-meteo.com", "/v1/elevation", p));
  });
  server.tool("open_meteo.flood.forecast", "Get river-discharge flood forecast. READ; no approval.", FloodQuery.shape, async (a) => {
    const p = FloodQuery.parse(a); return text(await client.get("https://flood-api.open-meteo.com", "/v1/flood", { latitude:p.latitude, longitude:p.longitude, forecast_days:p.forecastDays, daily:"river_discharge,river_discharge_mean,river_discharge_max,river_discharge_min,river_discharge_median,river_discharge_p25,river_discharge_p75" }));
  });
  server.tool("open_meteo.climate.projection", "Get climate-model projections for a date range. READ; no approval.", DateRangeQuery.shape, async (a) => {
    const p = DateRangeQuery.parse(a); assertRange(p.startDate,p.endDate); return text(await client.get("https://climate-api.open-meteo.com", "/v1/climate", { latitude:p.latitude, longitude:p.longitude, start_date:p.startDate, end_date:p.endDate, models:"MRI_AGCM3_2_S", daily:"temperature_2m_mean,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_mean" }));
  });
  server.tool("open_meteo.ensemble.forecast", "Get ensemble forecast statistics from Open-Meteo. READ; no approval.", ForecastQuery.shape, async (a) => {
    const p = ForecastQuery.parse(a); return text(await client.get("https://ensemble-api.open-meteo.com", "/v1/ensemble", { latitude:p.latitude, longitude:p.longitude, timezone:p.timezone, forecast_days:p.forecastDays, hourly:"temperature_2m,precipitation,wind_speed_10m" }));
  });
}
