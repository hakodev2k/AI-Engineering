# Testing Rules

## Purpose
Prove RPC correctness across contracts, transports, versions, failures, and production-relevant boundaries.

## Scope
Unit, integration, compatibility, interoperability, failure, and end-to-end tests.

## MUST
- Critical RPCs MUST have tests for success, validation, authorization, cancellation, deadline, and representative failure paths.
- Wire compatibility MUST be tested when evolving published contracts.
- Streaming RPCs MUST test lifecycle and slow/cancelled peers.
- Tests MUST be deterministic and isolate external dependencies where appropriate.
- Production bug fixes MUST add regression protection when practical.

## MUST NOT
- MUST NOT rely exclusively on mocked generated clients for transport behavior.
- MUST NOT hide flaky tests behind unconditional retries.
- MUST NOT declare compatibility from unit tests alone when multiple language/runtime consumers exist.

## SHOULD
- Include cross-language interoperability tests for polyglot public APIs.
- Failure injection SHOULD cover unavailable dependencies and partial responses.

## Exceptions
Missing automation for a critical behavior requires documented manual evidence, owner, and remediation plan.

## Verification
Review CI results, test matrix, flake history, compatibility fixtures, and regression coverage against risk.