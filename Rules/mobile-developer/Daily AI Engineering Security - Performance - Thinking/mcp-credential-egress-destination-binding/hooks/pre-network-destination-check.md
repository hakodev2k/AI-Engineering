# Hook: Pre-network Destination Check

## Trigger
Immediately before building or sending a request that will contain authorization material.

## Preconditions
Candidate URL and credential class are available; policy is loaded from trusted configuration.

## Action
Run `python3 scripts/destination_guard.py <url> --credential-class <class> --policy config/destination-policy.json`. In production, DNS checking must remain enabled.

## Expected result
Exit 0 with `decision=allow` and canonical destination details.

## Failure behavior
Exit 2 is configuration/input failure; exit 5 is a policy denial. Both block credential attachment and network I/O. Record only non-secret decision metadata.

## Blocking
Yes. The hook MUST NOT be bypassed for convenience or retry recovery.