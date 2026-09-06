# Hook: Pre-Action Feasibility Gate

## Trigger
Immediately before a consequential GUI action and after any state transition that can invalidate the evidence supporting the action.

## Preconditions
A structured feasibility envelope exists with the current goal, constraints, observations, conflict records, previous open-conflict IDs, evidence-completeness flag, and proposed action metadata.

## Action
Run:

```bash
python3 scripts/feasibility_gate.py feasibility.json
```

The runtime MUST map the script decision as follows:
- `PROCEED` — action may execute.
- `STOP` — action MUST NOT execute; terminate the conflicting path.
- `ESCALATE` — action MUST NOT execute; gather permitted evidence or request scoped human resolution.

## Expected result
Exit code 0 only for `PROCEED`. `STOP` returns 2 and `ESCALATE` returns 3. Invalid inputs return 1.

## Failure behavior
Any nonzero exit blocks the proposed consequential action. Preserve the sanitized decision artifact. Never convert a nonzero exit to success because the proposed action appears harmless to the acting model.

## Blocking
Yes for consequential actions. For non-consequential observation/navigation actions, the host MAY allow a narrowly scoped evidence-gathering action only when it cannot violate any task constraint and no blocking conflict explicitly forbids it.
