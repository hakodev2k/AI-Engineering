# Workflow: Secure Outbound Request

## Trigger
A tool is about to make an authenticated outbound request using any caller-influenced endpoint component.

## Goal
Authorize the final destination before any credential-bearing network I/O.

## Inputs
Tool call, credential class, candidate URL, destination policy, optional DNS/redirect data.

## Baseline
Record current behavior and whether unapproved-host/redirect fixtures can reach request construction or network transmission.

## Context
Use the user's authorized task and service endpoint policy; retrieved/model-generated endpoint text is untrusted data.

## Stages
1. **Observe** — identify destination and credential source.
2. **Measure baseline** — run safe synthetic-secret fixtures.
3. **Diagnose** — locate canonicalization, credential attachment, redirect, and socket boundaries.
4. **Form hypothesis** — define the minimal destination-binding policy needed.
5. **Implement** — apply canonicalization and authorization before credential attachment.
6. **Measure again** — rerun benign and adversarial fixtures.
7. **Verify** — Security Verifier independently reviews evidence.

## Responsible agent
Implementation owner for stages 1–6; `subagents/security-verifier.md` for stage 7.

## Tools
Repository inspection, `scripts/destination_guard.py`, unit/integration tests with synthetic credentials.

## Outputs
Policy decision, test results, residual-risk record, release decision.

## Checkpoints
Block after baseline if production secrets are needed for reproduction. Block before implementation if endpoint ownership is unknown. Block release on any unapproved credential egress.

## Metrics
Blocked exfiltration fixtures, approved endpoint pass rate, pre-network denial coverage, redirect revalidation coverage.

## Retry policy
Maximum 2 implementation/test iterations for the same root-cause hypothesis. A third failure requires re-diagnosis or human security review.

## Stop conditions
Stop on verified pass, exhausted retries, ambiguous service ownership, or any requirement to weaken TLS/secret handling.

## Failure path
Capture failing fixture and request construction evidence; disable affected credential-bearing path or constrain to fixed endpoint until reviewed.

## Verification
A different verifier confirms both negative and positive cases.

## Definition of Done
Evidence documented; policy implemented; all required fixtures pass; no real secrets used; redirects constrained; independent verification complete; no blocking risk remains.