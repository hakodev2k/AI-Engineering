# Mitigation Validation

## Purpose
Verify that a proposed fix closes an AI security finding without merely blocking the known proof-of-concept or degrading legitimate behavior unacceptably.

## When to use
Use after prompt, model, policy, authorization, retrieval, sandbox, or application changes intended to remediate a red-team finding.

## Inputs
Original finding, root cause, mitigation diff/configuration, regression tests, attack variants, benign workloads, and performance/utility baselines.

## Context to inspect
Identify which layer changed and which alternate paths remain. Review side effects on latency, cost, usability, and operations.

## Core knowledge
Patch validation requires invariant-based testing. Attackers adapt wording and route; therefore a fix must address the failure mechanism, not a single payload.

## Procedure
1. Re-run the original proof on the fixed build.
2. Generate nearby variants that preserve the attack mechanism.
3. Test alternate channels, turns, tools, and modalities where applicable.
4. Verify enforcement at the intended trust boundary.
5. Run benign near-neighbor cases for false positives.
6. Compare utility, latency, and cost baselines.
7. Check observability and alert behavior.
8. Confirm regression tests are stable and versioned.
9. Record residual risk and closure evidence.

## Decision points
Reject prompt-only mitigations when the root cause is authorization or isolation. Accept partial mitigations only with explicit residual-risk ownership and compensating controls.

## Common failure patterns
Testing only the exact exploit string; no benign controls; changing both fix and tests simultaneously; ignoring alternate tool paths; declaring fixed after one sample.

## Verification
Closure requires evidence that the attack family is materially constrained, protected invariants hold, and acceptable product behavior remains intact.

## Expected output
A remediation-validation record with pass/fail evidence, residual risk, and regression coverage.

## Stop conditions
Do not close when root cause remains untested, critical variants still succeed, or residual risk lacks an accountable owner.