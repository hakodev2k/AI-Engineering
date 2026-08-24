# Hook — Session Threshold Attestation

## Trigger
Session start/resume, active model/provider change, configuration reload, or compactor reconstruction.

## Preconditions
The host can provide effective context-window tokens and the effective compaction threshold used by the active runtime.

## Action
Build an attestation input containing configured intent and effective observed values, then run the deterministic verifier.

## Script/command
`python3 scripts/attest_compaction_threshold.py attestation-input.json`

## Expected result
Exit `0` with `PASS` when effective policy is within tolerance and below any absolute ceiling.

## Failure behavior
Exit `2` blocks token-budget compliance claims and should block unattended rollout of a newly changed policy. A host may explicitly classify a known, approved divergence as warning by policy, but must retain its reason code.

## Blocks completion
Yes for automated claims that token-budget policy is enforced. It does not by itself terminate a user session when preserving task context is safer than compaction.
