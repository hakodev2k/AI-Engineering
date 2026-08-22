# Documentation Testing

## Purpose
Prove that documentation works, not merely that text exists.
## When to use
Use before publication and continuously for executable, linked, versioned, or high-risk docs.
## Inputs
Doc source, code samples, links, commands, supported environments, expected outcomes.
## Context to inspect
CI, preview build, product versions, test fixtures, redirects, snippets.
## Core knowledge
Verification spans structural checks, factual checks, executable examples, user-task validation, and production link/redirect health.
## Procedure
1. Build docs in a clean environment.
2. Run spelling/style/markup checks with justified exceptions.
3. Validate internal/external links and anchors.
4. Compile or execute code samples and commands.
5. Check generated reference against source contracts.
6. Test critical procedures end to end.
7. Validate version selectors and redirects.
8. Perform representative user task tests for high-value journeys.
9. Record failures as actionable ownership items.
## Decision points
Automate deterministic checks; reserve human review for semantics, usability, and judgment.
## Common failure patterns
Green build treated as factual proof, flaky external-link gates, untested snippets, and tests using privileged author environments.
## Verification
CI and manual evidence cover the risks appropriate to the content type.
## Expected output
Verified documentation with reproducible quality evidence.
## Stop conditions
Block publication for unsafe, non-reproducible, or materially inaccurate critical procedures.