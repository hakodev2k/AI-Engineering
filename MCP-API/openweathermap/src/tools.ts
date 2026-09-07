import { z } from "zod";

const lat = z.number().min(-90).max(90);
const lon = z.number().min(-180).max(180);
const units = z.enum(["standard", "metric", "imperial"]).default("metric");
const lang = z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/).max(10).optional();
const city = z.string().min(1).max(120);
const limit = z.number().int().min(1).max(5).default(5);

export type ToolDef = {
  name: string;
  description: string;
  risk: "READ";
  schema: z.ZodTypeAny;
  inputSchema: Record<string, unknown>;
};

const defs: Array<[string,string,z.ZodTypeAny]> = [
  ["openweathermap.location.search", "Resolve a place name to geographic coordinates using OpenWeather Geocoding API.", z.object({ query: city, limit }).strict()],
  ["openweathermap.location.reverse", "Resolve coordinates to nearby named places.", z.object({ lat, lon, limit }).strict()],
  ["openweathermap.weather.current", "Get current weather conditions by coordinates.", z.object({ lat, lon, units, lang }).strict()],
  ["openweathermap.forecast.five_day", "Get the official 5-day/3-hour forecast by coordinates.", z.object({ lat, lon, units, lang }).strict()],
  ["openweathermap.air_pollution.current", "Get current air-pollution AQI and pollutant concentrations by coordinates.", z.object({ lat, lon }).strict()],
  ["openweathermap.air_pollution.forecast", "Get forecast air-pollution data by coordinates.", z.object({ lat, lon }).strict()],
  ["openweathermap.one_call.current_forecast", "Get One Call 3.0 current/minutely/hourly/daily/alerts data when the account is subscribed.", z.object({ lat, lon, units, lang, exclude: z.array(z.enum(["current","minutely","hourly","daily","alerts"])).max(5).optional() }).strict()],
  ["openweathermap.one_call.timemachine", "Get One Call 3.0 weather data for a Unix timestamp supported by the subscription.", z.object({ lat, lon, dt: z.number().int().positive(), units, lang }).strict()]
];

function jsonSchema(schema: z.ZodTypeAny) {
  const shape = (schema as any)._def.shape();
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [key, value] of Object.entries<any>(shape)) {
    const t = value._def?.typeName || value._def?.innerType?._def?.typeName || "";
    properties[key] = { type: t.includes("Number") ? "number" : t.includes("Array") ? "array" : "string" };
    if (!value.isOptional?.() && value._def?.defaultValue === undefined) required.push(key);
  }
  return { type: "object", properties, required, additionalProperties: false };
}

export const TOOLS: ToolDef[] = defs.map(([name,description,schema]) => ({ name, description, risk: "READ", schema, inputSchema: jsonSchema(schema) }));
export const TOOL_MAP = new Map(TOOLS.map(t => [t.name, t]));
