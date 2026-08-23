# Observability and Crash Analysis

## Purpose
Instrument Android applications so crashes, ANRs, degraded journeys, and production failures can be diagnosed with privacy-conscious evidence.

## When to use
Use when adding telemetry, investigating crashes/ANRs, defining release health, or improving incident response.

## Inputs
Crash reports, ANR traces, logs, analytics events, app/device versions, release history, privacy requirements, reproduction reports.

## Preconditions
Define what operational questions telemetry must answer and what data must never be collected.

## Context to inspect
Crash SDK configuration, structured logs, breadcrumbs, custom keys, performance traces, network error metrics, release/version metadata, user-consent rules, and symbol/mapping uploads.

## Core knowledge
Mobile incidents are often device-, version-, state-, and lifecycle-specific. Useful telemetry correlates failures with release, device, journey, and preceding state without collecting unnecessary personal data.

## Procedure
1. Define health indicators for crashes, ANRs, startup, and critical journeys.
2. Ensure every report includes app version/build and relevant environment metadata.
3. Preserve deobfuscation mappings and native symbols for each release.
4. Add structured breadcrumbs around meaningful state transitions, not noisy implementation events.
5. Categorize network, storage, lifecycle, and business failures consistently.
6. Redact credentials, personal data, tokens, and sensitive payloads.
7. Group incidents by actionable root-cause signature.
8. Reproduce top-impact failures using reported state/device conditions.
9. Verify fixes against the original signature and monitor recurrence after rollout.
10. Convert repeated incident classes into tests or preventive checks.

## Decision points
Capture additional context only when diagnostic value outweighs privacy and volume cost. Sample high-volume success telemetry while retaining enough failure evidence for diagnosis.

## Common failure patterns
Missing mapping files, logs without build metadata, sensitive payload logging, crash counts without affected-user impact, noisy breadcrumbs, and declaring a fix before recurrence is monitored.

## Verification
Trigger controlled test failures in non-production environments, verify symbolication and metadata, confirm redaction, and validate release dashboards can distinguish regressions by version.

## Expected output
Actionable telemetry contract, diagnosable reports, incident workflow, and verified privacy controls.

## Stop conditions
Escalate when required diagnostic data would violate policy, symbolication artifacts are unavailable, or production access/incident handling requires authorized personnel.