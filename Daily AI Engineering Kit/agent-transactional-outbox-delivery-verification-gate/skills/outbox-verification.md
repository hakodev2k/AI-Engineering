# Skill: Outbox Verification

## Purpose
Independently prove that the repaired write-and-publish path does not lose committed events and safely tolerates duplicate delivery.

## Inputs
Changed files, investigation evidence, test results, scanner output, approval records.

## Required context
Affected write path, outbox persistence, dispatcher, consumer idempotency/deduplication, relevant tests.

## Allowed tools
Read-only repository inspection, build/test commands, static scanner, evidence validator.

## Forbidden actions
Do not edit implementation code while acting as verifier. Do not weaken tests, retry policies, or security controls to obtain a pass.

## Procedure
1. Reconstruct the transaction and delivery path without relying on the implementer's narrative.
2. Verify business state and outbox insertion share one atomic transaction.
3. Verify a rollback leaves neither business state nor a committed outbox record when the operation fails.
4. Verify dispatcher failure leaves work retryable.
5. Verify success is marked durably and prevents uncontrolled repeat processing.
6. Verify duplicate publish after crash/retry is tolerated by the consumer or equivalent mechanism.
7. Verify poison/terminal failures are bounded and surfaced.
8. Run applicable build, test, lint/static commands.
9. Review scanner findings and require an evidence-backed explanation for any high finding.
10. Validate the evidence JSON.
11. Set `verification_status` to `verified`, `failed`, or `blocked`.

## Expected output
Independent verification decision, commands/evidence, unresolved risks.

## Failure handling
Do not retry implementation yourself. Return a specific failure to the Implementation Agent. Maximum two implementation retries for the workflow.

## Stop conditions
Mark blocked if runtime/broker semantics necessary to prove correctness are unavailable, or if an approval-required action is needed.
