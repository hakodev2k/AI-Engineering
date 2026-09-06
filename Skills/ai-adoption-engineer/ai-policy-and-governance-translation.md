# AI Policy and Governance Translation

## Purpose
Translate enterprise AI policies into concrete implementation and operating requirements that delivery teams can execute and verify.

## When to use
Use when moving from experimentation to approved production use, especially where policies reference risk tiers, data handling, model use, human oversight, or prohibited activities.

## Inputs
AI policies, security standards, privacy rules, legal requirements, use-case design, data flows, vendor/model details, and operating model.

## Context to inspect
Inspect policy language, exception processes, data classification, retention, access controls, audit requirements, model restrictions, approval gates, and prior risk decisions.

## Core knowledge
Policies usually describe intent and boundaries, not implementation detail. Senior adoption engineering converts each applicable control into a testable obligation, identifies evidence, and avoids inventing requirements not supported by policy.

## Procedure
1. Identify policies applicable to the use case.
2. Extract mandatory, conditional, and advisory requirements.
3. Map each requirement to the relevant workflow or system component.
4. Define the concrete control or operating practice needed.
5. Identify evidence required to prove compliance.
6. Assign an owner and verification point.
7. Separate unresolved interpretation questions from implementation work.
8. Document approved exceptions and expiry conditions.
9. Recheck obligations when model, data, or scope changes.

## Decision points
Escalate ambiguous legal or policy interpretation rather than guessing. Prefer controls that are enforceable by system design over training-only controls when consequences are significant.

## Common failure patterns
Copying policy text into a checklist, assuming vendor compliance transfers to the application, missing conditional requirements, and treating a one-time approval as permanent.

## Verification
Every applicable mandatory requirement must map to an implemented control, evidence source, owner, and review point.

## Expected output
A policy-to-control matrix with implementation requirements, evidence, owners, exceptions, and unresolved interpretations.

## Stop conditions
Stop when a required policy interpretation needs authority the delivery team does not possess or when a mandatory control cannot be implemented.