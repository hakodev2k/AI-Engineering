# Breaking-Change Communication

## Purpose
Communicate API, SDK, platform, pricing/limit, or behavioral changes so developers can assess impact and migrate safely.

## When to use
Use for deprecations, version removals, default changes, auth changes, renamed APIs, behavioral incompatibilities, or material operational changes.

## Inputs
Change specification, affected versions, migration path, timeline, telemetry, support policy, known edge cases.

## Context to inspect
Affected segments, usage patterns, dependency chains, release notes, compatibility guarantees, rollback options, and support capacity.

## Core knowledge
Breaking-change communication is an engineering risk-control mechanism. Developers need impact, detection, migration, verification, deadline, and recovery—not promotional framing.

## Procedure
1. Precisely define old and new behavior.
2. Identify affected developers and detection methods.
3. Validate migration steps on representative applications.
4. State dates/time zones and lifecycle stages unambiguously.
5. Explain why the change exists without minimizing impact.
6. Provide code/config diffs and compatibility notes.
7. Define verification and rollback/fallback where supported.
8. Publish through channels proportional to impact.
9. Track migration progress and recurring failures.
10. Update guidance as edge cases emerge.
11. Confirm removal only after required governance criteria are met.

## Decision points
Use staged deprecation for broad/high-risk impact; automated migration tooling when transformations are deterministic; direct outreach for critical known consumers when policy permits.

## Common failure patterns
Buried notices, vague dates, no detection query, untested migration, silent default changes, optimistic effort estimates, and removing legacy behavior before adoption evidence supports it.

## Verification
Test migration instructions, validate affected-user targeting, confirm dates across artifacts, and monitor error/adoption telemetry before and after the change.

## Expected output
A complete change notice and migration path with impact, timeline, examples, verification, support, and status tracking.

## Stop conditions
Escalate when affected users cannot be identified, migration is not viable, timelines violate commitments, or security/reliability risks require a different rollout.