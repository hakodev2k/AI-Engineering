# Code Review and Maintainability

## Purpose
Review Terraform changes for correctness, lifecycle safety, readability, reuse, and long-term operability beyond syntax.

## When to use
Pull-request review, technical-debt reduction, module evolution, and standards enforcement.

## Inputs
Configuration diff, plan, requirements, tests, module contracts, policy results.

## Context to inspect
Repository conventions, ownership, state boundaries, provider versions, call sites, previous migrations, operational runbooks.

## Core knowledge
Terraform review must consider code and generated infrastructure actions. Maintainability favors explicit intent, stable identity, small interfaces, predictable composition, and documented exceptions.

## Procedure
1. Confirm requirement and affected ownership boundary.
2. Review resource identity and for_each/count keys.
3. Inspect module/interface changes for compatibility.
4. Review provider/version and dependency changes.
5. Inspect plan for replacements, deletes, IAM/network exposure, and drift.
6. Check tests, validations, policies, and documentation.
7. Challenge unnecessary abstractions and hidden coupling.
8. Require evidence for lifecycle-sensitive claims.
9. Record actionable review comments by severity.

## Decision points
Prefer local duplication over premature abstraction when patterns are not stable; require modules when a governed pattern must remain consistent across consumers.

## Common failure patterns
Reviewing HCL without plan, style-only feedback, unstable keys, hidden remote-state coupling, unexplained ignore_changes, and accepting untested module breaks.

## Verification
All high-risk comments are resolved, CI passes, reviewed plan matches intent, and no placeholder or secret material is introduced.

## Expected output
A maintainable change with explicit review evidence and understood operational impact.

## Stop conditions
Stop approval on unexplained destructive actions, missing plan evidence, security violations, or unresolved ownership/compatibility risk.