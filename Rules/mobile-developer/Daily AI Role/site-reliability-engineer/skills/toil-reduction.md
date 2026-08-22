# Skill: Toil Reduction

## Purpose
Reduce repetitive operational work without automating unsafe ambiguity.

## Trigger
Recurring manual incident steps, repetitive tickets, repeated release checks, frequent low-value operator work.

## Procedure
1. Measure frequency, time cost, interrupt cost, risk, and cognitive load.
2. Confirm the work is repetitive, deterministic enough to automate, and tied to an operational outcome.
3. Remove unnecessary process before automating it.
4. Define safe input/output contract and approval boundary.
5. Implement the smallest idempotent automation with dry-run where possible.
6. Add meaningful exit codes, validation, logging, timeout, bounded retries, and rollback/abort behavior.
7. Pilot with low-risk scope and compare operator effort and failure rate.
8. Document ownership and failure fallback.

## Anti-patterns
Automating undocumented destructive action; replacing judgment with scripts; building a platform for a one-off problem.

## Outputs
Toil baseline, chosen target, automation, safety controls, measured improvement.

## Completion
Automation reliably reduces measured toil and has an owner and fallback.