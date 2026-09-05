# Hook: Pre-Install Quarantine

## Trigger
Immediately before any MCP/agent package install or version change.

## Preconditions
Policy and package manifest exist; manifest was produced without executing the package.

## Action
Run `python scripts/quarantine_scan.py <policy.json> <manifest.json>`.

## Expected result
Exit 0 with PASS.

## Failure behavior
Exit 2 blocks installation and preserves findings. Exit 1 blocks because evidence is invalid/incomplete.

## Blocks completion
Yes. Only explicit security review may clear a quarantine; a known malicious match cannot be auto-overridden.