# Tool Use Safety Rules

## Purpose
Constrain AI tool use so model errors cannot silently become high-impact real-world actions.

## Scope
Applies to agents invoking APIs, code execution, databases, infrastructure, communications, financial, or administrative tools.

## MUST
- Enforce least privilege, scoped credentials, input validation, and server-side authorization per action.
- Classify actions by impact and require human approval for destructive, irreversible, security-sensitive, or production-changing actions.
- Make retries idempotent or explicitly guarded against duplicate effects.
- Log consequential tool calls with actor, parameters or safe hashes, outcome, and correlation identifiers.

## MUST NOT
- Let model-generated text bypass authorization policy.
- Grant broad production credentials merely for convenience.
- Automatically retry non-idempotent consequential actions without safeguards.

## SHOULD
- Prefer read-only analysis before write capability.
- Use dry-run or preview modes for risky operations.

## Exceptions
Expanded privileges require time bounds, documented necessity, risk controls, monitoring, and accountable approval.

## Verification
Review permission scopes, authorization tests, approval gates, idempotency tests, audit logs, and failure-mode exercises.
