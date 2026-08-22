# Resilience and Failover Rules

## Purpose
Ensure redundancy produces verified service continuity rather than duplicated components only.

## Scope
Links, devices, routing, gateways, DNS, tunnels, providers, power/failure domains, and recovery.

## MUST
- Define failure scenarios and expected recovery behavior for critical network services.
- Identify shared dependencies that can defeat nominal redundancy.
- Test failover and failback under controlled conditions with service-level observation.
- Track convergence and recovery time against agreed objectives.

## MUST NOT
- Claim high availability from component count without end-to-end failure evidence.
- Leave standby paths untested until an incident.

## SHOULD
- Design failures to be bounded, observable, and automatically recoverable where safe.

## Exceptions
Untested scenarios require explicit risk, reason, owner, and scheduled validation.

## Verification
Review dependency maps, redundancy state, failure tests, convergence telemetry, recovery times, and post-test configuration.