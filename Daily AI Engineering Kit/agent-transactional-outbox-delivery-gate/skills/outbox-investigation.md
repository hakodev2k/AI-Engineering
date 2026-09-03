# Skill: Outbox Investigation

## Purpose
Build an evidence-backed map of the business write and event-delivery path before editing code.

## When to use
Before implementing or debugging transactional outbox behavior.

## Inputs
Repository root, task/incident description, optional logs or duplicate/missing message evidence.

## Preconditions
Repository is readable; production write access is not required.

## Allowed tools
Repository search/read, tests, local build, local database fixtures, non-destructive logs.

## Constraints
Do not edit code during discovery. Do not infer transaction scope from naming alone.

## Process
1. Identify the business command/handler and persistence entry point.
2. Locate outbox entity/table/model and every insertion site.
3. Trace the transaction boundary from start through business persistence and outbox persistence to commit.
4. Locate dispatcher scheduling/worker entry points.
5. Trace record selection, claim/lease/lock, publication, success update, failure update, and retry scheduling.
6. Identify message-ID creation and determine whether retry preserves identity.
7. Locate consumer deduplication/idempotency behavior or document that it is external/unknown.
8. Find tests nearest to each boundary.
9. Record facts with file/line or command evidence.
10. Record hypotheses separately, including the exact evidence needed to confirm each.

## Expected output
A propagation-style map: `business write -> outbox insert -> commit -> claim -> publish -> completion/failure -> retry -> consumer`.

## Verification
Every map edge must reference repository evidence or be marked unknown.

## Failure handling
If transaction ownership or external broker semantics cannot be determined, stop that line of inference and mark it unknown.

## Stop conditions
Stop before edits once the affected boundary and smallest testable hypothesis are clear.
