# CDN Production Incident Response

## Purpose
Restore CDN-backed services safely during edge, routing, cache, certificate, security, or origin incidents.

## When to use
Use when CDN delivery breaches availability, latency, correctness, or security objectives.

## Inputs
Incident symptoms, dashboards, logs, recent changes, provider status, runbooks, rollback options.

## Context to inspect
Affected regions/POPs, cache states, DNS, TLS, WAF, edge code, shields, origins, provider control plane.

## Core knowledge
Mitigation precedes perfect diagnosis. CDN incidents can amplify quickly because configuration is globally distributed; reversible scoped actions are preferred.

## Procedure
1. Establish incident severity, commander, and communication channel.
2. Define affected users, regions, hostnames, and request classes.
3. Freeze unrelated CDN changes.
4. Check recent deployments and provider health.
5. Separate edge failures from origin failures.
6. Apply the safest scoped mitigation: rollback, bypass feature, reroute, or relax faulty rule.
7. Watch SLOs and secondary effects continuously.
8. Preserve logs and configuration evidence.
9. Restore normal configuration incrementally.
10. Complete root-cause analysis and corrective actions.

## Decision points
Bypass caching only if origins can absorb the load. Relax security controls only with explicit risk ownership. Prefer regional mitigation when impact is regional.

## Common failure patterns
Global purge during origin distress, disabling WAF broadly, simultaneous uncoordinated changes, missing timestamps, and declaring recovery from averages alone.

## Verification
Confirm recovery across affected cohorts, cache/origin health, security posture, and sustained SLO compliance.

## Expected output
A mitigated incident, preserved evidence, timeline, root cause, and follow-up actions.

## Stop conditions
Escalate immediately for active compromise, provider-wide outage requiring vendor intervention, or mitigations exceeding change authority.