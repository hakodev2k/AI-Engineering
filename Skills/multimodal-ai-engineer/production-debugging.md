# Production Debugging

## Purpose
Diagnose multimodal AI failures by isolating whether the defect originates in source media, preprocessing, alignment, retrieval, model inference, fusion, postprocessing, or downstream business logic.

## When to use
Use for production incidents, unexplained quality regressions, modality-specific failures, latency spikes, inconsistent offline/online behavior, or model/provider migrations.

## Inputs
Incident description, traces, safe request metadata, model/processor versions, representative failing samples when permitted, metrics, recent changes, evaluation results.

## Preconditions
Preserve evidence and respect privacy/access controls before replaying user media. Identify whether the incident is ongoing and whether immediate mitigation is required.

## Context to inspect
Inspect deployment history, model and processor hashes, prompt versions, media metadata, preprocessing outputs, retrieval candidates, confidence/grounding, timeouts, retries, caches, feature flags, and downstream transformations.

## Core knowledge
Multimodal incidents often look like model failures but originate in media decoding, orientation, timestamps, chunking, cross-modal linkage, context truncation, or stale processor versions. Reproduction must pin the complete inference contract, not only the model name.

## Procedure
1. Classify impact, affected modalities, and time window.
2. Stabilize service with rollback, feature disablement, or degraded mode if necessary.
3. Compare healthy and failing request metadata.
4. Pin model, processor, prompt, retrieval, and configuration versions.
5. Reproduce with a privacy-approved failing fixture.
6. Inspect raw-to-preprocessed transformations stage by stage.
7. Validate cross-modal IDs, ordering, timestamps, and context budgets.
8. Compare retrieval and grounding evidence.
9. Replay inference deterministically where supported.
10. Separate provider/model variance from application defects.
11. Test the smallest hypothesis that explains the failure.
12. Implement mitigation, then add a regression fixture and monitoring signal.

## Decision points
Rollback first when impact is high and a recent change correlates strongly. Continue investigation in place only when the service is safe and rollback would cause greater harm. Escalate to a model/provider when evidence reproduces outside application preprocessing and configuration.

## Common failure patterns
Blaming the model before inspecting inputs; replaying with a different processor; losing original ordering/timestamps; changing multiple variables at once; repeatedly retrying nondeterministic failures; logging sensitive media outside approved controls.

## Verification
Reproduce the original failure, demonstrate that the fix removes it, run adjacent regression slices, and verify production telemetry returns to baseline after rollout.

## Expected output
A root-cause statement supported by evidence, mitigation or fix, regression coverage, monitoring improvement, and documented residual risk.

## Stop conditions
Stop and escalate when evidence requires unauthorized production access, the issue involves a safety/security breach, the failure cannot be reproduced after bounded attempts, or remediation requires destructive changes without approval.