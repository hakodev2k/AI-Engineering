# Hook — Pre Dispatch Authorization

## Trigger
Immediately before resolving/executing any tool or subagent.

## Preconditions
Principal, request ID, requested capability and effective allowlist are available.

## Action
Serialize the authorization envelope and run `python scripts/dispatch_guard.py <envelope.json>` or enforce an equivalent in-process check.

## Expected result
Exit code 0 only when the capability is inside the effective scope and no delegation/global-fallback rule widens authority.

## Failure behavior
Exit code 3 or malformed context blocks dispatch and logs a secret-free reason code.

## Blocks completion
Yes for privileged or externally effectful capabilities.
