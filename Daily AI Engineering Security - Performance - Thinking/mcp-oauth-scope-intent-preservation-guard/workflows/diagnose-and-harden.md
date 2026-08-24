# Workflow: Diagnose and Harden MCP OAuth Scope State

## Trigger
Unexpected interactive reauthorization, lost refreshability, `insufficient_scope`, configured scope mismatch, or an OAuth/SDK upgrade.

## Goal
Find the first point where scope intent diverges, implement the smallest safe correction, and prove the correction without handling secrets.

## Inputs
Sanitized scope configuration, metadata, granted-scope observations, challenge scopes, analyzer results, and test command.

## Baseline
Record required scopes, actual requested scopes, granted scopes, refresh expectation, and whether a representative background operation survives access-token expiry.

## Context
Follow `rules/oauth-scope-integrity.md` and `skills/oauth-scope-diagnosis.md`.

## Stages
1. **Observe** — capture sanitized scope sets and failure timing.
2. **Measure baseline** — run `python scripts/mcp_scope_guard.py <input.json> --pretty` and existing auth tests.
3. **Diagnose** — identify the first mutation where a required scope disappears or step-up ceases to be a union.
4. **Form hypothesis** — name exactly one precedence/merge branch expected to cause the divergence.
5. **Implement improvement** — change only that branch; do not broaden permissions to mask failure.
6. **Measure again** — repeat analyzer and tests against identical fixtures.
7. **Improved?** — if no, collect one new observation and repeat diagnosis; maximum two implementation attempts.
8. **Independent verification** — hand to `subagents/oauth-verifier.md`.
9. **Complete** — publish only sanitized evidence and status.

## Responsible agent
Implementation agent owns stages 1–7. OAuth Scope Verifier owns stage 8.

## Tools
Static source inspection, analyzer script, unit tests, sanitized request metadata, protocol docs.

## Outputs
Baseline, root cause, changed invariant, before/after scope sets, test result, independent verdict.

## Checkpoints
- CP1: explicit required scopes identified.
- CP2: first divergence observed rather than inferred.
- CP3: no required scope weakened.
- CP4: independent verification complete.

## Metrics
Required-scope loss count, step-up union correctness, background refresh survivability, test pass rate.

## Retry policy
Maximum two implementation attempts. Each retry requires new evidence; repeating the same test without new information is not a retry strategy.

## Stop conditions
Stop on credential exposure risk, unsupported mandatory scope, ambiguous operator intent, or two failed evidence-backed attempts.

## Failure path
Revert the attempted auth change, retain sanitized diagnostics, escalate with the exact invariant that could not be preserved.

## Verification
`python -m unittest discover -s tests -p 'test_*.py'` from the package root, plus representative client integration verification when available.

## Definition of Done
Implemented: deterministic merge/preflight behavior exists. Measured: before/after scope sets are captured. Verified: tests pass, independent verifier approves, and no required scope is silently lost.
