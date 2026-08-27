# Filesystem and VFS Rules

## Purpose
Protect namespace, persistence, metadata, locking, and crash-consistency semantics.

## Scope
VFS integration, filesystem operations, caching, metadata, writeback, mounts, and recovery.

## MUST
- Filesystem changes MUST preserve documented persistence and ordering guarantees.
- On-disk or externally persistent format changes MUST have compatibility and recovery analysis.
- Namespace operations MUST define locking and lifetime behavior for concurrent lookup, rename, unlink, and teardown.
- Untrusted filesystem metadata MUST be bounds-checked and validated before use.
- Writeback and error paths MUST surface failures according to the interface contract.

## MUST NOT
- MUST NOT expose stale or freed objects through cache/lifetime races.
- MUST NOT assume persistent media completed writes without the required ordering or flush semantics.
- MUST NOT make irreversible format changes without explicit approval and migration strategy.
- MUST NOT silently convert storage errors into successful persistence claims.

## SHOULD
- Recovery SHOULD tolerate interrupted operations within documented guarantees.
- Metadata parsing SHOULD fail safely on malformed state.
- Expensive namespace operations SHOULD be measured under contention.

## Exceptions
Exceptions require format/version analysis, recovery plan, corruption-risk assessment, and maintainer approval.

## Verification
Use crash/restart testing, malformed-image testing, concurrency stress, fs consistency tools, fault injection, compatibility tests, and persistence-order validation.