# Lifecycle Hooks

## pre-side-effect-plan
- **Trigger:** before any non-read-only tool call is planned.
- **Preconditions:** operation identity and target are known.
- **Action:** require a side-effect plan; run `python scripts/validate-plan.py --plan <plan.json> --policy config/side-effect-policy.json`.
- **Expected result:** exit 0.
- **Failure:** block execution.

## pre-simulation
- **Trigger:** immediately before dry-run/sandbox/mock execution.
- **Action:** run `python scripts/evaluate-gate.py --stage simulation --plan <plan.json> --policy config/side-effect-policy.json`.
- **Expected result:** decision `allow-simulation`.
- **Failure:** block simulation.

## post-simulation
- **Trigger:** after simulation evidence is captured.
- **Action:** validate plan and simulation record, then hand off to independent reviewer.
- **Expected result:** reviewer status is recorded for the same action ID and plan revision.
- **Failure:** block live admission.

## pre-live-execution
- **Trigger:** immediately before a live external effect.
- **Action:** run `python scripts/evaluate-gate.py --stage live --plan <plan.json> --simulation <simulation.json> --review <review.json> --approval <approval.json> --policy config/side-effect-policy.json` when approval is required.
- **Expected result:** decision `allow-live`.
- **Failure:** block live execution.

## post-live-execution
- **Trigger:** after an approved live action.
- **Action:** compare actual target/effect/request fingerprint with approved plan; flag divergence.
- **Failure:** stop retries and escalate; do not automatically repeat the live action.
