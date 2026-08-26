# Trust Store Rules

## Purpose
Control which authorities systems trust and how that trust changes.

## Scope
Operating-system, application, container, device, browser, and service trust stores.

## MUST
- Trust anchors MUST have documented owner, purpose, provenance, and removal criteria.
- Trust-store changes MUST be tested for both intended trust and unintended trust expansion.
- Production trust-anchor additions/removals MUST require human approval and rollback planning.
- Deprecated anchors MUST be removed according to a dependency-verified migration plan.

## MUST NOT
- MUST NOT install arbitrary private roots globally to solve a local integration problem.
- MUST NOT disable certificate validation instead of correcting trust configuration.
- MUST NOT assume identical trust stores across environments or runtimes.

## SHOULD
- Trust stores SHOULD be managed declaratively and drift-monitored.

## Exceptions
Require explicit scope, expiry, risk, and approval.

## Verification
Compare effective trust stores to approved baselines, test certificate paths, inspect configuration drift, and review changes.