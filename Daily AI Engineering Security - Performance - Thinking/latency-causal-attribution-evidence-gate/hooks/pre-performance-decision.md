# Hook — Pre-Performance-Decision Attribution Gate

## Trigger
Immediately before a performance-motivated implementation/configuration change or final performance conclusion.

## Preconditions
A timing JSON record exists and `config/policy.json` is available.

## Action
Run:

`python3 scripts/latency_phase_gate.py timing.json --policy config/policy.json --claim-phase tool_execution --output attribution-report.json`

Use the phase matching the actual claim.

## Script/command
`scripts/latency_phase_gate.py`

## Expected result
Exit `0` with status `attributable`.

## Failure behavior
Exit `2` blocks causal implementation/conclusion until missing evidence is collected. Exit `3` blocks because input/policy is invalid.

## Blocking
Yes. It blocks only the performance claim/change, not unrelated safe work.
