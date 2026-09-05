# Hook: Predeploy Auth Negative Test

## Trigger
Before deployment or promotion of an AI orchestration/control-plane service.

## Preconditions
`surfaces.json` reflects the candidate deployment; critical endpoints are classified; safe probe URLs are available outside this repository when runtime probing is performed.

## Action
1. Run static admission checker.
2. If it passes, execute organization-approved negative-auth HTTP probes against each critical endpoint.

## Script / command
`python scripts/auth_surface_gate.py <surfaces.json>`

Runtime probe command is environment-specific and **MUST** send no credential. Acceptable outcomes are 401, 403, or network denial according to the intended topology.

## Expected result
Checker exit 0; every critical anonymous probe denied.

## Failure behavior
Any checker error/finding or anonymously successful critical request blocks release. Store sanitized response metadata as evidence.

## Blocks completion
Yes.