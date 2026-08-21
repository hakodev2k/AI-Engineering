# Contracts, Versioning, and Deprecation

A contract includes schema, semantics, errors, authentication behavior, idempotency expectations, limits, ordering, pagination, consistency, lifecycle, and operational promises.

## Compatibility rules
Classify changes as additive-compatible, behaviorally risky, or breaking. A syntactically additive field can still break strict clients or change semantics. Review both machine contract and consumer behavior.

## Versioning
Prefer compatible evolution inside a version. Create a new version only when the consumer promise cannot be preserved safely. Versioning must include ownership, support horizon, migration path, and retirement criteria.

## Deprecation
A deprecation plan needs affected consumers, evidence, target replacement, migration guide, notice channel, support path, dates, exception route, progress tracking, and retirement approval. Do not retire solely because notice time elapsed if critical consumers remain without an agreed disposition.

## Breaking change decision
Require evidence of necessity, alternatives considered, blast radius, migration cost, timeline, rollback/mitigation, and accountable human approval.