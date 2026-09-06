# Source Log Integrity Rules

## Purpose
Protect the authoritative change stream from loss, duplication, corruption, and unsafe source-side configuration.

## Scope
Database logs, WAL/binlog/redo retention, replication slots, log positions, and source connectors.

## MUST
- Capture MUST begin from an explicit, durable source position.
- Source log retention MUST exceed the maximum supported outage and recovery window.
- Connector progress MUST be persisted independently of transient process memory.
- Source-side CDC prerequisites MUST be validated before production enablement.
- Position advancement MUST occur only after downstream durability guarantees are satisfied.

## MUST NOT
- MUST NOT purge required source logs before consumers have safely advanced.
- MUST NOT reset positions to bypass lag without an approved recovery plan.
- MUST NOT treat connector liveness as proof of complete capture.

## SHOULD
- Monitor remaining log-retention headroom and slot growth.
- Document engine-specific log semantics and failure modes.

## Exceptions
Any reduced retention requires measured recovery-time evidence, owner, expiry, and approval.

## Verification
Inspect source configuration, retained positions, connector checkpoints, lag metrics, and recovery tests.