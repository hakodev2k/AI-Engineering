# Workflow: Quarantine and Verify

## Trigger
A child agent completes an investigative/review task.

## Goal
Prevent unsupported or instruction-poisoned child text from controlling the parent.

## Inputs
Transcript, result, task type.

## Baseline
Measure current percentage of child results consumed without provenance checks and any unsupported-claim incidents.

## Stages
1. **Observe:** preserve transcript/result bytes.
2. **Measure:** run deterministic audit and count evidence events.
3. **Diagnose:** classify impersonation, credential steering, zero-tool claim, or evidence-backed result.
4. **Hypothesis:** suspect claims can be independently reproduced from primary sources.
5. **Verify:** independent verifier performs minimal read-only reproduction.
6. **Decide:** pass verified facts only; quarantine remaining prose.

## Checkpoints
Scanner verdict before parent action; verifier verdict before high-impact action.

## Retry policy
At most two evidence-reconstruction attempts.

## Failure path
If transcript is unavailable, malformed, or evidence remains unresolved, block high-impact action and escalate.

## Verification
Run regression tests and require malicious fixtures to exit `2` while benign evidence-backed fixture exits `0`.

## Definition of Done
No unsupported child claim is used as authorization or evidence for a high-impact action.
