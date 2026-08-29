# Dependency Governance Rules

## Purpose
Control introduction, update, and removal of third-party dependencies.

## Scope
Applies to direct and transitive packages, libraries, plugins, modules, build tools, and runtime components.

## MUST
- New direct dependencies MUST have documented purpose, ownership, maintenance status, license review where required, and security review proportional to risk.
- Dependency updates MUST preserve compatibility evidence and MUST be tested before release.
- Critical dependencies MUST have an identified update path and responsible owner.
- Unused dependencies MUST be removed when safely practical.

## MUST NOT
- MUST NOT add a dependency solely to avoid implementing trivial functionality without considering maintenance and attack-surface cost.
- MUST NOT pin to unreviewed forks or abandoned packages without explicit risk acceptance.

## SHOULD
- Dependency count and transitive expansion SHOULD be minimized.
- High-risk dependencies SHOULD have alternatives evaluated periodically.

## Exceptions
Exceptions MUST record rationale, alternatives considered, risk, duration, and approval.

## Verification
Review manifests, dependency graphs, ownership records, update evidence, and repository history. Confirm new dependencies have review artifacts and critical components have accountable owners.