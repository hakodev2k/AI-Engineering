# Threat Modeling AI Systems

## Purpose
Identify abuse paths and bypasses across models, prompts, retrieval, tools, memory, identities, and external systems.

## When to use
Use for new architectures, tool integrations, privilege expansion, incidents, and high-risk releases.

## Inputs
Architecture, data flows, permissions, contracts, abuse cases, controls, and protected assets.

## Context to inspect
Inspect ingress, instructions, external content, retrieval, state, identities, tools, egress, and side effects.

## Core knowledge
Cover injection, confused deputy, privilege escalation, exfiltration, poisoned context, unsafe tool composition, cross-tenant leakage, and resource abuse. Model refusal is not authorization.

## Procedure
1. Define assets/unacceptable outcomes.
2. Draw trust/authority boundaries.
3. Enumerate attacker inputs.
4. Trace data to privileged operations.
5. Enumerate chained bypasses.
6. Analyze multi-turn/tool/tenant cases.
7. Rank impact/exploitability.
8. Assign controls.
9. Create adversarial tests.
10. Reassess residual risk.

## Decision points
Prefer isolation and least privilege for severe consequences.

## Common failure patterns
Model-only analysis, trusted internal content, ignored tools, missing tenancy, and prompt security boundaries.

## Verification
High-severity paths are blocked/contained with telemetry.

## Expected output
Prioritized threat model, mitigations, tests, owners, residual risk.

## Stop conditions
Escalate unresolved privileged, irreversible, regulated, or cross-tenant paths.