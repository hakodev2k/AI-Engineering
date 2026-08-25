# EDR Investigation

## Purpose
Use endpoint telemetry to reconstruct suspicious execution, persistence, credential access and lateral movement without over-trusting single indicators.

## When to use
Use for suspicious processes, malware alerts, unusual scripting, persistence or endpoint-linked incidents.

## Inputs
EDR alert, process tree, command lines, hashes, signer data, file events, network connections, user sessions and host metadata.

## Context to inspect
Check sensor health, OS role, administrative tools, software deployment systems, prior alerts and endpoint isolation status.

## Core knowledge
Process lineage, execution context and behavior usually matter more than filenames. Signed software can be abused. Endpoint evidence is incomplete if the sensor was impaired or offline.

## Procedure
1. Validate host identity and sensor status.
2. Reconstruct process ancestry and descendants.
3. Inspect command line, token/user context and integrity level.
4. Correlate file, registry/service/task and network activity.
5. Check signer, prevalence and hash reputation as supporting evidence.
6. Identify credential or security-control interactions.
7. Search for the behavior across peer endpoints.
8. Build a timeline and determine persistence/scope.
9. Recommend containment based on active risk.
10. Preserve required artifacts before destructive remediation.

## Decision points
Isolate quickly when active command-and-control, credential theft or destructive behavior is credible; delay isolation only when operational harm outweighs risk and compensating controls exist.

## Common failure patterns
Treating hash reputation as verdict; ignoring parent process; deleting files before evidence capture; assuming sensor silence proves cleanliness.

## Verification
Confirm timeline consistency across endpoint and external telemetry, scope search completion, and effectiveness of containment/remediation.

## Expected output
Endpoint investigation record with process timeline, scope, confidence and response actions.

## Stop conditions
Escalate for memory/disk forensics, privileged credential exposure, critical infrastructure impact or unavailable endpoint evidence.