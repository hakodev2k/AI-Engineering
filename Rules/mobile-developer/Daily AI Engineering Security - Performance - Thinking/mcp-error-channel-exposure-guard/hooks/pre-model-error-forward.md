# Hook: Pre-model Error Forward Gate

## Trigger
Immediately before any MCP tool failure/result marked as error is appended to model-visible context.

## Preconditions
Raw failure has already been captured in an approved protected diagnostic channel and assigned a correlation ID.

## Action
Normalize the model-facing envelope and scan it for registered secrets and forbidden diagnostic patterns.

## Command
`python3 scripts/sanitize_mcp_error.py --input raw-error.json --output safe-error.json --secrets-file synthetic-or-runtime-secrets.json`

## Expected result
Exit 0, bounded safe envelope, no registered-secret values, no stack-trace lines, and no forbidden field names/headers.

## Failure behavior
Exit 2 indicates invalid input/configuration; exit 3 indicates a detected unsafe value. Both block forwarding and replace the model-facing error with a generic safe failure containing only a correlation ID.

## Blocking
Yes. The hook cannot be bypassed by retrying the same raw error or by logging it into model context.