# Distributed Transaction Rules

## Purpose
Protect invariants that span services or storage boundaries.

## Scope
Sagas, outbox patterns, two-phase commit, and multi-resource workflows.

## MUST
- Cross-boundary invariants MUST define commit, compensation, and failure semantics.
- Long-running workflows MUST persist durable progress and support safe resume.
- Compensation actions MUST be idempotent where retries are possible.

## MUST NOT
- MUST NOT hide partial success behind a single success/failure flag.
- MUST NOT introduce distributed locking or two-phase commit without evaluating availability and failure impact.

## SHOULD
- Prefer local atomicity plus explicit coordination over opaque distributed transactions when practical.

## Exceptions
Stronger coordination requires documented trade-offs and operational evidence.

## Verification
Exercise partial failure, compensation failure, duplicate execution, and recovery tests.