# Hooks

## PreTool

**Trigger:** before any non-trivial mutating tool call.

**Action:** require `action-request.json` and run policy evaluation.

**Command:**

```bash
python scripts/check-policy.py --policy config/policy.json --request action-request.json --output decision.json
```

**Failure behavior:** stop execution if the script fails, returns `deny`, or returns `approval_required` without explicit approval.

## PreSensitiveRead

**Trigger:** before reading a path likely to contain credentials, tokens, keys, environment secrets, or private certificates.

**Action:** create a permission request with `touches_secrets=true` and evaluate policy.

**Command:** same policy checker.

**Failure behavior:** fail closed. Do not print or inspect the sensitive content.

## PostTool

**Trigger:** immediately after a gated action executes.

**Action:** write an audit record containing request, decision, timestamp, and execution outcome.

**Command:**

```bash
python scripts/write-audit-record.py --request action-request.json --decision decision.json --status "$TOOL_STATUS"
```

**Failure behavior:** retry once; if audit still fails, mark the action `unverified`.

## PreComplete

**Trigger:** before the agent declares the task complete.

**Action:** Permission Auditor reviews all gated actions and checks repository/tool state for scope drift.

**Command:** project-specific read-only status/diff commands plus audit-log inspection.

**Failure behavior:** do not declare `verified` while a violation or missing audit record exists.
