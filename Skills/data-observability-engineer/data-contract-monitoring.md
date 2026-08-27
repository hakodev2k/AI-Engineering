# Data Contract Monitoring

## Purpose
Operationalize data contracts by continuously validating producer obligations such as schema, semantics, freshness, ownership, and compatibility.

## When to use
Use for shared data products, event contracts, cross-team interfaces, and datasets whose downstream stability depends on explicit producer guarantees.

## Inputs
Contract definitions, schemas, SLOs, ownership metadata, compatibility policy, consumer dependencies.

## Preconditions
Contracts must be versioned and mapped to concrete datasets or topics.

## Context to inspect
Review producer implementation, schema registry, orchestration, lineage, historical changes, and consumer expectations.

## Core knowledge
Contracts are useful only when enforceable and observable. A Senior engineer distinguishes hard invariants from advisory expectations and aligns enforcement with compatibility and rollout strategy.

## Procedure
1. Parse contract requirements into machine-checkable controls.
2. Map each requirement to a measurement point.
3. Validate schema and compatibility at change time.
4. Monitor runtime freshness, completeness, and semantic rules.
5. Track producer and consumer ownership.
6. Define severity by downstream impact.
7. Block or quarantine only when risk justifies it.
8. Record violations with contract version and evidence.
9. Test contract evolution across representative consumers.
10. Review obsolete requirements during planned changes.

## Decision points
Use preventive gates for deterministic breaking changes; use runtime monitoring for behavioral obligations. Avoid hard blocking when source variability cannot satisfy deterministic enforcement.

## Common failure patterns
- Contracts stored but not validated
- Ambiguous ownership
- No versioning
- Treating all violations as equal severity
- Breaking consumers through unilateral contract evolution

## Verification
Introduce compatible and incompatible changes plus runtime violations and confirm expected enforcement, alerting, and recovery.

## Expected output
Executable contract checks, ownership routing, violation evidence, and compatibility policy.

## Stop conditions
Escalate when contract semantics conflict across consumers or enforcement would cause uncontrolled production disruption.