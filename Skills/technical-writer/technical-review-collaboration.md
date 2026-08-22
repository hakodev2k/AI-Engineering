# Technical Review Collaboration

## Purpose
Obtain accurate expert review without outsourcing documentation quality or creating endless review loops.
## When to use
Use for technically consequential content, new features, architecture, security, APIs, and operations.
## Inputs
Draft, claims requiring validation, source evidence, reviewers, deadline.
## Context to inspect
Code/contracts, tests, design decisions, ownership, prior review comments.
## Core knowledge
Ask reviewers to validate specific claims and risks. Writers remain responsible for audience, structure, clarity, and incorporating verified feedback.
## Procedure
1. Self-verify facts against available sources first.
2. Identify claims needing specialist validation.
3. Select reviewers by ownership/expertise.
4. Provide context, audience, and explicit review questions.
5. Separate factual blockers from preferences.
6. Resolve conflicting feedback against source truth and decision authority.
7. Record material decisions.
8. Re-run examples/tests after changes.
9. Close the review with acknowledged unresolved risks only when acceptable.
## Decision points
Require security/operations review for high-risk procedures; avoid broad mandatory review for low-risk copy edits.
## Common failure patterns
“Please review” with no focus, accepting contradictory edits blindly, style bikeshedding, and stale approvals after substantive changes.
## Verification
Critical claims have authoritative evidence/reviewer approval and post-review examples still work.
## Expected output
Accurate reviewed content with clear ownership.
## Stop conditions
Do not publish disputed critical behavior without an authoritative resolution.