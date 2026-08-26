# Launch Developer Readiness

## Purpose
Ensure developers can discover, understand, adopt, debug, and safely operate a new capability at launch.

## When to use
Use before public previews, GA launches, major API/SDK changes, migrations, or deprecations.

## Inputs
Release scope, API/SDK artifacts, docs, samples, pricing/limits, support plan, known issues, rollout timeline.

## Context to inspect
Target audience, onboarding, auth, compatibility, migration, quotas, errors, observability, security guidance, changelog, status/support routes.

## Core knowledge
A launch is developer-ready only when the complete adoption path works. Announcement quality cannot compensate for broken onboarding or unclear operational constraints.

## Procedure
1. Identify launch personas and top tasks.
2. Test public onboarding from a clean environment.
3. Validate docs, SDK/package availability, examples, and version alignment.
4. Exercise errors, limits, retries, and recovery.
5. Verify pricing, quotas, regions, lifecycle, and compatibility claims.
6. Prepare migration/deprecation guidance when relevant.
7. Establish support escalation and known-issue handling.
8. Prepare technically accurate launch content and demos.
9. Run a readiness review with engineering, docs, support, security, and product.
10. Recheck externally visible artifacts at release time.
11. Monitor launch feedback and rapidly route defects.

## Decision points
Delay or narrow claims when critical paths are not verified. Use preview labeling when behavior/support commitments remain intentionally unstable.

## Common failure patterns
Docs before packages are available, mismatched versions, hidden limits, no error guidance, unsupported claims, missing migration path, and no post-launch monitoring.

## Verification
Perform end-to-end external-path tests and confirm every published claim against released behavior. Verify support owners and escalation channels are active.

## Expected output
A launch readiness decision with verified artifacts, known limitations, owners, and post-launch monitoring plan.

## Stop conditions
Block advocacy when core setup fails, security/legal approvals are missing, artifacts disagree materially, or launch claims exceed verified capability.