# Skill: Data Modeling and Schema Design

## Purpose
Turn domain rules and access patterns into a schema that preserves invariants and remains operable as data grows.

## Trigger
New bounded context, major feature, ownership split, integrity defect, or schema redesign.

## Inputs
Business invariants, entities/events, ownership, lifecycle, access patterns, cardinality, retention, consistency needs, engine constraints.

## Preconditions
Separate required business semantics from implementation assumptions. Identify source of truth and authoritative owner.

## Procedure
1. List invariants, identifiers, state transitions, and deletion/retention rules.
2. Map read/write access patterns and expected cardinalities.
3. Choose normalization boundaries; denormalize only with explicit consistency strategy.
4. Define keys, constraints, nullability, uniqueness, referential behavior, data types, and time semantics.
5. Model hot paths, growth, partition candidates, and operational maintenance.
6. Evaluate transaction boundaries and cross-aggregate consistency.
7. Design migration path from current state, not only target state.
8. Review with application owner and verifier.

## Decisions
Prefer database constraints for invariants that must survive application bugs and concurrency when the engine can enforce them safely. Prefer explicit ownership over shared mutable tables between domains.

## Constraints
Do not infer retention/compliance policy. Avoid engine-specific features unless their operational cost and portability trade-off are accepted.

## Outputs
Schema proposal, invariants, access-pattern matrix, migration implications, risks, open decisions.

## Verification
Test representative writes, concurrent conflicts, invalid states, key cardinality, and primary query paths.

## Failure handling
If business semantics conflict, stop design and escalate the inconsistency rather than encoding both interpretations.

## Stop condition
Target invariants, ownership, migration approach, review, and verification strategy are explicit.