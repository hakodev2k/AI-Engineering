# Database Auditing

## Purpose
Create attributable evidence for security-relevant database activity without overwhelming operations or exposing sensitive content.

## When to use
Use for compliance, privileged monitoring, investigations, new databases, or audit-coverage gaps.

## Inputs
Audit requirements, database capabilities, identity model, log platform, retention policy, and sensitive-operation inventory.

## Context to inspect
Inspect login events, privilege changes, schema changes, sensitive reads, administrative commands, audit bypass privileges, and log destinations.

## Core knowledge
Audit quality requires identity, action, target, time, outcome, and trustworthy delivery. Excessive statement logging can leak secrets and create unusable volume.

## Procedure
1. Define security questions the audit trail must answer.
2. Select high-value events and objects.
3. Capture successful and failed privileged actions where useful.
4. Include stable identity and session correlation.
5. Route logs to protected centralized storage.
6. Restrict audit configuration and deletion rights.
7. Define retention and access controls.
8. Tune noise without dropping required evidence.
9. Test representative events end to end.

## Decision points
Use native database audit facilities for authoritative events; supplement with platform telemetry when context is missing. Record statement text only when justified and appropriately redacted.

## Common failure patterns
Audit enabled but not exported, shared identities, unbounded logging cost, missing failed attempts, sensitive values in logs, and administrators able to erase their own trail.

## Verification
Generate known events and prove timely, intact, attributable arrival and retention.

## Expected output
A documented audit policy with validated evidence paths.

## Stop conditions
Escalate when required events are unsupported or logging creates unacceptable confidentiality, cost, or availability risk.