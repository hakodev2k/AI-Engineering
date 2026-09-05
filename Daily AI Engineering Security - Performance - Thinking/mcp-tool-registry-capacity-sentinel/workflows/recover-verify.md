# Workflow: Recover and Verify

## Trigger
A measured required-tool coverage failure.

## Goal
Restore required capabilities with minimum tool/context overhead and without weakening security.

## Inputs
Baseline contract, mismatch classification, platform limits, task requirements.

## Baseline
Pre-change sentinel output and inventory fingerprint.

## Stages
1. Choose smallest recovery: re-enumerate once, correct permission/filter, use documented deferred loading, or select only task-relevant tools.
2. Re-capture advertised and visible inventories.
3. Run sentinel.
4. If still blocked, perform one alternative recovery consistent with evidence.
5. Re-measure.
6. Capability Verifier independently confirms required coverage and safe probes.

## Responsible agent
Implementation/operations agent; Capability Verifier for final check.

## Tools
Connector/client configuration, inventory commands, sentinel, safe probes.

## Outputs
Recovery action, before/after metrics, final verifier decision.

## Checkpoints
No automatic permission widening. No destructive probes. No arbitrary increase in global tool limits unless platform supports it and impact is measured.

## Metrics
Required coverage target 100%; recovery attempts <=2; visible/advertised ratio; registry stability.

## Retry policy
Maximum 2 recovery actions total.

## Stop conditions
Stop after 2 failures, on security-policy conflict, or when platform capacity cannot accommodate required tools.

## Failure path
Keep task blocked; propose explicit re-scope or platform change to an authorized human.

## Verification
Safe tool probe plus independent inventory comparison.

## Definition of Done
Implemented recovery, measured complete coverage, independently verified, no security boundary weakened.