# Kernel Architecture Rules

## Purpose
Protect kernel subsystem boundaries, invariants, and long-term maintainability.

## Scope
Kernel architecture, subsystem ownership, interfaces, execution contexts, and cross-cutting changes.

## MUST
- Changes MUST identify the affected subsystem, ownership boundary, execution context, and invariants before implementation.
- New cross-subsystem dependencies MUST have an explicit rationale and documented direction of dependency.
- Public or semi-public kernel interfaces MUST define lifetime, concurrency, error, and ownership semantics.
- Architecture changes MUST preserve boot, recovery, diagnostics, and failure-containment paths unless an approved design changes them.
- Significant structural changes MUST include compatibility, rollback, and operational-risk analysis.

## MUST NOT
- MUST NOT bypass subsystem interfaces merely to reduce implementation effort.
- MUST NOT introduce hidden global coupling or undocumented initialization-order dependencies.
- MUST NOT treat implementation convenience as sufficient evidence for an architecture change.

## SHOULD
- Stable, narrow interfaces SHOULD isolate policy from mechanism.
- Cross-cutting facilities SHOULD minimize assumptions about callers and execution context.
- Architecture decisions SHOULD favor diagnosability and reversibility when trade-offs are otherwise comparable.

## Exceptions
Exceptions require the constraint being violated, alternatives considered, evidence, blast radius, recovery plan, and approval from the relevant maintainers.

## Verification
Review dependency diffs, interface contracts, boot paths, architecture tests where available, subsystem tests, and maintainer review. Validate assumptions under representative failure and concurrency conditions.