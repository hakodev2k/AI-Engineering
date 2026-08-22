# Release Notes and Changelogs

## Purpose
Communicate product changes in terms users can assess, adopt, and act on.
## When to use
Use for releases, breaking changes, deprecations, security-relevant changes, and meaningful fixes.
## Inputs
Merged changes, issue/PR context, release scope, migration requirements, known limitations.
## Context to inspect
Product behavior, versioning, compatibility, support impact, affected audiences, rollout status.
## Core knowledge
Changelogs record change; release notes explain user impact. Prioritize behavior and required action over internal implementation.
## Procedure
1. Reconcile shipped changes with release artifacts.
2. Classify new, changed, fixed, deprecated, removed, and security-relevant behavior.
3. Identify affected users and compatibility impact.
4. State required migration/action and deadlines.
5. Link detailed guides/reference instead of duplicating them.
6. Distinguish availability/rollout limitations.
7. Verify version numbers, dates, flags, and links.
8. Publish through a stable chronological/versioned channel.
## Decision points
Highlight breaking/security changes separately; omit internal refactors unless users experience an effect.
## Common failure patterns
Commit-log dumps, vague “improvements,” missing migration steps, announcing unshipped features, and hidden breaking changes.
## Verification
Compare notes with actual release contents and test migration links/instructions.
## Expected output
Accurate, actionable release communication.
## Stop conditions
Stop when release state or compatibility impact cannot be verified.