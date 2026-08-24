# Workflow — Authorize, Execute, Reconcile

## Trigger
A consequential A2A action is requested.

## Goal
Execute at most the exactly authorized side effect and prevent parameter substitution, wrong-recipient execution and replay.

## Inputs
Authenticated caller, receiver, task/message, action/parameters, purpose, envelope, approval evidence, consumption ledger and downstream idempotency/status capabilities.

## Baseline
Record current identity propagation, action authorization granularity, retry behavior, duplicate-side-effect history and human approval binding.

## Context
Apply `rules/consequential-action-authorization.md` and `skills/action-authorization-analysis.md`.

## Stages
1. **Observe:** record authenticated caller and current task/skill authorization.
2. **Bind:** canonicalize message and parameters; create/receive the exact envelope with bounded TTL and one-use authorization ID.
3. **Approve:** for dangerous/irreversible action, obtain human approval explicitly bound to the exact envelope.
4. **Pre-execution verify:** run `scripts/verify_authorization_envelope.py` against current request and consumption ledger.
5. **Prepare commit:** reserve atomic authorization consumption or downstream idempotency key.
6. **Execute once:** dispatch the exact verified action.
7. **Commit/reconcile:** persist consumption and outcome. If response is lost/ambiguous, query downstream state once before any further action.
8. **Verify:** independent security verifier confirms match, consumption and outcome evidence.

## Responsible agent
Executor performs the one authorized dispatch; `subagents/security-verifier.md` independently verifies.

## Tools
Verifier, hashes/canonicalization, immutable audit record, downstream idempotency/status interface.

## Outputs
Verified authorization decision, consumption record, execution outcome and reconciliation evidence.

## Checkpoints
After identity resolution, after human approval when required, immediately before dispatch, and after outcome reconciliation.

## Metrics
Envelope coverage, binding failures, replay blocks, blind retries, duplicate effects and exact approval coverage.

## Retry policy
Authorization failure: zero automatic retries. Deterministic malformed evidence may be corrected once before a new verification. Ambiguous execution: one downstream status reconciliation; never blind replay. A genuinely failed idempotent operation may be retried only under the same still-valid authorization/idempotency contract and explicit executor policy.

## Stop conditions
Any identity ambiguity, binding mismatch, expired/consumed authorization, missing required human approval, unsafe retry semantics, or unresolved outcome after one reconciliation query.

## Failure path
Preserve non-secret evidence, do not expand authorization, stop the side effect and escalate to the human operation/security owner.

## Verification
Run `python -m unittest tests/test_verify_authorization_envelope.py`, verify a used ID blocks replay, and integration-test an intentionally lost response to prove reconciliation avoids a second effect.

## Definition of Done
Implemented, Measured and Verified conditions in README are satisfied and no blocking authorization/replay issue remains.