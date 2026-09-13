import { z } from "zod";

export const Coordinates = z.object({ lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180) }).strict();
export const Units = z.enum(["standard", "metric", "imperial"]);
export const Language = z.string().regex(/^[a-z]{2}([_-][A-Z]{2})?$/).max(10);
export const LocationQuery = z.object({ query: z.string().trim().min(1).max(200), limit: z.number().int().min(1).max(5).default(5) }).strict();
export const ZipQuery = z.object({ zip: z.string().trim().regex(/^[A-Za-z0-9 -]{2,20}$/), countryCode: z.string().trim().regex(/^[A-Za-z]{2}$/).transform(v => v.toUpperCase()) }).strict();
export const WeatherQuery = Coordinates.extend({ units: Units.default("metric"), lang: Language.default("en") }).strict();
export const AirQuery = Coordinates.strict();
export const AirHistoryQuery = Coordinates.extend({ start: z.number().int().positive(), end: z.number().int().positive() }).strict().refine(v => v.end > v.start, "end must be greater than start");
export const TimeMachineQuery = WeatherQuery.extend({ dt: z.number().int().positive() }).strict();

export type Risk = "READ";
export interface ToolPolicy { risk: Risk; approvalRequired: false; permission: "weather.read"; }
export const READ_POLICY: ToolPolicy = { risk: "READ", approvalRequired: false, permission: "weather.read" };
