# Hook: Pre-tool Capability Gate

## Trigger
Before dispatching an MCP tool when a freshness trigger has occurred since the last verified catalog generation.

## Preconditions
A current authoritative catalog snapshot and the last client-visible snapshot can be exported as JSON arrays of tool definitions.

## Action
Compute normalized fingerprints for both snapshots. If they differ, block dispatch and run the refresh workflow. When only one snapshot is available, mark freshness unknown rather than assuming equality.

## Command
```bash
python3 scripts/catalog_fingerprint.py authoritative-tools.json --compare visible-tools.json
```

## Expected result
Exit `0` with `match: true`.

## Failure behavior
Exit `2` indicates invalid input and blocks. Exit `3` indicates catalog mismatch and blocks calls to changed/missing tools. Invoke `workflows/refresh-and-verify.md`, then retry the gate once.

## Blocking
Yes for tools whose availability/schema is affected by the mismatch. Read-only unaffected tools may proceed only when the host can prove their individual fingerprint is unchanged.