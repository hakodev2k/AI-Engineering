# App Store Release and Rollout

## Purpose
Prepare and release iOS versions with controlled risk, correct metadata/privacy declarations, phased rollout, and operational readiness.

## When to use
Use for every production release, major feature launch, emergency fix, or App Store submission issue.

## Inputs
Release scope, build artifact, test evidence, privacy data, rollout plan, monitoring/rollback controls.

## Context to inspect
Version/build numbers, App Store Connect metadata, privacy declarations, export compliance, review notes, feature flags, crash/performance baselines.

## Core knowledge
App Store binaries generally cannot be rolled back instantly; mitigation relies on phased release, server compatibility, feature flags, and rapid replacement builds. Store declarations must match actual SDK/app behavior.

## Procedure
1. Freeze and identify release candidate.
2. Verify automated/manual acceptance evidence.
3. Validate signing, entitlements, symbols, privacy manifest, and required declarations.
4. Confirm backend compatibility with old and new clients.
5. Prepare review notes and metadata.
6. Define phased/manual release strategy and stop thresholds.
7. Submit and resolve review issues with evidence.
8. After release, monitor adoption, crashes, hangs, performance, and business-critical flows.
9. Halt rollout/disable risky flags when thresholds breach.
10. Record release outcome.

## Decision points
Use phased release for risk reduction unless urgency or coordinated launch requires manual full release. Gate risky behavior server-side when feasible.

## Common failure patterns
Missing symbols, incompatible backend changes, inaccurate privacy declarations, no rollout thresholds, and assuming binary rollback exists.

## Verification
Install store/TestFlight-equivalent artifact, verify critical flows, then confirm production telemetry remains within thresholds.

## Expected output
Auditable release checklist, rollout decision, and post-release health evidence.

## Stop conditions
Do not release with unresolved data-loss/security risk, incompatible backend contract, or missing mandatory compliance information.