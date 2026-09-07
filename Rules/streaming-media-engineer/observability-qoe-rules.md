# Observability and QoE Rules

## Purpose
Make streaming health diagnosable from ingest through playback and separate service health from viewer experience.

## Scope
Logs, metrics, traces, probes, playback analytics, SLIs, dashboards, and alerting.

## MUST
- Telemetry MUST distinguish ingest, processing, origin, CDN, and playback failure domains where technically possible.
- Critical paths MUST expose latency, error, throughput, saturation, and media-specific quality indicators.
- Viewer QoE MUST include appropriate measures such as startup time, rebuffering, playback failures, rendition changes, and live latency.
- Alerts MUST map to actionable symptoms or objectives and identify ownership.

## MUST NOT
- MUST NOT log secrets, access tokens, content keys, or unnecessary sensitive viewer data.
- MUST NOT use aggregate availability alone as proof of acceptable playback experience.
- MUST NOT claim root cause from correlation without supporting evidence.

## SHOULD
- Correlation identifiers SHOULD connect control-plane operations with media-session evidence without creating privacy risk.
- Synthetic playback probes SHOULD cover critical regions and delivery modes.

## Exceptions
Telemetry omissions require documented technical/privacy constraints and alternative evidence.

## Verification
Review dashboards, alert tests, telemetry schemas, synthetic probes, privacy controls, traces, and historical incident diagnosability.