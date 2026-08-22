# Pre-Egress Hook

## Trigger
Immediately before any outbound HTTP request whose destination is not a hard-coded trusted endpoint owned by the application.

## Preconditions
Python 3, PyYAML, policy file, and the exact effective URL are available.

## Action
Run:

`python scripts/validate-url.py "$TARGET_URL" --policy config/policy.yaml`

## Expected result
Exit code 0 and an `ALLOW host -> ip...` record. The caller may then connect only to that validated authority with redirects disabled.

## Failure behavior
Any non-zero exit code blocks execution. Exit code 5 means the host is not allowlisted and requires human approval before policy modification. DNS-related failure may be retried once; all other failures stop immediately.

## Blocking
Yes. This hook is a security boundary and cannot be advisory.
