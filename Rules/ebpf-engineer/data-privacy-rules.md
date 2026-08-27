# Data Privacy

## Purpose
Limit collection and exposure of sensitive data visible through kernel instrumentation.

## Scope
Process arguments, paths, network metadata, payloads, identities, map contents, events, logs, and exports.

## MUST
- Collected fields MUST be necessary for a defined purpose.
- Sensitive data MUST be classified before collection and protected in transport, storage, and access.
- Retention and export behavior MUST be explicit for captured kernel/process data.
- Filtering/redaction intended to protect data MUST occur as early as practical.
- Debug modes that increase sensitive collection MUST be access-controlled and time-bounded.

## MUST NOT
- MUST NOT capture payload contents, credentials, tokens, or secrets by default.
- MUST NOT log raw sensitive map/event data merely for troubleshooting convenience.
- MUST NOT expand collection scope without review of privacy and security impact.

## SHOULD
- Prefer metadata, aggregation, hashing, or minimization over raw content.
- Separate operational telemetry from forensic capture capabilities.

## Exceptions
Expanded collection requires purpose, scope, retention, access controls, approval, and deletion plan.

## Verification
Review schemas and probes, inspect sample events/logs, test redaction, audit access controls, and verify retention/deletion behavior.