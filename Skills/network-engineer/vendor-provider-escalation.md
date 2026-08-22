# Vendor and Provider Escalation

## Purpose
Escalate network faults to carriers, cloud providers, and vendors with precise evidence that accelerates diagnosis while retaining internal ownership of end-to-end service recovery.

## When to use
Use when evidence points beyond administrative control, hardware/software defects are suspected, circuits violate SLA, or specialized vendor analysis is required.

## Inputs
Service/circuit identifiers, timestamps, topology, symptoms, affected scope, logs, counters, captures, configuration, prior tests, SLA, and support entitlement.

## Context to inspect
Inspect provider demarcation, maintenance notices, redundant paths, internal evidence, contract severity criteria, and previous cases.

## Core knowledge
A provider ticket is not a substitute for internal diagnosis. Strong escalations state observed facts, expected behavior, tests already performed, impact, and a specific request. Preserve UTC/local timestamp clarity.

## Procedure
1. Confirm internal layers and demarcation evidence.
2. Gather service IDs, endpoints, timestamps, and impact.
3. Capture objective loss/latency/errors or protocol evidence.
4. State recent changes and what has been ruled out.
5. Open the correct severity with concise technical detail.
6. Request specific provider checks or telemetry.
7. Track case ownership and next update time.
8. Continue internal mitigation/failover in parallel.
9. Validate provider remediation independently.
10. Record final provider root cause and SLA implications.

## Decision points
Escalate severity based on actual impact and contract, not frustration. Request vendor engineering when first-line support cannot reconcile evidence or repeated defects exist.

## Common failure patterns
Tickets saying only “network slow,” missing timestamps/service IDs, no demarcation tests, waiting passively for provider response, accepting “no issue found” without evidence, and closing before independent validation.

## Verification
Confirm provider findings align with telemetry, service metrics recover, and previously failing tests pass.

## Expected output
A high-signal escalation record with evidence, provider response, mitigation, validation, and follow-up actions.

## Stop conditions
Escalate internally when support entitlement is missing, contractual authority is required, or provider requests risky production actions without change approval.