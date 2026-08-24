# Skill — Consequential Action Authorization Analysis

## Purpose
Determine whether a proposed A2A side effect has sufficient exact, current and replay-safe authorization.

## Trigger
Before payment, deployment, account/credential mutation, destructive repository action, production write, or other material external side effect.

## Inputs
Authenticated caller identity, target receiver, task/message, semantic action, canonical parameters, purpose, authorization envelope, consumption ledger and downstream idempotency semantics.

## Preconditions
No side effect has occurred for this authorization ID in the current execution attempt.

## Required context
Identity propagation path, capability permission, exact request bytes/digests, action risk, approval provenance and downstream reconciliation API.

## Allowed tools
Read-only identity/config inspection, deterministic verifier, hashing/canonicalization tools, downstream status query after an ambiguous outcome.

## Constraints
Do not disclose credentials. Do not broaden authorization. Do not execute the action during analysis.

## Procedure
1. Record observed caller identity and how it was authenticated.
2. Confirm protocol/task/skill authorization separately.
3. Canonicalize the current message and action parameters and compute digests.
4. Compare the current request with the exact envelope using the verifier.
5. Confirm TTL and one-use status.
6. For dangerous/irreversible actions, confirm human approval is bound to this envelope ID/content.
7. Confirm atomic consumption or downstream idempotency semantics before execution.
8. Produce Facts, Evidence, Assumptions, Decision, Risks and Verification status without hidden chain-of-thought.

## Decision points
Block on identity ambiguity, binding mismatch, expiry, replay, missing high-risk approval, or absence of a safe strategy for ambiguous outcomes.

## Expected output
A deterministic allow/block decision plus the evidence needed by the execution hook.

## Metrics
Exact-envelope coverage, mismatch/replay/expiry blocks, blind retries, duplicate side effects and approval-binding coverage.

## Verification
An independent security verifier reproduces the request/envelope match and replay test.

## Failure handling
Do not retry failed authorization automatically. Correct deterministic evidence once if malformed; otherwise stop and escalate.

## Stop conditions
Verified exact authorization or any blocking condition.