# DLQ Replay Review

## Purpose
Determine whether quarantined messages are safe to replay after the underlying defect is corrected.

## Trigger
A code/config/data fix exists and one or more DLQ messages are candidates for replay.

## Inputs
Triage result, fix commit/build, replay candidate list, current schema, consumer tests, and approval record.

## Procedure
1. Confirm the original failure classification and evidence are preserved.
2. Verify the fix addresses the demonstrated failure rather than suppressing it.
3. Re-run the failing message against a non-production consumer or deterministic test harness.
4. Confirm acknowledgement/idempotency behavior prevents duplicate side effects.
5. Check message age, schema compatibility, downstream dependencies, and business-rule validity.
6. Select the smallest replay batch; default to one message for the first verification.
7. Require explicit human approval using `templates/replay-approval.md` before production replay.
8. After approval, replay through the platform's normal queue API/tool, never by bypassing broker semantics.
9. Observe processing outcome and downstream side effects before increasing batch size.
10. Stop immediately on a repeated deterministic failure or unexpected duplicate side effect.

## Verification
Replay is verified only when the message is consumed exactly as expected, acknowledgements complete, no duplicate side effect is observed, and relevant downstream state/tests are correct.

## Failure handling
Transient platform failure: retry the replay operation at most twice without changing the candidate message. Repeated failure: stop and preserve broker response/logs. Deterministic consumer failure: return the message to quarantine and reopen investigation.

## Stop conditions
No approval, stale/unverifiable message, incompatible schema, failed idempotency check, or evidence of duplicate side effects.
