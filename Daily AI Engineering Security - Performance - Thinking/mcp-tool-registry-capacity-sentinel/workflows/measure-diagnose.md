# Workflow: Measure and Diagnose

## Trigger
Pre-task check, missing tool, connector drift, or large tool-catalog change.

## Goal
Identify the exact capability mismatch before changing configuration.

## Inputs
Task requirements, server inventories, client registry, connector status, capacity documentation.

## Baseline
Capture advertised count/set, visible count/set, required set, retention ratio, required coverage, and registry fingerprint.

## Context
Keep Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, and Verification status explicit. Do not expose hidden chain-of-thought.

## Stages
1. Define required capabilities.
2. Capture advertised inventory.
3. Capture visible inventory.
4. Run sentinel.
5. Classify mismatch.
6. Form one falsifiable root-cause hypothesis.
7. Validate with logs/config or one controlled action.

## Responsible agent
Performance/reliability investigator; Capability Verifier remains independent.

## Tools
MCP inventory, client registry, logs, sentinel.

## Outputs
Baseline, inventory delta, hypothesis, recommended recovery.

## Checkpoints
Do not continue to task planning with missing required capabilities.

## Metrics
Retention ratio, required coverage, missing count, fingerprint drift.

## Retry policy
At most 2 evidence-gathering retries for transient enumeration errors.

## Stop conditions
Confirmed capacity/filter issue with missing required tool; unresolved state after 2 retries; permission conflict.

## Failure path
Block task, preserve evidence, escalate.

## Verification
Root cause must explain observed inventory delta.

## Definition of Done
Mismatch is measured, not guessed; recovery target is concrete and testable.