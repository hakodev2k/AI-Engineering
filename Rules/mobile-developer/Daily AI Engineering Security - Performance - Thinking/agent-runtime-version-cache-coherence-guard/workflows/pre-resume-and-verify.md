# Workflow: Pre-Resume Coherence and Verification

## Trigger
A persisted session is resumed after pause/update, through another entrypoint, or by automation.

## Goal
Prevent accidental expensive cold-cache resumes caused by runtime skew while allowing deliberate migrations with evidence.

## Inputs
Previous/current fingerprint, context estimate, policy, usage telemetry.

## Baseline
Record the last warm request's cache-read/create tokens and runtime fingerprint.

## Stages
1. **Observe:** collect immutable metadata and session context estimate.
2. **Measure baseline:** establish last warm reuse ratio and last client/entrypoint.
3. **Diagnose:** run `scripts/cache_coherence_guard.py`.
4. **Hypothesize:** classify expected miss cause: runtime drift, TTL/eviction, intentional context change, or unknown.
5. **Decision checkpoint:** allow matched runtime; require reason for intended migration; block unexplained high-cost mismatch.
6. **Implement improvement:** reconcile executable/entrypoint selection or record one intentional re-baseline. Never weaken safety context.
7. **Measure again:** capture first two resumed provider requests.
8. **Verify:** compare reuse ratio against `config/policy.json` and confirm fingerprint remains stable.

## Responsible agent
Cache Coherence Investigator collects evidence. Runtime owner performs environment changes. An independent verifier confirms post-resume telemetry.

## Tools
Version inspection, transcript/usage parser, hashing, package script.

## Outputs
Decision JSON, audit evidence, before/after metrics, verification state.

## Checkpoints
- No raw secrets in stored fingerprints.
- Rebaseline reason exists when required.
- First and second resumed requests are attributable to the intended entrypoint.
- Safety/tool policy remains unchanged unless the change itself was intended.

## Metrics
Cache reuse ratio, cache-create tokens, resume latency, predicted-vs-actual rewrite, number of mismatched resumes.

## Retry policy
At most one intentional re-baseline per fingerprint transition. Git/network telemetry reads may retry twice with exponential backoff; model resumes are not used as telemetry retries.

## Stop conditions
Stop on repeated fingerprint alternation, second unexpected cold request, unknown executable identity, or any proposal to remove required safety context for cache reuse.

## Failure path
Mark `unverified`, preserve evidence, disable automatic continuation for the affected session, and hand off to the runtime owner.

## Verification
Improvement is Verified only when comparable later resumes maintain the intended fingerprint and meet the configured reuse threshold without correctness/security regression.

## Definition of Done
Evidence documented; baseline captured; mismatch classified; policy enforced; no more than one rebaseline; two-request post-resume measurement completed; risks recorded; independent verification complete.
