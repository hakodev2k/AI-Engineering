# Code Review and Senior Decision Rules

## Purpose
Ensure GPU system changes receive evidence-based review proportional to correctness, portability, performance, and production risk.

## Scope
Kernel changes, runtime integration, architecture, dependencies, capacity, and operational configuration.

## MUST
- Reviews MUST identify affected hardware/runtime support, correctness risk, synchronization, memory lifetime, numerical behavior, and operational impact where relevant.
- Significant architecture or portability changes MUST document alternatives and trade-offs.
- Performance claims MUST link to reproducible measurements.
- High-risk changes MUST identify rollback and required human approval.
- Reviewers MUST distinguish verified facts from assumptions requiring follow-up evidence.

## MUST NOT
- MUST NOT approve opaque optimization changes solely because benchmarks improved if correctness evidence is incomplete.
- MUST NOT accept unexplained sanitizer, compiler, runtime, or hardware-health warnings.
- MUST NOT allow project-specific convenience to silently weaken security or production safety boundaries.

## SHOULD
- Prefer small, attributable changes with explicit invariants.
- Escalate decisions when blast radius exceeds the reviewer's authority or expertise.

## Exceptions
Expedited incident changes require retrospective review and unresolved-risk tracking.

## Verification
Inspect pull-request evidence, benchmark artifacts, test results, approvals, decision records, and rollback plans.