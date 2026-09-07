import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { loadConfig } from "./config.js";
import { OpenWeatherApiError, OpenWeatherClient } from "./client.js";
import { TOOLS, TOOL_MAP } from "./tools.js";

const config = loadConfig();
const client = new OpenWeatherClient(config);
const result = (value: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] });
const q = (v: unknown) => v === undefined ? undefined : String(v);

async function dispatch(name: string, a: Record<string, unknown>) {
  switch (name) {
    case "openweathermap.location.search":
      return client.get("/geo/1.0/direct", { q: q(a.query), limit: Number(a.limit) });
    case "openweathermap.location.reverse":
      return client.get("/geo/1.0/reverse", { lat: Number(a.lat), lon: Number(a.lon), limit: Number(a.limit) });
    case "openweathermap.weather.current":
      return client.get("/data/2.5/weather", { lat: Number(a.lat), lon: Number(a.lon), units: q(a.units), lang: q(a.lang) });
    case "openweathermap.forecast.five_day":
      return client.get("/data/2.5/forecast", { lat: Number(a.lat), lon: Number(a.lon), units: q(a.units), lang: q(a.lang) });
    case "openweathermap.air_pollution.current":
      return client.get("/data/2.5/air_pollution", { lat: Number(a.lat), lon: Number(a.lon) });
    case "openweathermap.air_pollution.forecast":
      return client.get("/data/2.5/air_pollution/forecast", { lat: Number(a.lat), lon: Number(a.lon) });
    case "openweathermap.one_call.current_forecast":
      return client.get("/data/3.0/onecall", { lat: Number(a.lat), lon: Number(a.lon), units: q(a.units), lang: q(a.lang), exclude: Array.isArray(a.exclude) ? a.exclude.join(",") : undefined });
    case "openweathermap.one_call.timemachine":
      return client.get("/data/3.0/onecall/timemachine", { lat: Number(a.lat), lon: Number(a.lon), dt: Number(a.dt), units: q(a.units), lang: q(a.lang) });
    default: throw new Error("Unknown OpenWeather tool.");
  }
}

export const server = new Server({ name: "openweathermap-connector", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS.map(t => ({ name: t.name, description: `${t.description} Risk=${t.risk}.`, inputSchema: t.inputSchema as any })) }));
server.setRequestHandler(CallToolRequestSchema, async request => {
  const tool = TOOL_MAP.get(request.params.name);
  if (!tool) throw new Error("Tool is not exposed by this connector.");
  const args = tool.schema.parse(request.params.arguments ?? {}) as Record<string, unknown>;
  try { return result(await dispatch(tool.name, args)); }
  catch (error) {
    if (error instanceof OpenWeatherApiError) {
      if (error.status === 401) throw new Error("OpenWeather authentication/subscription failed. Verify API key and product entitlement.");
      if (error.status === 404) throw new Error("OpenWeather resource/location was not found.");
      if (error.status === 429) throw new Error(`OpenWeather rate limit reached.${error.retryAfter ? ` Retry after ${error.retryAfter}.` : ""}`);
      if (error.status >= 400 && error.status < 500) throw new Error(`OpenWeather request rejected: ${error.message}`);
    }
    throw error;
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.connect(new StdioServerTransport()).catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
