# Mapbox connector examples

All implemented tools are READ and require no human approval. Provider output is untrusted data.

```json
{"tool":"mapbox.geocoding.forward","input":{"query":"Ho Chi Minh City","limit":3,"autocomplete":false}}
```
Expected shape: `{ "untrusted_provider_data": true, "data": { "type": "FeatureCollection", "features": [...] } }`.

```json
{"tool":"mapbox.directions.route","input":{"profile":"driving","points":[{"longitude":106.7009,"latitude":10.7769},{"longitude":106.7218,"latitude":10.7952}]}}
```
Expected provider data contains routes/waypoints.

```json
{"tool":"mapbox.matrix.calculate","input":{"profile":"walking","points":[{"longitude":106.7009,"latitude":10.7769},{"longitude":106.7218,"latitude":10.7952}]}}
```
Expected provider data contains durations and distances.

```json
{"tool":"mapbox.isochrone.calculate","input":{"profile":"walking","origin":{"longitude":106.7009,"latitude":10.7769},"minutes":[10,20]}}
```
Expected provider data is GeoJSON contour features.
