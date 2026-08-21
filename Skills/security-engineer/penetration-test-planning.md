# Penetration Test Planning

## Purpose
Plan scoped, authorized security testing that targets meaningful attack paths while controlling operational and legal risk.

## When to use
Use before external or internal penetration tests, red-team-style validation, major launches, or high-risk architecture changes.

## Inputs
System scope, threat model, asset inventory, test environment, authorization, business constraints, testing window, points of contact.

## Context to inspect
Public endpoints, authentication flows, privileged roles, APIs, network boundaries, sensitive data, third-party systems, monitoring, and incident-response contacts.

## Core knowledge
Penetration testing should validate realistic attack paths under explicit authorization. Scope, rules of engagement, data handling, and stop conditions are as important as technical test depth.

## Procedure
1. Define objectives tied to specific risks or controls.
2. Establish in-scope assets, environments, and identities.
3. List explicitly excluded systems and actions.
4. Obtain documented authorization and responsible contacts.
5. Define test windows, rate limits, and operational safeguards.
6. Prepare dedicated test accounts and non-sensitive data where possible.
7. Specify evidence handling, retention, and confidentiality rules.
8. Define escalation and emergency stop procedures.
9. Require reproducible findings with business impact and remediation guidance.
10. Plan remediation verification and regression testing.

## Decision points
Use production testing only when risk and business value justify it and explicit approval exists. Prefer staging for destructive or availability-sensitive techniques.

## Common failure patterns
Ambiguous scope, testing third parties without authorization, using real sensitive data unnecessarily, no emergency contact, findings without reproduction evidence, and no retest plan.

## Verification
Authorization, scope, exclusions, accounts, contacts, evidence handling, and stop conditions are documented before testing begins.

## Expected output
A clear rules-of-engagement and penetration-test plan tied to risk objectives and safe verification.

## Stop conditions
Stop immediately when authorization is unclear, unexpected production impact occurs, an out-of-scope asset is reached, or sensitive evidence cannot be handled safely.