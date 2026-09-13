# Example workflows

## Find a location, then inspect weather

Tool: `open_meteo.location.search`

```json
{ "name": "Da Nang", "count": 5, "language": "en" }
```

Permission: READ. Approval: no.

Then call `open_meteo.weather.forecast` using the selected coordinates:

```json
{
  "latitude": 16.0544,
  "longitude": 108.2022,
  "timezone": "Asia/Ho_Chi_Minh",
  "forecastDays": 7,
  "temperatureUnit": "celsius",
  "windSpeedUnit": "kmh",
  "precipitationUnit": "mm"
}
```

Expected output shape:

```json
{
  "untrustedProviderData": true,
  "data": {
    "latitude": 0,
    "longitude": 0,
    "current": {},
    "hourly": {},
    "daily": {}
  }
}
```

Permission: READ. Approval: no.

## Historical weather

Tool: `open_meteo.weather.history`

```json
{
  "latitude": 10.8231,
  "longitude": 106.6297,
  "timezone": "Asia/Ho_Chi_Minh",
  "startDate": "2025-01-01",
  "endDate": "2025-01-07"
}
```

Permission: READ. Approval: no.

## Air quality

Tool: `open_meteo.air_quality.forecast`

```json
{
  "latitude": 21.0278,
  "longitude": 105.8342,
  "timezone": "Asia/Ho_Chi_Minh",
  "forecastDays": 3
}
```

Permission: READ. Approval: no.
