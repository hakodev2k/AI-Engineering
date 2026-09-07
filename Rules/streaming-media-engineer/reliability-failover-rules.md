# Reliability and Failover Rules

## Purpose
Ensure streaming services survive component, zone, region, provider, and dependency failures with bounded customer impact.

## Scope
Redundancy, failover, recovery, active-active/standby designs, dependency isolation, and degraded modes.

## MUST
- Critical streaming paths MUST define availability objectives, failure domains, failover triggers, and recovery ownership.
- Redundant paths MUST be exercised; untested redundancy MUST NOT be treated as reliable capacity.
- Failover logic MUST prevent oscillation, duplicate ownership, and uncontrolled retry amplification.
- Recovery procedures MUST define state reconciliation after partial or split failures.

## MUST NOT
- MUST NOT route all redundant paths through an undocumented shared dependency.
- MUST NOT automate destructive or broad failover actions without guardrails, bounded scope, and required human approval.
- MUST NOT declare recovery complete without playback and data-plane evidence.

## SHOULD
- Critical live workflows SHOULD tolerate loss of nonessential control-plane services for a bounded period.
- Fault isolation SHOULD minimize correlated impact across tenants, channels, or regions.

## Exceptions
Lower redundancy requires documented business acceptance, recovery objectives, and compensating controls.

## Verification
Run game days, dependency-failure tests, regional failover exercises, playback probes, reconciliation checks, and incident evidence reviews.