# Hook: Pre-Sensitive-Task Read-Boundary Gate

## Trigger
Immediately before an agent task receives access to local data whose confidentiality depends on sandbox read isolation.

## Preconditions
A current policy file and current probe-observation file exist; synthetic sentinels have been prepared outside the agent boundary; Python 3 is available.

## Action
Validate the current evidence and block sensitive work unless the read boundary is attested.

## Script / command
`python scripts/attest_read_boundary.py --policy <policy.json> --observations <observations.json> --output <attestation.json>`

Then run:
`python -m unittest tests/test_attest_read_boundary.py`

## Expected result
Validator exit code 0, attestation status `verified`, and passing unit tests.

## Failure behavior
- Exit 2: block immediately and escalate as a confirmed boundary violation.
- Exit 3: block as incomplete evidence or sandbox-health failure; allow at most two diagnostic/retest cycles in the workflow.
- Test failure: block completion and repair the package or environment before relying on the gate.

## Blocking
Yes. Failure MUST block secret-bearing or otherwise sensitive agent work. The hook MUST NOT downgrade the sandbox or disable read restrictions to recover availability.
