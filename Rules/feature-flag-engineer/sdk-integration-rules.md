# SDK Integration Rules

## Purpose
Integrate flag evaluation without destabilizing application startup, request paths, or resource usage.

## Scope
Server, browser, mobile, edge, and worker SDK integrations.

## MUST
- SDK initialization MUST define timeout, bootstrap, retry, cache, and shutdown behavior.
- Request-path evaluation MUST respect latency budgets.
- SDK credentials MUST use least privilege and appropriate secret handling.
- SDK upgrades MUST be tested for evaluation, caching, threading, and compatibility changes.

## MUST NOT
- Applications MUST NOT block indefinitely waiting for flag initialization.
- Server-side secret keys MUST NOT be shipped to untrusted clients.
- SDK exceptions MUST NOT crash critical paths without an explicit design decision.

## SHOULD
- SDK usage SHOULD be wrapped behind a project-owned interface when portability, testing, or policy enforcement benefits.

## Exceptions
Direct vendor coupling requires documented trade-offs where material.

## Verification
Inspect initialization code, dependency configuration, secret scans, load tests, failure tests, and upgrade diffs.