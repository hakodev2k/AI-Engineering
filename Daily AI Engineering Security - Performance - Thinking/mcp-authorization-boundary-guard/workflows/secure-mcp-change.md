# Workflow: Secure MCP Authorization Change

## Trigger
Any change to OAuth, transport/session handling, resource routing, tool permissions, or sensitive tools.

## Goal
Prevent authenticated-but-unauthorized MCP calls from reaching tool execution.

## Inputs
Architecture diff, tool inventory, policy, test fixtures.

## Baseline
Run existing authorization tests and record allowed/denied matrix plus uncovered sensitive tools.

## Stages
1. **Observe** — collect current auth/session/tool behavior and public/incident evidence. Owner: security investigator.
2. **Measure baseline** — execute current negative cases; record any unauthorized success. Owner: verifier.
3. **Diagnose** — map failure to audience, principal, session, resource, tool/action, or approval boundary.
4. **Form hypothesis** — state the missing deterministic check and expected attack case it blocks.
5. **Implement** — enforce the check as close as possible to tool execution while preserving earlier validation. Owner: implementation agent.
6. **Measure again** — run `python scripts/run_negative_tests.py --policy config/policy.example.json` plus project tests.
7. **Independent verify** — Security Verifier reviews code and evidence.

## Checkpoints
- CP1: all sensitive tools have explicit policy.
- CP2: no missing audience/session-owner/resource checks.
- CP3: negative matrix passes without widened permissions.
- CP4: independent review passes.

## Metrics
Unauthorized successes; policy coverage; approval coverage; security-test pass rate.

## Retry policy
Maximum 2 implementation→verification cycles. Each retry must address a distinct documented failure.

## Stop conditions
Stop immediately on production-secret exposure, destructive live action, or inability to identify authoritative principal/resource ownership. Escalate after two failed cycles.

## Failure path
Preserve failing evidence, revert unsafe change if applicable, disable affected tool/transport when necessary, and request security-owner decision.

## Verification
A valid request must still work; all adversarial matrix cases must deny; logs must not expose credentials.

## Definition of Done
Evidence documented; baseline captured; implementation present; deterministic tests pass; approval boundary preserved; independent verification complete; residual risks documented; no blocking issue remains.
