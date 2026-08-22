# Hook: Pre-Launch Trust Gate

## Trigger
Immediately before a privileged plugin service or native-host-backed integration starts.

## Preconditions
A JSON preflight configuration exists with expected plugin root, service path, trusted roots, and optional expected version/hash/native-host fields.

## Action
Run:

`python scripts/trusted_plugin_preflight.py --config <preflight.json>`

## Expected result
Exit `0` and JSON status `pass` only when required provenance, path, trust-root, and registration checks succeed.

## Failure behavior
Exit non-zero, block privileged launch, log only redacted structural diagnostics, and route to `workflows/diagnose-and-verify.md`.

## Blocking
Yes. Failure MUST block the affected privileged launch.