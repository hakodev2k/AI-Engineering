# Service Token Policy Gate Workflow

## Trigger
401/403 investigation, service onboarding, auth config change, identity-provider migration, or PR touching token validation.

## Entry conditions
Target service and expected operation are known. Raw secrets/tokens are excluded from agent context.

## Inputs
Repository, policy configuration, sanitized claims, expected issuer/audience/scopes or roles, tests.

## Stages
1. **Context** — Auth Policy Explorer locates middleware, policies, routes, caller acquisition code, tests, and evidence.
2. **Plan** — classify required checks and affected boundaries; no edits yet.
3. **Execute** — implement the smallest configuration/code/test change if required.
4. **Deterministic gate** — run `python scripts/token_gate.py --claims-file examples/valid-claims.json --policy config/policy.yaml` plus negative fixtures.
5. **Test** — run `python -m unittest discover -s tests -v` and repository auth tests.
6. **Independent review** — Auth Policy Verifier confirms signature verification remains external and mandatory and all negative cases reject.
7. **Approval** — stop for any production relaxation, new privileged permission, issuer/audience broadening, secret change, or identity-provider change.
8. **Complete** — emit verification result and residual risks.

## Artifacts
Gate JSON output, test output, finding record using `schemas/verification-result.schema.json`, and any approved code/config diff.

## Checkpoints
- After context: issuer, audience, permission model, token type known.
- Before edits: intended authorization contract documented.
- Before completion: negative tests and independent verification complete.

## Retry rules
Transient repository/tool/network failures: maximum 2 retries per stage. Validation, permission, and business-rule failures are not retryable. Preserve command output and finding codes. Escalate after retry exhaustion.

## Failure paths
- Missing evidence -> `incomplete-evidence` and stop.
- Gate blocked -> preserve findings, fix only evidenced root cause, rerun once after change.
- Permission failure -> stop; never self-escalate.
- Test failure -> preserve logs; maximum one fix-test cycle for the same hypothesis, then escalate.

## Definition of Done
Expected issuer/audience/permission/lifetime/client identity are explicit; deterministic and application tests pass; negative cases reject; cryptographic validation remains enabled; required approval exists; no raw credentials are stored; independent verification is `verified`.
