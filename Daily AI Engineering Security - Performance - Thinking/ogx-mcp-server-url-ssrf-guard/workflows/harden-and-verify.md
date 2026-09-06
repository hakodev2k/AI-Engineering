# Workflow: Harden and Verify MCP Egress

## Trigger
SSRF finding or addition/change of MCP remote transport.

## Goal
Make caller-controlled MCP routing incapable of reaching unauthorized network destinations.

## Inputs
Threat-model inventory, current policy, code revision, tests.

## Baseline
Record which unsafe test URLs currently reach the connection layer.

## Stages
1. Observe: map ingress-to-sink paths.
2. Measure baseline: run safe synthetic cases.
3. Diagnose: identify missing or inconsistent guards.
4. Hypothesize: define centralized authorization point.
5. Implement: integrate validator and credential policy.
6. Measure again: rerun identical cases.
7. Verify: independent verifier checks paths and logs.

## Responsible agent
Implementer for stages 1-6; Security Verifier for stage 7.

## Tools
Code search, unit tests, `scripts/validate_mcp_url.py`.

## Outputs
Patch, before/after result matrix, verifier report.

## Checkpoints
Block before implementation if trust boundary is unknown. Block release on any private/metadata bypass.

## Metrics
Unsafe destinations blocked; approved endpoints retained; coverage of sinks; test pass rate.

## Retry policy
Maximum 2 implementation iterations. Each retry must state a new evidence-backed hypothesis.

## Stop conditions
Two failed hypotheses, unknown network ownership, or unresolved credential exposure.

## Failure path
Revert unsafe change, preserve evidence, escalate to security owner.

## Verification
All required attack classes blocked and permission boundaries preserved.

## Definition of Done
Baseline and after-state recorded; tests pass; verifier signs off; no blocking residual risk.