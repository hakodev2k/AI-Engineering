# Requirement Traceability Rules

## Purpose
Preserve the relationship between business outcomes, requirements, decisions, implementation, and verification.

## Scope
Requirements, business objectives, regulatory obligations, design decisions, stories, tests, releases, and change requests.

## MUST
- Trace every material requirement to a business objective, obligation, risk, or stakeholder need.
- Maintain forward traceability from approved requirement to implementation and verification evidence where applicable.
- Record when requirements are superseded, rejected, deferred, or changed and preserve the reason.
- Identify orphan requirements and untraced implementation scope before release approval.

## MUST NOT
- Treat ticket linkage alone as sufficient traceability when the business rationale is absent.
- Delete historical requirement decisions that explain current behavior.

## SHOULD
- Use stable identifiers or tooling that supports bidirectional traceability for high-risk or regulated work.

## Exceptions
Low-risk exploratory work may use lightweight traceability when no commitment or production change is created.

## Verification
Audit representative requirements end-to-end from source need through decision, delivery artifact, test evidence, and release outcome.