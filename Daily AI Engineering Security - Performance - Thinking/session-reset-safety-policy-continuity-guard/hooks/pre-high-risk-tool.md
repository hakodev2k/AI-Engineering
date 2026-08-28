# Hook: Pre High-Risk Tool
## Trigger
Immediately before credential access, privilege escalation, remote execution, persistence, exfiltration, or destructive write.
## Preconditions
Current event is normalized; continuity history and policy are readable.
## Action
Run:
`python scripts/session_continuity_guard.py --event <event.json> --history <history.json> --policy config/policy.json`
## Expected result
Exit `0` permits the policy layer to continue; exit `3` blocks the tool request with reason codes.
## Failure behavior
Fail closed and preserve only minimized decision evidence.
## Blocking
Yes.
