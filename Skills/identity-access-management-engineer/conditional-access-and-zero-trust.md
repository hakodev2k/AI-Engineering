# Conditional Access and Zero Trust

## Purpose
Apply contextual access policy based on identity, device, resource, risk, and session signals without creating brittle or unsafe exceptions.

## When to use
Use for conditional-access rollout, remote access, privileged access, device trust, risk-based authentication, or zero-trust modernization.

## Inputs
Identity populations, applications, device signals, network context, risk signals, authentication methods, exceptions, and business continuity needs.

## Context to inspect
Inspect policy precedence, exclusions, device compliance, named locations, risk engines, session controls, legacy authentication, service identities, and break-glass accounts.

## Core knowledge
Zero trust means continuously evaluating explicit signals and minimizing implicit trust; it is not a product. Conditional policies can cause broad lockouts, so staged deployment, telemetry, and emergency access are mandatory.

## Procedure
1. Inventory access paths and legacy bypasses.
2. Classify users, resources, and actions by risk.
3. Define required authentication/device/session conditions.
4. Start with observable report-only evaluation where supported.
5. Analyze impact and exception populations.
6. Roll out in controlled cohorts.
7. Protect privileged access with stronger conditions.
8. Keep break-glass identities narrowly excluded and heavily monitored.
9. Remove legacy authentication paths.
10. Continuously review exclusions and policy effectiveness.

## Decision points
Require managed devices where data sensitivity justifies it. Risk-based controls reduce friction but should not replace strong baseline requirements for privileged access.

## Common failure patterns
Broad trusted-network exemptions, permanent exclusions, blocking service accounts accidentally, untested policy interactions, relying on IP as identity, and no emergency rollback path.

## Verification
Simulate representative users/devices/locations, test denied paths, inspect policy evaluation logs, and conduct a lockout recovery exercise.

## Expected output
A staged conditional-access policy set with risk rationale, exceptions, monitoring, rollback, and verification evidence.

## Stop conditions
Stop when required signals are unreliable, emergency access is untested, or rollout could create unrecoverable administrative lockout.