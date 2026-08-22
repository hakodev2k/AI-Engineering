# App Store Release Management

## Purpose
Manage mobile store submissions, staged releases, metadata, policy compliance, and production risk.

## When to use
Major/minor releases, policy changes, phased rollout, emergency fixes.

## Inputs
Release artifact, change set, store requirements, rollout metrics, support plan.

## Context to inspect
Permissions/privacy declarations, SDK disclosures, screenshots/metadata, compatibility, crash/performance baseline.

## Core knowledge
Store approval and binary deployment are separate from feature exposure. Server flags and staged rollout can reduce risk but need safe defaults.

## Procedure
1. Confirm release scope and artifact provenance.
2. Review store/privacy/permission declarations.
3. Verify upgrade path and backward compatibility.
4. Prepare accurate metadata and release notes.
5. Submit with required review information.
6. Start staged/phased rollout where supported.
7. Monitor crashes, performance, auth, and critical journeys.
8. Pause rollout or disable risky features when thresholds breach.
9. Complete rollout only after evidence is stable.

## Decision points
Choose rollout speed from blast radius, reversibility, and confidence rather than calendar pressure.

## Common failure patterns
Full rollout immediately, mismatched privacy declarations, no upgrade testing, relying on store rollback as instant recovery.

## Verification
Store artifact/version matches approved build and production metrics remain within thresholds.

## Expected output
Controlled release with audit trail and rollback response.

## Stop conditions
Stop for policy mismatch, critical regression, or unverifiable artifact.