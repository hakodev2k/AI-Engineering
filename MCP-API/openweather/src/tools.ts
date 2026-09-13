import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { OpenWeatherClient } from "./client.js";
import { AirHistoryQuery, AirQuery, LocationQuery, TimeMachineQuery, WeatherQuery, ZipQuery } from "./schemas.js";

const text = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify({ untrustedProviderData: true, data }, null, 2) }] });

export function registerTools(server: McpServer, client: OpenWeatherClient): void {
  server.tool("openweather.location.search", "Search coordinates by city/state/country name. READ; no approval.", LocationQuery.shape, async (a) => {
    const p = LocationQuery.parse(a); return text(await client.geo("/direct", { q: p.query, limit: p.limit }));
  });
  server.tool("openweather.location.zip", "Resolve a postal code and ISO country code to coordinates. READ; no approval.", ZipQuery.shape, async (a) => {
    const p = ZipQuery.parse(a); return text(await client.geo("/zip", { zip: `${p.zip},${p.countryCode}` }));
  });
  server.tool("openweather.weather.current", "Get current weather by coordinates. READ; no approval.", WeatherQuery.shape, async (a) => {
    const p = WeatherQuery.parse(a); return text(await client.get("/data/2.5/weather", p));
  });
  server.tool("openweather.forecast.five_day", "Get 5-day / 3-hour forecast by coordinates. READ; no approval.", WeatherQuery.shape, async (a) => {
    const p = WeatherQuery.parse(a); return text(await client.get("/data/2.5/forecast", p));
  });
  server.tool("openweather.air.current", "Get current air-pollution components and AQI by coordinates. READ; no approval.", AirQuery.shape, async (a) => {
    const p = AirQuery.parse(a); return text(await client.get("/data/2.5/air_pollution", p));
  });
  server.tool("openweather.air.forecast", "Get air-pollution forecast by coordinates. READ; no approval.", AirQuery.shape, async (a) => {
    const p = AirQuery.parse(a); return text(await client.get("/data/2.5/air_pollution/forecast", p));
  });
  server.tool("openweather.air.history", "Get historical air pollution for a Unix-time range. READ; no approval.", AirHistoryQuery.shape, async (a) => {
    const p = AirHistoryQuery.parse(a); return text(await client.get("/data/2.5/air_pollution/history", p));
  });
  server.tool("openweather.onecall.summary", "Get AI-generated One Call weather overview when the subscription includes this endpoint. READ; no approval.", WeatherQuery.shape, async (a) => {
    const p = WeatherQuery.parse(a); return text(await client.get("/data/3.0/onecall/overview", p));
  });
  server.tool("openweather.onecall.timemachine", "Get One Call historical weather for a Unix timestamp when enabled by the subscription. READ; no approval.", TimeMachineQuery.shape, async (a) => {
    const p = TimeMachineQuery.parse(a); return text(await client.get("/data/3.0/onecall/timemachine", p));
  });
}
