# OpenWeather MCP tool examples

## Resolve a city then read current weather
Tool: `openweathermap.location.search`
Input: `{ "query": "Ho Chi Minh City", "limit": 1 }`
Permission: READ. Approval: no.
Expected output: provider geocoding records plus `source: "untrusted_provider_data"`.

Tool: `openweathermap.weather.current`
Input: `{ "lat": 10.8231, "lon": 106.6297, "units": "metric", "lang": "en" }`
Permission: READ. Approval: no.
Expected output: current weather JSON plus untrusted-provider marker.

## Forecast and air quality
Tool: `openweathermap.forecast.five_day`
Input: `{ "lat": 35.6762, "lon": 139.6503, "units": "metric" }`
Permission: READ. Approval: no.

Tool: `openweathermap.air_pollution.current`
Input: `{ "lat": 35.6762, "lon": 139.6503 }`
Permission: READ. Approval: no.

## One Call 3.0
Tool: `openweathermap.one_call.current_forecast`
Input: `{ "lat": 51.5074, "lon": -0.1278, "units": "metric", "exclude": ["minutely"] }`
Permission: READ. Approval: no. Requires One Call 3.0 entitlement on the configured OpenWeather account.
