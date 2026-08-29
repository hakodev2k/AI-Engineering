# Workflow: Research, Diagnose, Harden, Verify

## Trigger
New MCP transport support, a transport security advisory, exposure of MCP management APIs, or changes to authentication/network/process-launch behavior.

## Goal
Remove caller control over privileged transport primitives while preserving explicitly approved MCP connectivity.

## Inputs
Repository, deployment config, approved MCP server inventory, authentication policy, runtime network policy, advisory/evidence set.

## Baseline
Record endpoint exposure, auth state, accepted transport fields, stdio launch semantics, remote URL/header semantics, redirect behavior, session limits, egress controls, and current negative-test results.

## Context
Use `skills/mcp-transport-threat-model.md` and enforce `rules/transport-control-plane-rules.md`.

## Stages
1. **Observe** — inventory MCP routes and configuration origins.
2. **Measure baseline** — run harmless local fixtures showing what input controls which effect.
3. **Diagnose** — map caller fields to process/network/session effects and missing checks.
4. **Form hypothesis** — state the minimum architecture change expected to break each path.
5. **Implement** — move privileged config to trusted sources; add destination/header/auth/session policy; retain egress controls.
6. **Static preflight** — run `python scripts/validate_mcp_policy.py <policy.json>`.
7. **Negative tests** — arbitrary shell string, shell/eval arguments, ungranted URL, private IP literal, URL credentials, encoded path tricks, restricted headers, missing auth, session-limit edge.
8. **Positive tests** — approved named stdio and approved remote server work.
9. **Independent verification** — reviewer attempts to falsify the hardening claims.

## Tools
Repository search, Python validator/tests, framework harness, local mock HTTP/SSE server, harmless stdio fixture, dependency/advisory tools.

## Outputs
Threat-boundary report, baseline, policy, implementation diff, before/after matrix, verifier result.

## Checkpoints
C1 privileged effects inventoried; C2 baseline reproduced safely; C3 hypothesis approved; C4 policy/tests pass; C5 independent verification pass.

## Metrics
Unsafe caller-controlled fields; denied attack cases; positive connection success rate; auth coverage; max sessions; regression-test pass rate.

## Retry policy
At most 2 implementation/verification cycles. Each retry must alter the hypothesis or implementation using new evidence; identical retries are forbidden.

## Stop conditions
Success requires C1–C5. Stop unsuccessfully after 2 failed cycles, unresolved secret exposure, or inability to prove the boundary.

## Failure path
Retain deny-by-default configuration, disable the affected MCP feature if needed, preserve evidence, and escalate to a human security/platform owner.

## Verification
Attack paths blocked, permission/auth boundaries preserved, tests pass, approved functionality intact.

## Definition of Done
Implemented, Measured, and Verified statuses all recorded with no blocking finding.
