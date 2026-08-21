# Hook — Pre-Fetch Egress Check

## Trigger
Immediately before an MCP/network tool opens an outbound connection and before following each redirect.

## Preconditions
The candidate URL and repository policy file are available. The hook executes before any credentials, cookies, or authorization headers are attached to the destination.

## Action
Run:

`python3 scripts/url_guard.py "$TARGET_URL" --policy config/policy.json`

For redirects, invoke the same command with the redirect target before the client follows it.

## Expected result
Exit `0` with JSON `decision=allow` for a permitted public destination. Exit `3` for policy denial, `4` for DNS failure, or `2` for invalid input/configuration.

## Failure behavior
Any non-zero exit blocks the outbound request. Record the non-secret reason and correlation ID. Do not auto-relax policy. DNS failures may be retried by the caller at most once if the operation is idempotent and the retry budget allows it.

## Blocks completion
Yes. A fetch implementation is incomplete if any outbound or redirect path can bypass this gate (or an equivalent native implementation with the same tests).