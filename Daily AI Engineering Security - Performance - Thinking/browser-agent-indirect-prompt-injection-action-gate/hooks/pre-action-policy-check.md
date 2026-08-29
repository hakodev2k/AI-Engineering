# Hook: Pre-Action Policy Check

## Trigger
Immediately before a browser/computer-use tool executes a navigation, sensitive read, form fill, click with side effect, send, submit, upload/download, local-file access, clipboard write, transaction, deletion, or other configured action.

## Preconditions
The orchestrator supplies a structured action record with action type, source provenance, destination when applicable, sensitive-data flag, approval status, and authenticated-context flag.

## Action
Evaluate the exact intended action against the deterministic policy before execution.

## Script / command
```bash
python scripts/browser_action_gate.py pending-action.json --policy config/policy.example.json
```

## Expected result
Exit `0`: action is authorized by deterministic policy.  
Exit `2`: action is denied or requires explicit human approval before retry.  
Exit `1`: malformed action/policy; fail closed.

## Failure behavior
Do not execute the browser action. Preserve a redacted reason code and return control to an approval/security path. Never include cookies, tokens, passwords, or sensitive payload bodies in the gate report.

## Blocking
Yes. Any deny, approval-required, or evaluation error blocks the pending high-risk action.
