# Message Schema Safety Rules

## MUST
- Identify the producer serialization boundary and every discoverable consumer before declaring compatibility.
- Preserve evidence for contract changes, consumer behavior, replay exposure, rollout order, and verification.
- Treat historical retained messages, DLQ records, outbox/inbox rows, and event-store entries as active compatibility inputs when they may be replayed.
- Use an additive expand-migrate-contract sequence for rename, removal, narrowing type, or semantic replacement.
- Test required cross-version producer/consumer combinations before completion.
- Keep deterministic compatibility output separate from behavioral verification.
- Retry transient tooling failures at most 2 times and preserve failure evidence.
- Obtain explicit human approval before production replay, topic/subscription changes, schema-registry mode changes, consumer cutover, DLQ reprocessing, destructive data changes, or breaking contracts.

## MUST NOT
- Do not remove or rename a serialized field in place while any retained message or consumer still depends on it.
- Do not make an optional field required without proving all producers and historical messages provide it.
- Do not assume an added enum value is safe unless every relevant consumer tolerates unknown values.
- Do not change message-key or partitioning semantics as a schema-only refactor.
- Do not silently increase broker, registry, database, cloud, or repository permissions.
- Do not use production replay as the first verification step.
- Do not claim compatibility because compilation succeeds.
- Do not weaken validation, authentication, encryption, retention controls, or consumer error handling to make rollout pass.

## SHOULD
- Prefer explicit schema artifacts and contract fixtures over undocumented DTO conventions.
- Prefer tolerant readers and optional/defaulted additive fields.
- Version a message or topic when compatibility cannot be achieved safely in place.
- Use representative historical fixtures and realistic serialization options.
- Observe deserialization failures, DLQ growth, lag, and processing errors during rollout.
