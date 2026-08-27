# Hook: Pre-Network Request

## Trigger
Immediately before an MCP/agent network connection and again before each redirect.

## Preconditions
The host has resolved the destination and knows whether credentials would be attached.

## Action
Run `python scripts/url_boundary_guard.py --url <url> --policy config/network-policy.json --resolved-ip <ip>`.

## Expected result
Exit 0 for an approved destination.

## Failure behavior
Exit 3 blocks the request. Exit 2 blocks on invalid policy/input. Credentials are never attached on failure.

## Blocking
Yes.
