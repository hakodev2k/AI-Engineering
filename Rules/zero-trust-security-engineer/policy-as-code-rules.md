# Policy as Code Rules

## Purpose
Make security policy changes reviewable, testable, reproducible, and traceable across enforcement systems.

## Scope
Applies to authorization policy, network policy, conditional access, infrastructure access controls, and policy configuration represented as code.

## MUST
- Policy changes MUST be version-controlled when the platform permits declarative management.
- High-impact policy changes MUST include peer review and automated or repeatable validation.
- Policy repositories MUST protect production branches and restrict who can approve sensitive changes.
- Policy deployment MUST preserve traceability from source change to active enforcement state.

## MUST NOT
- MUST NOT make untracked production policy edits when managed deployment paths exist.
- MUST NOT merge policy changes that fail syntax, schema, or authorization tests.
- MUST NOT encode secrets directly in policy source.

## SHOULD
- Policies SHOULD include representative allow and deny tests.
- Reusable policy modules SHOULD expose explicit inputs and avoid hidden environment assumptions.

## Exceptions
Emergency console changes require human approval, recorded reason, post-change reconciliation into source control, and retrospective review.

## Verification
Use CI policy tests, diff review, branch controls, deployment records, drift detection, and comparison of intended policy against active enforcement state.