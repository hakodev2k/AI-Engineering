# Product Security Privacy and Compliance

## Purpose
Integrate security, privacy, regulatory, and trust requirements into product decisions early enough to shape scope and design.

## When to use
Use for sensitive data, authentication, permissions, payments, regulated workflows, AI data usage, new regions, or third-party integrations.

## Inputs
Data flows, user roles, product requirements, jurisdictions, security policies, legal obligations, retention rules, and third-party terms.

## Context to inspect
Inspect data classification, consent, access boundaries, deletion/export behavior, audit needs, abuse scenarios, vendor processing, and incident implications.

## Core knowledge
Product managers should not make legal or security approvals themselves, but must surface requirements, minimize unnecessary data, and ensure controls are represented in product behavior and acceptance criteria.

## Procedure
1. Identify sensitive data and privileged actions.
2. Map collection, purpose, access, sharing, retention, and deletion.
3. Identify applicable organizational and regulatory requirements with specialists.
4. Minimize data and permissions to what the outcome requires.
5. Define consent, transparency, user controls, and audit behavior.
6. Add abuse and threat scenarios to requirements.
7. Obtain security/privacy/legal review at the appropriate stage.
8. Include controls in acceptance and launch criteria.
9. Verify operational processes for requests and incidents.

## Decision points
Prefer less collection and shorter retention when value is equivalent. Require stronger review when changes are irreversible, sensitive, or cross jurisdictional.

## Common failure patterns
Compliance as launch paperwork, collecting data just in case, hidden permissions, unclear deletion semantics, and relying on terms instead of product controls.

## Verification
Required reviewers approve; data flows match implementation; user controls and audit evidence work; no unnecessary sensitive data is introduced.

## Expected output
Product-level security/privacy requirements, approvals, controls, risks, and verification evidence.

## Stop conditions
Stop when required specialist approval is missing or product behavior would violate policy, contract, or law.