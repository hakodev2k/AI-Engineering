# Email Compliance and Consent Operations

## Purpose
Translate consent, preference, unsubscribe, data-retention, and messaging-policy requirements into enforceable sending controls that also protect deliverability and recipient trust.

## When to use
Use when launching a new email program, changing acquisition sources, entering new jurisdictions, redesigning preference centers, or investigating complaints tied to user expectations. This Skill does not replace qualified legal advice.

## Inputs
Applicable business/legal requirements, message classes, consent records, acquisition sources, preference schema, unsubscribe flows, suppression rules, retention policy, and audit needs.

## Preconditions
Obtain authoritative policy/legal interpretation for ambiguous regulatory requirements. Distinguish operational implementation from legal determination.

## Context to inspect
Inspect consent timestamp/source/scope, proof records, list imports, transactional-vs-promotional classification, preference-center behavior, one-click/list-unsubscribe support where applicable, opt-out propagation, re-subscription, and provider requirements.

## Core knowledge
Mailbox-provider requirements and law are overlapping but distinct. Clear consent and fast opt-out reduce complaints and reputation risk. A technically valid send can still violate user expectation. Suppression must survive provider migrations and batch pipelines.

## Procedure
1. Catalog message classes and their business purposes.
2. Map each class to authoritative eligibility and consent rules.
3. Define required evidence fields for consent and preference changes.
4. Review every acquisition/import path for provenance and expectation.
5. Enforce eligibility before provider submission.
6. Implement accessible unsubscribe/preference mechanisms appropriate to the message class.
7. Set bounded opt-out propagation and test every downstream sender.
8. Define controlled re-subscription with fresh evidence.
9. Minimize and retain consent/suppression data according to policy.
10. Audit campaign/list exports for bypass paths.
11. Monitor complaints as an operational signal that formal eligibility may not match user expectation.
12. Periodically reconcile policy changes with implementation.

## Decision points
When legal interpretation is uncertain, escalate rather than encoding assumptions. Keep essential security/transactional exceptions narrowly defined. Use stricter internal quality controls when provider rules exceed minimum legal obligations.

## Common failure patterns
Purchased or provenance-poor lists, delayed unsubscribe propagation, hidden opt-out UX, classifying promotional mail as transactional, losing consent evidence, clearing suppressions during migrations, and inconsistent rules across providers.

## Verification
Trace representative recipients from consent through send and unsubscribe; prove ineligible recipients are blocked across all paths; reconcile preference changes and audit logs; validate provider-required unsubscribe headers/behavior where applicable.

## Expected output
An auditable eligibility and consent-control model with message classification, evidence, suppression, and operational checks.

## Stop conditions
Stop affected sends when consent provenance is materially uncertain, opt-out cannot be enforced, or authoritative legal/policy guidance is required for a disputed classification.