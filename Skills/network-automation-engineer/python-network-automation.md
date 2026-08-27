# Python Network Automation

## Purpose
Build maintainable Python automation for network APIs, device interactions, validation, and orchestration.

## When to use
Use for custom integrations, workflows, data transformation, testing, and operational tooling not adequately covered by declarative systems.

## Inputs
Workflow requirements, APIs/protocols, data models, credentials mechanism, target inventory, and failure semantics.

## Context to inspect
Existing libraries, package management, coding standards, logging, retry policy, tests, and deployment runtime.

## Core knowledge
Senior automation code is typed where useful, modular, idempotent, testable, observable, and explicit about timeouts/retries. Network libraries do not remove device-state hazards.

## Procedure
1. Define input/output contracts and side effects.
2. Reuse stable protocol/vendor libraries before writing transports.
3. Separate inventory, transport, parsing, business logic, and rendering.
4. Add bounded timeouts and classified exceptions.
5. Make changes idempotent where possible.
6. Use structured logging without secrets.
7. Add unit tests for pure logic and integration tests for adapters.
8. Validate on lab/canary targets.
9. Package with pinned/controlled dependencies.
10. Document rollback and operational use.

## Decision points
Use synchronous code for small bounded workflows; concurrency for scale only with device/API rate controls. Prefer libraries/APIs over screen-scraping CLI.

## Common failure patterns
Global mutable state, unbounded threads, blanket exception handling, hard-coded credentials, regex-only parsing, and retries on non-idempotent changes.

## Verification
Run lint/type/tests, simulate failures, verify idempotency, and execute against representative devices.

## Expected output
Tested Python module/tool with clear interfaces, logs, error handling, and operational documentation.

## Stop conditions
Stop when credentials, target scope, or rollback behavior are unsafe or unknown.