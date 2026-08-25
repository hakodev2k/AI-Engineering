# MCP Task Auth Context Binding Guard

**Category:** Security  
**Research date:** 2026-08-25 (UTC+7)

## Problem
The MCP 2026-07-28 Tasks extension makes task handles long-lived objects that can be polled, cancelled, updated, and resolved after the originating tool request. The protocol removed general protocol-level sessions, so servers cannot rely on a session ID as the authorization boundary. SEP-2663 explicitly requires authorization checks on every task request and notes that, where caller binding is unavailable, the task ID can become the only defense against cross-caller access.

## Evidence
See `evidence/research.md`. The current specification and active SDK work show that the extension is shipping while authorization binding remains intentionally implementation-defined.

## Existing approach and limitation
Servers can use unguessable task IDs, application authentication, bespoke task stores, and per-request authorization. Random IDs reduce enumeration but are bearer capabilities: accidental disclosure can still grant access if the task is not independently bound to an authenticated principal/resource context.

## Proposed improvement
Persist a server-side task ownership binding at creation and require it on every `tasks/get`, `tasks/cancel`, `tasks/update`, and result access. Store a keyed HMAC of the normalized authorization context rather than raw identity data. Treat task IDs as secrets but never as sufficient authorization by themselves.

## Architecture
```text
README.md
evidence/research.md
skills/task-auth-binding-analysis.md
rules/task-authorization-policy.md
subagents/task-security-verifier.md
workflows/bind-and-authorize.md
hooks/pre-task-access.md
scripts/task_binding.py
tests/test_task_binding.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Set a high-entropy secret in `MCP_TASK_BINDING_KEY`. The reference CLI refuses to run without it. Use a real authenticated principal/resource identifier from your host, not model-generated identity text.

## Usage
Create a binding:
`python scripts/task_binding.py create registry.json --principal tenantA:user42`

Authorize access:
`python scripts/task_binding.py check registry.json --task-id <id> --principal tenantA:user42`

The production integration should call the same binding logic at the request authorization layer before dispatching task handlers.

## Metrics
Unauthorized task-access attempts, task requests missing auth context, cross-principal denial rate, task-ID-only access rate, stale binding count, security-test coverage.

## Verification
Run `python -m unittest tests/test_task_binding.py`. Tests prove same-principal access succeeds, cross-principal access fails, unknown task IDs fail, and a different key cannot validate an existing binding.

## Safety
MUST fail closed when identity/auth context is absent. MUST NOT log bearer tokens, raw credentials, or task results. Human approval is required before any recovery action that broadens task visibility.

## Failure handling
Detection: missing/mismatched binding. Evidence: task ID plus non-secret binding outcome. Retry: one retry only after re-authentication, never by weakening checks. Fallback: deny. Escalation: security review for suspected leakage. Stop: no valid principal or binding.

## Definition of Done
**Implemented:** task ownership binding exists at creation and all task endpoints enforce it.  
**Measured:** access-denial/missing-context metrics are emitted.  
**Verified:** cross-principal fixtures are blocked; legitimate access passes; no raw secret/credential is persisted; task-ID-only authorization is zero for protected deployments.

## Customization
Bind to the smallest stable host authorization context that expresses ownership (for example tenant + subject + MCP resource). Rotating the HMAC key requires an explicit migration strategy; never silently accept old unverified bindings.