# Quota, Procurement, and Lead-Time Planning

## Purpose
Ensure future AI capacity can actually be acquired before forecast demand arrives by modeling cloud quota, hardware procurement, installation, and approval lead times.

## When to use
Use for quarterly planning, rapid growth, new regions, accelerator shortages, reserved-capacity purchases, or datacenter expansion.

## Inputs
Demand forecast, current quotas, vendor lead times, procurement process, delivery schedules, rack readiness, cloud reservation options, approval thresholds.

## Preconditions
Capacity demand includes scenarios and uncertainty, not only a point forecast.

## Context to inspect
Provider quotas, contract commitments, hardware supply, datacenter power/cooling, logistics, security approvals, budget cycle, firmware/driver qualification.

## Core knowledge
Capacity is useful only if available before demand. Long lead-time resources require earlier decisions and larger uncertainty buffers than elastic cloud capacity.

## Procedure
1. Map each capacity source to its end-to-end acquisition lead time.
2. Compare forecast exhaustion dates with acquisition dates.
3. Identify quotas that can block emergency scale-out.
4. Submit quota and procurement requests before threshold dates.
5. Maintain alternatives for constrained hardware.
6. Track delivery and qualification milestones.
7. Reforecast when lead times or demand change.
8. Escalate schedule risk before reserve falls below policy.

## Decision points
Use reservations or purchases when stable demand and supply risk justify commitment; retain elastic capacity for uncertainty when available.

## Common failure patterns
Treating approved budget as delivered capacity, discovering quota limits during incidents, ignoring qualification time, and ordering exactly at forecast demand.

## Verification
Every forecasted capacity need maps to a funded, quota-approved, deliverable source with schedule margin.

## Expected output
A capacity acquisition timeline with lead times, owners, risks, and decision deadlines.

## Stop conditions
Escalate when demand arrival precedes feasible capacity acquisition and no validated alternative exists.