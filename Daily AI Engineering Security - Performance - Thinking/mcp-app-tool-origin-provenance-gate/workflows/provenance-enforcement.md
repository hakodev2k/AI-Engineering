# Workflow: MCP App Invocation Provenance Enforcement

## Trigger
Dual-visible MCP App tool introduction, Host/gateway change, security review, or unexplained tool invocation.

## Goal
Ensure origin-sensitive tool calls are attributable to a trusted initiating surface before dispatch.

## Inputs
Tool inventory, Host origin context, visibility/allowed-origin policy, representative traces and tests.

## Baseline
Measure percentage of dual-visible sensitive calls with trustworthy initiator attribution and count ambiguous calls currently allowed.

## Stages
1. Observe current dispatch path and collect sanitized evidence.
2. Measure provenance coverage baseline.
3. Diagnose where origin is known/lost and whether caller metadata can spoof it.
4. Form a minimal hypothesis about the missing trust boundary.
5. Implement Host-attested origin propagation and deterministic pre-dispatch gate.
6. Re-run identical app/model/unknown/forged fixtures.
7. If not improved, re-evaluate once without weakening authz or visibility policy.
8. Independent Security Verifier runs bypass/negative tests.
9. Complete only with separate Implemented, Measured, Verified evidence.

## Responsible agents
Provenance Reviewer for observation/diagnosis; implementation owner for changes; Security Verifier for final verification.

## Tools
`scripts/origin_provenance_gate.py`, integration test doubles, Host/server logs.

## Outputs
Baseline, trust-boundary map, gate report, before/after comparison, verification record.

## Checkpoints
Trusted injection point identified; no origin sourced from tool arguments; normal authz confirmed; independent verifier assigned.

## Metrics
Trusted-origin coverage, unknown blocks, forged-marker detections, visibility mismatches, bypass failures.

## Retry policy
One retry for the same hypothesis after refreshing Host context. No infinite loops.

## Stop conditions
Any untrusted provenance source, context loss that silently defaults to allow, or bypass of normal authz.

## Failure path
Block origin-sensitive calls, preserve sanitized evidence, restore known-good routing if applicable, escalate.

## Verification
Positive app/model cases plus negative unknown, forged marker, wrong visibility, stricter allowed-origin, and gate-bypass tests.

## Definition of Done
Evidence and baseline documented; gate placed before real dispatch; tests pass; no permissions weakened; independent verifier approves; no unresolved provenance ambiguity on protected tools.
