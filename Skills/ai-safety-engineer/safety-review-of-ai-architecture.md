# Safety Review of AI Architecture

## Purpose
Review an AI system architecture for structural safety weaknesses before they become implementation defects or incidents.

## When to use
Use at design review, before major capability additions, or when legacy AI systems are being hardened.

## Inputs
Architecture diagrams, component responsibilities, data flows, identity, tool interfaces, deployment and monitoring design.

## Context to inspect
Trust boundaries, model context, retrieval, memory, tool execution, data stores, queues, external providers, operator controls, and failure modes.

## Core knowledge
Strong safety architecture uses defense in depth: minimize capabilities, isolate untrusted processing, enforce authorization deterministically, make side effects auditable, and design containment from the start.

## Procedure
1. Reconstruct the actual architecture from evidence.
2. Mark trusted and untrusted inputs and boundaries.
3. Identify where model outputs influence control flow or side effects.
4. Check least privilege and tenant isolation.
5. Review validation, confirmation, idempotency, and rollback around actions.
6. Review sensitive-data exposure and retention.
7. Check monitoring, kill switches, and degraded modes.
8. Trace representative abuse paths end to end.
9. Rank findings by consequence and exploitability.
10. Recommend structural fixes before prompt-level patches.

## Decision points
Prefer architectural isolation over probabilistic filtering for critical boundaries. Centralize enforcement only when it cannot become an uncontrolled single point of failure.

## Common failure patterns
Model as policy engine; broad shared credentials; no trust labels; unbounded memory; side effects without transaction controls; missing kill switch.

## Verification
Validate proposed controls with architecture tests, permission tests, and adversarial end-to-end scenarios.

## Expected output
A prioritized architecture safety review with evidence, remediation options, trade-offs, and verification plan.

## Stop conditions
Escalate when critical boundaries depend solely on model compliance or architecture evidence is insufficient to assess high-risk flows.