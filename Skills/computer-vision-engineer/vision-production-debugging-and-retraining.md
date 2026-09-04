# Vision Production Debugging and Retraining

## Purpose
Diagnose production vision failures systematically, identify root cause across data, model, runtime, and infrastructure layers, and retrain only when evidence shows model change is the correct intervention.

## When to use
Use for quality regressions, unusual false positives/negatives, latency incidents, device-specific failures, post-deployment drift, or planned model refreshes.

## Inputs
Incident description, model/preprocessing versions, logs and metrics, representative failing samples where authorized, deployment history, training/evaluation data, runtime/hardware details, and acceptance criteria.

## Preconditions
A known-good baseline or prior release exists for comparison and production evidence can be handled under applicable privacy/security rules.

## Context to inspect
Inspect recent releases, camera/input changes, decoding and preprocessing, model artifact hashes, thresholds/post-processing, device/runtime versions, resource saturation, prediction distributions, known data slices, and label/ontology changes.

## Core knowledge
A vision regression can originate before inference, inside the model, after inference, or in the environment. Retraining is inappropriate for pipeline bugs, threshold changes, corrupt media, unsupported runtime operators, or changed requirements. Root-cause evidence should determine the intervention.

## Procedure
1. Define the symptom, affected population, start time, and severity.
2. Compare deployment, model, preprocessing, configuration, and infrastructure changes around onset.
3. Reproduce failures from authorized samples or deterministic replay where possible.
4. Verify raw decoding and preprocessing against the known-good release.
5. Compare reference-runtime and production-runtime outputs.
6. Inspect thresholds, NMS, transforms, label mapping, and downstream logic.
7. Slice failures by device, source, environment, class, image quality, and model version.
8. Distinguish data drift, label/concept change, pipeline defect, runtime defect, and genuine model weakness.
9. Apply the smallest reversible fix when the model is not root cause.
10. If retraining is justified, curate representative new data without contaminating held-out evaluation.
11. Retrain against a reproducible baseline and run full regression plus slice evaluation.
12. Deploy through shadow/canary stages with explicit rollback gates.
13. Record root cause, evidence, corrective action, and prevention measures.

## Decision points
Rollback immediately when a recent reversible release causes severe impact. Retrain for persistent representation gaps supported by new labeled evidence. Change thresholds only when calibration/error-cost analysis supports it rather than to conceal model defects.

## Common failure patterns
Retraining before reproducing the incident, mixing production failures into the test set, changing multiple pipeline stages at once, debugging only aggregate metrics, losing the original artifact, and declaring success without production verification.

## Verification
Verify the incident is reproducible or evidentially explained, the root cause is isolated, offline regression tests pass, critical slices recover, target-runtime parity holds, and canary telemetry confirms the fix.

## Expected output
A root-cause record, minimal corrective action or justified retraining package, regression evidence, deployment gates, and prevention actions.

## Stop conditions
Stop and escalate if evidence requires unauthorized production-data access, root cause cannot be isolated safely, a fix would bypass security/safety controls, or retraining lacks representative ground truth.