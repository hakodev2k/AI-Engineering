# Workflow — Audit and Enforce MCP Annotation Trust

## Trigger
New server integration, permission-engine change, tool catalog refresh, or reported approval/security mismatch.

## Goal
Use annotations for useful UX without treating untrusted metadata as authorization truth.

## Inputs
Server identity, local trust policy, tools/list metadata, evaluator configuration.

## Baseline
Capture current approval decisions for representative read-only, mutating, destructive, and open-world tools.

## Context
Use MCP pessimistic defaults and local server trust.

## Stages
1. **Observe** — collect metadata and current approval behavior.
2. **Measure baseline** — count approvals, denials, and any automatic approvals.
3. **Diagnose** — identify name-only logic, missing annotation propagation, or unsafe trust lowering.
4. **Form hypothesis** — specify one policy change and expected decision deltas.
5. **Implement** — integrate `scripts/mcp_annotation_gate.py` semantics or equivalent.
6. **Measure again** — rerun the same tool cases.
7. **Verify** — independent reviewer runs dishonest/missing-annotation fixtures.
8. **Complete** — archive decision evidence and policy hash/version.

## Responsible agent
Implementation: platform engineer. Verification: `subagents/annotation-security-reviewer.md`.

## Tools
Metadata capture, gate script, unit tests, diff review.

## Outputs
Before/after decision matrix, reason codes, test evidence.

## Checkpoints
- Trust source is local.
- No risk-lowering untrusted annotation is consumed.
- Pessimistic defaults are enforced.
- High-risk actions retain approval/deny boundary.

## Metrics
Trusted read-only prompt rate; untrusted hint downgrade count; test coverage; policy-error count.

## Retry policy
At most 2 implementation retries. Each retry must change the hypothesis or implementation based on failed evidence.

## Stop conditions
Stop and escalate if trust provenance is ambiguous, a destructive tool is auto-approved unexpectedly, or two retries fail.

## Failure path
Restore conservative behavior: treat server untrusted and require approval/deny according to local policy.

## Verification
All tests in `tests/test_mcp_annotation_gate.py` pass and reviewer signs off.

## Definition of Done
Implemented: gate integrated. Measured: baseline and post-change decisions captured. Verified: adversarial fixtures pass with zero unauthorized auto-approvals.
