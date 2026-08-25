# IDS and IPS Engineering

## Purpose
Deploy and tune network intrusion detection/prevention controls that produce actionable detections without unacceptable disruption.

## When to use
Use for IDS/IPS deployment, signature tuning, false-positive reduction, incident response, or coverage review.

## Inputs
Traffic patterns, asset criticality, threat intelligence, signatures, alerts, packet evidence, performance constraints.

## Context to inspect
Sensor placement, encrypted traffic, bypass paths, rule sets, inline failover, packet loss, SIEM integration.

## Core knowledge
Signature and anomaly detection, inline vs passive modes, evasion, encrypted visibility, false positives/negatives, throughput constraints.

## Procedure
1. Define detection objectives and critical traffic.
2. Place sensors at meaningful boundaries.
3. Establish baseline traffic and capacity.
4. Enable relevant rule families.
5. Tune noisy signatures using evidence.
6. Promote blocking only for high-confidence cases.
7. Integrate context and alert routing.
8. Exercise detections with safe test traffic.
9. Review misses after incidents.

## Decision points
Use prevention for high-confidence threats with low business false-positive cost; detection where blocking risk is high. Decrypt only under approved policy.

## Common failure patterns
Enabling every rule, alert floods, packet drops, blind encrypted paths, blocking without rollback, no asset context.

## Verification
Measure packet capture health, detection tests, false-positive rate, alert delivery, and inline failure behavior.

## Expected output
Sensor policy, tuned rules, coverage map, validation results, operational thresholds.

## Stop conditions
Stop blocking changes if sensor capacity is uncertain, rollback is unavailable, or false-positive impact cannot be bounded.