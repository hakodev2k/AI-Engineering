# Hook — Pre-Classifier Envelope

## Trigger
Immediately before a classifier receives effective agent context for a gated action.

## Preconditions
The host can identify context origin and action risk without executing the action.

## Action
Serialize context into segment objects with `origin`, `trust`, `content`; assign stable IDs/hashes; retain the ID mapping for classifier reconciliation.

## Script/command
`python scripts/provenance_gate.py <decision-input.json> --policy config/policy.json --output <gate-record.json>`

Hosts that integrate directly SHOULD reuse `envelope_segments()` before classification.

## Expected result
Every classifier-visible segment has stable provenance metadata.

## Failure behavior
Missing/invalid provenance blocks automatic approval and routes to review/block by risk.

## Blocks completion
Yes for medium/high/critical actions. Low-risk read-only actions may use configured fail-safe policy.
