# Mapbox MCP/API Connector

Reusable read-only MCP stdio connector for Mapbox location workflows.

## Official transport strategy
Mapbox publishes an official Mapbox MCP Server (current documentation lists v0.12.0) that supports directions, isochrones, static maps, address/POI lookup, reverse geocoding, and interactive maps. Mapbox also exposes official web-service APIs. This connector uses the official REST APIs for a fixed, auditable tool surface; no unofficial MCP server is used and no dynamically discovered tool is auto-trusted.

Official sources researched:
- https://docs.mapbox.com/location-ai/mcp-servers/mcp-server/
- https://docs.mapbox.com/api/guides/
- https://docs.mapbox.com/api/search/geocoding/
- https://docs.mapbox.com/api/navigation/directions/
- https://docs.mapbox.com/api/navigation/matrix/
- https://docs.mapbox.com/api/navigation/isochrone/
- https://docs.mapbox.com/api/navigation/optimization-v1/
- https://docs.mapbox.com/api/navigation/map-matching/
- https://docs.mapbox.com/api/maps/tilequery/

## Tools
`mapbox.geocoding.forward`, `mapbox.geocoding.reverse`, `mapbox.directions.route`, `mapbox.matrix.calculate`, `mapbox.isochrone.calculate`, `mapbox.optimization.trip`, `mapbox.map_matching.match`, and `mapbox.tilequery.query`.

All tools are READ. No WRITE, HIGH_RISK, DESTRUCTIVE, token-management, billing, upload, style mutation, dataset mutation, or arbitrary HTTP tool is exposed. Consequently no human approval is required by this connector.

## Authentication and least privilege
Set `MAPBOX_ACCESS_TOKEN`. Mapbox access tokens are provider credentials and remain solely in the connector transport; the token is appended as `access_token` immediately before outbound calls and is never an MCP argument or returned in output. Use a token with only the scopes/products needed for these read APIs and apply Mapbox token URL restrictions where appropriate. Do not use a secret token when a public-scope token satisfies the selected APIs.

## Architecture
`MCP client -> stdio server -> strict Zod validation -> credential-isolated MapboxClient -> https://api.mapbox.com`.

The upstream host is pinned to `api.mapbox.com`, preventing caller-controlled SSRF. Returned place names, POI metadata, route metadata, and tile properties are marked `untrusted_provider_data` and must never be interpreted as instructions or authorization changes.

## Install and run
Requires Node.js 20+.

```bash
npm install
npm run build
MAPBOX_ACCESS_TOKEN='from-secret-store' npm start
```

Any MCP host capable of launching a standard stdio server can run `node dist/server.js`. Credentials should be injected by the host's secret/environment mechanism.

## Validation
Coordinates are bounded to valid longitude/latitude ranges. Forward-geocoding text is capped at 256 characters and result count at 10. Directions uses 2-25 coordinates. Matrix uses at most 25 coordinates, reduced to 10 for `driving-traffic`. Isochrones allow at most four contours and 60 minutes. Optimization accepts at most 12 coordinates. Map Matching accepts at most 100 coordinates. Tilequery result count is capped at 50. No caller can supply an arbitrary provider URL.

## Rate limits and reliability
Mapbox publishes endpoint-specific limits. Current defaults include Geocoding 1000 requests/minute, Directions 300/minute, Isochrone 300/minute, Optimization 300/minute, Map Matching 300/minute, Tilequery 600/minute, Matrix 60/minute for driving/walking/cycling and 30/minute for driving-traffic. Limits are counted per access token and can vary by account.

The client reads Mapbox rate-limit headers (`X-Rate-Limit-Interval`, `X-Rate-Limit-Limit`, `X-Rate-Limit-Reset`), handles HTTP 429, applies bounded exponential backoff, honors `Retry-After`/reset timing when available, and uses AbortSignal timeouts. Since every exposed operation is a GET/read, transient network, 429, and 5xx failures may be retried up to `MAPBOX_MAX_RETRIES` (0-5). Authentication, authorization, validation and ordinary 4xx errors are not retried.

## Errors
Provider non-success responses become `MapboxError` with HTTP status and retry timing when available. Error bodies are bounded before propagation and the access token is never intentionally included. 401 means missing/invalid token; 403 can indicate account or token restriction issues; 422 indicates invalid provider input; 429 indicates throttling.

## Security and data-use constraints
Credentials stay out of prompts and tool payloads. The connector has no generic request escape hatch, no token-management capability, and no mutation tools. Provider content is untrusted. Deployments must also comply with Mapbox product terms: some APIs require results to be displayed with Mapbox maps and Search/Geocoding products can impose restrictions on storage or temporary use. In particular, do not persist geocoding/search results unless the applicable Mapbox terms and request mode permit it.

## Testing
`npm test` builds and runs credential/configuration, official-host pinning, unique tool/risk registration, credential injection, and throttled-read retry tests without live credentials.

## Limitations
This package intentionally omits static-map rendering, Search Box session flows, map styles, uploads, datasets, tileset publishing, token administration, and all write operations. The official Mapbox MCP server has broader interactive-map functionality and can be used directly when that capability is required. Exact billing, entitlement, rate limits, and data-retention/display terms remain provider/account specific.
