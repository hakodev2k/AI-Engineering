# Workflow: Baseline and Diagnose

## Trigger
Before changing a stateful agent workflow or after a reliability incident.

## Goal
Produce a repeatable baseline and evidence-supported root-cause hypothesis without premature implementation.

## Inputs
Task corpus, reset mechanism, state assertions, current agent configuration, trial budget.

## Baseline
Run each selected task for the configured minimum trials from identical reset state.

## Context
Use observable facts, assumptions, evidence, hypotheses, decisions, risks, and verification status. Do not collect hidden chain-of-thought.

## Stages
1. Validate task requirements and state assertions.
2. Verify reset idempotence.
3. Execute baseline trial matrix.
4. Calculate reliability metrics.
5. Group failures by observable signature.
6. Separate facts from assumptions.
7. Form up to two ranked hypotheses, each with falsifiable expected evidence.
8. Select one smallest intervention to test.

## Responsible agent
Reliability investigator; independent verifier is not involved in implementation.

## Tools
Sandbox/task runner, state checks, trace parser, gate script.

## Outputs
Baseline JSONL, metric report, failure clusters, hypothesis table, proposed intervention.

## Checkpoints
Do not implement until baseline has sufficient trials and reset/scoring is verified.

## Metrics
Pass rate, pass^n task rate, flaky/never-pass rates, collateral effects, harness-error rate.

## Retry policy
One infrastructure retry per proven transient; at most two diagnostic hypotheses.

## Stop conditions
Unreliable reset, unsafe side effect, insufficient evidence after two hypotheses, or invalid assertions.

## Failure path
Keep change/release blocked; preserve trial corpus; escalate evaluation design issue.

## Verification
A second reader can reproduce metric values from raw evidence.

## Definition of Done
Baseline is complete, failures are observable and classified, and the selected hypothesis is falsifiable.