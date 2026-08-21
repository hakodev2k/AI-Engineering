# Lifecycle Hooks
Hooks are deterministic policy checks, not hidden autonomous actions.

## intake
Validate work-item required fields; reject missing objective, acceptance criteria, risk, owner, or affected layers.

## pre-implementation
Require source-of-truth links/identifiers, dependency list, contract-change classification and approval flags for destructive/security-sensitive work.

## pre-review
Require tests for changed behavior, no committed secrets, migration notes when persistence changes, and telemetry for material new failure modes.

## pre-release
Require release evidence, known recovery path, resolved blocker findings, and human approval for high-risk/irreversible actions.

## post-release
Record expected signals, actual signals, incidents/regressions and follow-up owner. If failure occurs, start Failure -> Root Cause -> Lesson -> Process Improvement -> Future Prevention.

Hooks SHOULD be idempotent, should fail closed on malformed required metadata, and MUST NOT perform production mutation or secret rotation automatically.