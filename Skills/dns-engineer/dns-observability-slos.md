# DNS Observability and SLOs

## Purpose
Measure DNS availability, correctness, latency, and dependency health with actionable telemetry.

## When to use
Monitoring design, SLO creation, alert tuning, or post-incident visibility gaps.

## Inputs
Service criticality, resolver/authority metrics, query logs, synthetic probes, topology, incident history.

## Context to inspect
QPS, response codes, latency, cache hit ratio, validation failures, zone-transfer health, signature expiry, delegation checks, and client-side success.

## Core knowledge
Device/process health is not DNS service health. Observe both authoritative and recursive paths externally and internally. Error-code ratios and tail latency are stronger signals than raw QPS.

## Procedure
1. Define DNS user journeys and service boundaries.
2. Set availability/latency/correctness objectives.
3. Collect resolver and authority metrics.
4. Add synthetic queries for critical names and delegation chains.
5. Monitor DNSSEC expiry/validation where applicable.
6. Track configuration and zone changes.
7. Segment metrics by site, resolver, zone, response code, and transport without uncontrolled cardinality.
8. Alert on sustained user-impacting conditions.
9. Link alerts to diagnostic runbooks.
10. Review telemetry after incidents.

## Decision points
Retain detailed query logs only as justified by troubleshooting/security needs and privacy policy. Use sampling for high-volume analytics when exact counts are unnecessary.

## Common failure patterns
Only pinging DNS servers, no external authoritative checks, alerting on every NXDOMAIN, missing tail latency, unsynchronized clocks, and high-cardinality labels.

## Verification
Trigger known failure/test conditions and confirm detection, routing, context, and recovery closure.

## Expected output
DNS SLOs, dashboards, alerts, synthetic tests, retention policy, and runbooks.

## Stop conditions
Stop when telemetry would violate privacy policy or collection load threatens DNS service stability.