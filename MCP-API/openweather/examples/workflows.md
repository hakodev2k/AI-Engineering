# Example workflows

## Resolve a city and inspect conditions

1. Tool: `openweather.location.search`
   Input: `{ "query": "Hanoi,VN", "limit": 1 }`
   Permission: `weather.read`
   Risk: READ
   Approval: No
   Expected output: provider location objects containing `name`, `lat`, `lon`, `country` and optional state/local names.

2. Tool: `openweather.weather.current`
   Input: `{ "lat": 21.0285, "lon": 105.8542, "units": "metric", "lang": "en" }`
   Permission: `weather.read`
   Risk: READ
   Approval: No
   Expected output: current OpenWeather JSON wrapped as untrusted provider data.

3. Tool: `openweather.forecast.five_day`
   Input: `{ "lat": 21.0285, "lon": 105.8542, "units": "metric", "lang": "en" }`
   Permission: `weather.read`
   Risk: READ
   Approval: No
   Expected output: 3-hour forecast entries for the provider-supported forecast window.

## Air quality assessment

Tool: `openweather.air.current`
Input: `{ "lat": 21.0285, "lon": 105.8542 }`
Permission: `weather.read`
Risk: READ
Approval: No
Expected output: AQI plus pollutant components from OpenWeather.

Tool: `openweather.air.history`
Input: `{ "lat": 21.0285, "lon": 105.8542, "start": 1789257600, "end": 1789344000 }`
Permission: `weather.read`
Risk: READ
Approval: No
Expected output: historical pollution observations in the requested Unix-time interval when available under the provider plan.
