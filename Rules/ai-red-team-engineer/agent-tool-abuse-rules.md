# Agent Tool Abuse

## Purpose
Prevent AI agents from turning model compromise into unauthorized real-world actions.

## Scope
Tool calling, plugins, browsers, code execution, APIs, filesystems, messaging, infrastructure, and transaction-capable actions.

## MUST
- Test authorization at the tool boundary independently of model intent.
- Exercise confused-deputy, parameter-tampering, privilege-escalation, and chained-tool scenarios.
- Verify high-impact actions require the intended approval or policy gate.

## MUST NOT
- Assume a system prompt is an authorization control.
- Execute destructive or externally consequential actions without explicit test authorization and safeguards.

## SHOULD
Prefer mocks, sandboxes, dry runs, and reversible test fixtures for dangerous capabilities.

## Exceptions
Production execution requires explicit human approval, bounded blast radius, rollback readiness, and monitoring.

## Verification
Inspect tool-call traces, authorization decisions, side effects, approval records, and rollback evidence.