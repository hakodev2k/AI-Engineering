# Hook: Pre-Mutation Approval Gate

## Trigger
Immediately before any write/edit/delete/commit/push/deploy or equivalent side-effecting tool dispatch from a session that entered Plan Mode.

## Preconditions
Current session epoch and active plan hash are available; authorization events are serialized to a JSON trace.

## Action
Run `python scripts/approval_gate.py <trace.json> --pretty` and require exit code 0 plus `approval_bound: true` for Plan Mode mutations.

## Script/command
```bash
python scripts/approval_gate.py trace.json --pretty
```

## Expected result
Authorized mutation: exit 0 with a bound approval ID matching current plan and epoch. Unapproved/stale/resume-widened mutation: exit 2 with a reason code.

## Failure behavior
Block the mutation, preserve or restore read-only behavior, record sanitized evidence, and require fresh user approval through the host mechanism.

## Blocking
Yes. The hook MUST NOT be bypassed because of a resume, reconnect, timeout, question failure, or model instruction.
