# Scoping and Rules of Engagement

## Purpose
Define an authorized, bounded penetration test that produces useful security evidence without creating uncontrolled operational or legal risk.

## When to use
Use before any penetration test, retest, red-team-style validation, or material expansion of an existing assessment. Do not begin intrusive testing without explicit authorization.

## Inputs
Written authorization, business objectives, asset inventory, environments, test window, contacts, prohibited actions, data-handling requirements, and known production constraints.

## Context to inspect
Review architecture, ownership, third-party dependencies, critical business periods, monitoring/escalation paths, prior incidents, and applicable compliance obligations.

## Core knowledge
Scope is a security control. Hostnames, IP ranges, cloud accounts, APIs, identities, physical locations, and social-engineering targets require explicit inclusion. Production safety, privacy, availability, and evidence handling matter as much as vulnerability discovery.

## Procedure
1. Confirm the accountable sponsor and written authorization.
2. Translate objectives into explicit in-scope assets and techniques.
3. Record exclusions and fragile systems.
4. Define permitted hours, source addresses, accounts, rate limits, and test data.
5. Establish emergency contacts and a kill procedure.
6. Define evidence retention, encryption, and deletion rules.
7. Agree severity and immediate-notification thresholds.
8. Define retest expectations and deliverables.
9. Resolve ambiguous ownership or third-party boundaries.
10. Obtain final approval before active testing.

## Decision points
Prefer non-production validation when equivalent evidence is possible. Use production only when necessary and explicitly approved. Reduce concurrency and exploit depth when availability risk exceeds the value of additional proof.

## Common failure patterns
Assuming discovered assets are automatically in scope, testing third parties, vague authorization, missing stop contacts, collecting excessive sensitive data, and changing scope informally.

## Verification
Verify authorization covers every planned target and technique, exclusions are documented, emergency contacts are reachable, and evidence handling is agreed.

## Expected output
An approved rules-of-engagement record with scope, constraints, contacts, safety controls, evidence policy, and stop criteria.

## Stop conditions
Stop if authorization is absent or ambiguous, ownership cannot be proven, a third-party boundary is crossed, or testing causes unexpected operational impact.