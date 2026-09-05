# Workflow: Unexpected Egress Recovery

## Trigger
Any connection, DNS request, proxy attempt, or externally observable side effect outside approved scope.

## Goal
Contain impact, preserve evidence, identify the failed boundary, and prevent recurrence without hiding the event.

## Inputs
Runtime/session ID, network logs, process tree, policy snapshot, destination/action details.

## Baseline
The last known approved policy and pre-run checker result.

## Stages
1. Terminate or network-isolate the affected agent runtime.
2. Preserve immutable logs, policy, process metadata, and relevant filesystem state.
3. Revoke exposed ephemeral credentials/tokens through approved incident procedures when evidence indicates exposure.
4. Classify failure: config drift, resolver mismatch, proxy bypass, alternate protocol, policy bug, approval bypass, or unknown.
5. Patch the enforcement layer; do not patch only the detection rule.
6. Replay using owned test endpoints.
7. Independent reviewer verifies closure.

## Responsible agent
Incident owner; implementation owner; independent Containment Reviewer.

## Tools
Runtime shutdown/quarantine controls, logs, config inspection, approved secret-rotation process, checker.

## Outputs
Incident evidence, root cause, remediation diff, replay results, residual risk.

## Checkpoints
No restart until root cause is evidenced. Human approval required for credential revocation or irreversible production action.

## Metrics
Time to containment; unauthorized attempts; externally visible effects; recurrence in replay.

## Retry policy
At most 2 controlled replay cycles.

## Stop conditions
Unknown root cause after two diagnostic cycles, repeated bypass, or inability to guarantee isolated replay.

## Failure path
Keep affected workflow disabled and escalate to security leadership.

## Verification
Replay proves the original path is blocked while required routes remain functional.

## Definition of Done
Incident contained, evidence preserved, root cause supported, attack path blocked, credentials handled safely, independent verification complete.