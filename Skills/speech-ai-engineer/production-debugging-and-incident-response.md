# Production Debugging and Incident Response

## Purpose
Diagnose and contain production failures in speech systems by separating data, model, decoder, infrastructure, device, and integration causes using evidence rather than guesswork.

## When to use
Use when speech quality, latency, availability, speaker attribution, trigger behavior, or synthesis quality regresses unexpectedly in production.

## Inputs
- Incident description and timeline
- Metrics, traces, and logs
- Model/configuration versions
- Representative failing requests or privacy-safe reproductions
- Recent deployment and data changes
- Baseline behavior

## Context to inspect
Inspect rollout state, traffic mix, language/device distribution, audio duration and quality proxies, preprocessing versions, model artifacts, decoding thresholds, queue depth, hardware health, dependency failures, and client release changes.

## Core knowledge
Speech failures often look similar at the user level but arise at different layers. Increased WER may come from acoustic drift, a changed resampler, language routing, decoder settings, model regression, or queue-induced truncation. Incident handling should first reduce impact, then establish causality.

## Procedure
1. Define user impact, scope, severity, and start time.
2. Compare affected versus unaffected traffic by model, region, device, language, and channel.
3. Check recent releases, configuration changes, and dependency incidents.
4. Decompose latency and error signals by pipeline stage.
5. Reproduce failures with representative samples when permitted.
6. Compare preprocessing outputs and model inputs against a known-good path.
7. Compare model emissions before decoder/postprocessing when possible.
8. Validate thresholds, language routing, vocabulary, and endpointing configuration.
9. Mitigate through rollback, traffic shifting, feature disablement, or capacity controls when evidence supports it.
10. Confirm recovery with production and replay metrics.
11. Perform root-cause analysis and create regression tests/runbook updates.
12. Track corrective actions to closure.

## Decision points
Rollback early when impact is high and a recent change is strongly correlated. Avoid changing multiple model and decoder parameters during an incident unless required for containment. Preserve evidence before destructive cleanup.

## Common failure patterns
- Blaming the model before checking audio/preprocessing changes
- Using only aggregate metrics
- Making several simultaneous fixes and losing causal evidence
- Retrying overloaded inference until queues collapse
- Keeping sensitive incident audio outside approved controls

## Verification
The incident is resolved only when user-impact metrics recover, the suspected cause can be reproduced or otherwise evidenced, mitigation is validated, and a regression or detection mechanism prevents silent recurrence.

## Expected output
An incident record containing impact, timeline, evidence, root cause, mitigation, verification, corrective actions, and newly added regression coverage.

## Stop conditions
Escalate when production access or privacy permissions are insufficient, evidence points to a security incident, destructive remediation is required, or safe mitigation cannot be identified.