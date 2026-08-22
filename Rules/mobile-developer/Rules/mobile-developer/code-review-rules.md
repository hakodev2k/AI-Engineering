# Code Review Rules
## Purpose
Use review to prevent mobile defects with architectural, platform, security, lifecycle, and operational impact.
## Scope
Pull requests, design-impacting code changes, generated code, and configuration changes.
## MUST
- Reviews MUST examine correctness across lifecycle transitions, offline behavior, supported platforms, security/privacy, and backward compatibility when relevant.
- High-risk changes MUST include evidence such as tests, traces, screenshots, benchmarks, or migration validation appropriate to the claim.
- Reviewers MUST distinguish blocking safety/correctness issues from optional preferences.
## MUST NOT
- Review approval MUST NOT rely solely on code appearance when runtime/platform behavior is material.
- Large generated or dependency changes MUST NOT bypass ownership and risk review.
## SHOULD
- Changes SHOULD be small enough that reviewers can reason about side effects and rollback.
## Exceptions
Emergency fixes may use expedited review with named approver and mandatory follow-up review.
## Verification
Inspect PR evidence, reviewer coverage, unresolved comments, risk labels, and post-merge quality signals.