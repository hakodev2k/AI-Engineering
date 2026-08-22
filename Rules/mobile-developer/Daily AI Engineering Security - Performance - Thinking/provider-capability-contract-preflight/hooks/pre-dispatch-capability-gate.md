# Hook: Pre-dispatch Capability Gate

## Trigger
Before the first real model request for each distinct request lane and whenever provider/model/client-version changes.

## Preconditions
`required-capabilities.json` and a fresh `capability-matrix.json` exist.

## Action
Run the deterministic gate and inspect the serialized request for any capability absent from the matrix.

## Command
`python3 scripts/capability_gate.py --required required-capabilities.json --matrix capability-matrix.json`

## Expected result
Exit 0. Every required capability is explicitly supported by evidence.

## Failure behavior
Exit 2 blocks for invalid configuration. Exit 3 blocks because required capabilities are unsupported or unknown. Do not enter normal model retries; invoke the preflight workflow instead.

## Blocking
Yes. The hook MUST block a request rather than allowing deterministic provider schema errors or bypassing required approval behavior.