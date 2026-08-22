# Versioned Documentation

## Purpose
Keep guidance aligned with supported product versions while minimizing duplicate maintenance and user confusion.
## When to use
Use when multiple materially different versions remain supported.
## Inputs
Support policy, release branches, compatibility matrix, doc platform, deprecation timeline.
## Context to inspect
Version selectors, URLs, redirects, shared content, release cadence, search indexing.
## Core knowledge
Version docs only when behavior differs enough to justify maintenance. Users must always know which version they are reading.
## Procedure
1. Identify supported versions and material doc differences.
2. Define canonical latest and archived/versioned locations.
3. Choose branching/content-reuse strategy.
4. Display version context prominently.
5. Prevent search from surfacing obsolete versions as current.
6. Backport only changes applicable to supported versions.
7. Define end-of-support archival and redirect behavior.
8. Test cross-version links, samples, and selectors.
## Decision points
Prefer one doc set with compatibility annotations for small differences; separate versions for broad incompatible behavior.
## Common failure patterns
Copy-paste forks, stale old versions ranking in search, links jumping versions, and undocumented support boundaries.
## Verification
Representative tasks remain accurate in each supported version and navigation preserves version context.
## Expected output
Predictable, maintainable versioned documentation lifecycle.
## Stop conditions
Escalate when product support policy is undefined or version behavior cannot be determined.