# Hook: Pre-delegation Attestation Gate

## Trigger
Immediately before spawning a delegate that may perform protected operations.

## Preconditions
Policy hash, target topology, correlation ID, and recent attestation record are available.

## Action
Verify that the target topology has a non-expired PASS attestation matching the current policy/client/topology fingerprint.

## Command
`python3 scripts/verify_attestation.py attestation.json --require-topology agent-team --policy-hash "$POLICY_HASH"`

## Expected result
Exit 0 with unique delegate identities, required control events observed, parent reconciliation successful, and matching policy hash.

## Failure behavior
Exit 2 for invalid evidence/configuration and exit 3 for failed coverage. Block protected delegation. Permit only a harmless attestation canary or route work to a topology with proven controls.

## Blocking
Yes. Missing proof blocks protected delegated execution.