# Speech Observability and Drift Monitoring

## Purpose
Detect quality regressions, traffic shifts, latency failures, and acoustic/domain drift in production speech systems before they become sustained user harm.

## When to use
Use for production monitoring of ASR, TTS, diarization, KWS, verification, or streaming speech services.

## Inputs
- Production metrics and logs
- Model/version metadata
- Privacy-safe audio-derived features
- Offline evaluation baselines
- SLOs and alert thresholds

## Context to inspect
Inspect request volume, audio duration, language/locale, SNR proxies, device/channel mix, confidence distributions, decoder behavior, latency stages, error codes, and model version rollout state.

## Core knowledge
Direct ground-truth labels are often delayed or unavailable in production, so monitoring combines service metrics, proxy quality signals, sampled human review where permitted, and delayed labeled evaluation. Audio itself may be sensitive; observability must minimize retention and access.

## Procedure
1. Define service SLOs and model-quality guardrails.
2. Instrument capture/upload, preprocessing, inference, decoding, and response latency separately.
3. Track traffic distribution by safe metadata dimensions.
4. Monitor confidence, no-speech rates, utterance length, language routing, and other task-relevant proxies.
5. Compare distributions to training/evaluation baselines.
6. Segment metrics by model version during rollout.
7. Establish privacy-approved sampling for qualitative diagnosis if allowed.
8. Connect delayed ground truth or user corrections to evaluation pipelines.
9. Define alerts for sustained changes rather than noisy single points.
10. Maintain dashboards and runbooks linking symptoms to likely causes.

## Decision points
Use proxy metrics only as indicators, not proof of quality. Alert on user-impacting outcomes and saturation before low-level infrastructure noise when possible. Preserve raw audio only when policy explicitly permits it.

## Common failure patterns
- Monitoring uptime but not model behavior
- Logging sensitive audio or transcripts unnecessarily
- Ignoring traffic-distribution changes
- Comparing metrics across versions without segmentation
- Alerting on unstable confidence thresholds

## Verification
Verify instrumentation completeness, alert tests, version attribution, privacy controls, and ability to correlate a known injected degradation with monitoring signals.

## Expected output
A production observability design with dashboards, alerts, drift indicators, privacy controls, and incident runbooks.

## Stop conditions
Stop if monitoring requires prohibited sensitive-data collection or proxy signals cannot be interpreted reliably enough for operational action.