# Hooks: Tool Result Freshness

## Hook: post-read-tool-result
- **Trigger:** after a decision-relevant read tool returns.
- **Preconditions:** result may change during the workflow.
- **Action:** create/update a freshness record using the capture skill; validate with `scripts/validate-freshness-record.py`.
- **Expected result:** valid record bound to source/query/result/time.
- **Failure behavior:** block use of the result as evidence.
- **Blocking:** yes for decision-relevant mutable results.

## Hook: pre-decision
- **Trigger:** before implementation, retry/resume, deployment decision, dangerous action, or final verification that depends on mutable evidence.
- **Preconditions:** freshness records exist.
- **Action:** run `scripts/evaluate-freshness.py --record <record> --state <state> --events <events> --policy config/freshness-policy.json`.
- **Expected result:** `fresh`.
- **Failure behavior:** `refresh-required` routes to the refresh skill; `blocked` stops execution.
- **Blocking:** yes.

## Hook: post-state-change
- **Trigger:** after repository HEAD change, deployment, database mutation, configuration update, approval/revocation, or tracked external mutation.
- **Preconditions:** event can invalidate prior reads.
- **Action:** append a normalized invalidation event to the workflow event file and re-evaluate dependent records before reuse.
- **Expected result:** affected records become explicitly stale until refreshed.
- **Failure behavior:** treat freshness as unknown and block high-risk dependent actions.
- **Blocking:** yes for high-risk decisions.

## Hook: final-verification
- **Trigger:** before claiming task `verified`.
- **Preconditions:** all required records, state, events and reviewer evidence exist.
- **Action:** run `scripts/evaluate-freshness-gate.py`.
- **Expected result:** `verified`.
- **Failure behavior:** task may remain executed but must not be reported verified.
- **Blocking:** yes.