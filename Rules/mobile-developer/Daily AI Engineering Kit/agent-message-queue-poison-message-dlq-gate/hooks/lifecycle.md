# Lifecycle Hooks

## Pre-triage validation
**Trigger:** before investigation starts. **Preconditions:** sanitized message file exists. **Action:** run `python scripts/analyze_message.py <message.json> --out analysis.json`. **Expected:** structured classification output. **Failure:** malformed input or missing required metadata blocks automated triage. **Blocks:** yes for malformed input.

## Post-fix regression
**Trigger:** after consumer/producer fix. **Preconditions:** a reproducible test or sanitized failing envelope exists. **Action:** run the repository's targeted test command plus its normal build/test command. **Expected:** original failure is resolved and no relevant regression appears. **Failure:** preserve output and return to implementation; maximum two fix/test cycles. **Blocks:** yes.

## Pre-replay gate
**Trigger:** before any production DLQ replay. **Preconditions:** verification status is `passed`; completed approval record exists; idempotency/duplicate protection verified. **Action:** confirm batch size <= `max_replay_batch`, start with one message unless approval says otherwise, and record build/schema identifiers. **Expected:** replay is authorized and bounded. **Failure:** stop without queue mutation. **Blocks:** yes.

## Post-replay verification
**Trigger:** after each replay batch. **Preconditions:** replay operation returned a broker result. **Action:** verify consumer completion, acknowledgement, expected downstream state, and absence of duplicate side effects. **Expected:** verified success. **Failure:** stop further replay and retain broker/log evidence. **Blocks:** yes.

## Final package verification
**Trigger:** package maintenance or integration. **Action:** `python scripts/verify_package.py`. **Expected:** all required package artifacts exist and no omission markers are present. **Failure:** package is incomplete. **Blocks:** yes.
