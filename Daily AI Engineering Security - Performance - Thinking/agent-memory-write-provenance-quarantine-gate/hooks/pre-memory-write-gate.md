# Hook: Pre-Memory-Write Gate

## Trigger
Immediately before any durable memory insert/update/promotion.

## Preconditions
Candidate JSON and policy file exist; no production write has occurred yet.

## Action
Run the deterministic gate and block persistence unless decision is compatible with the target memory store.

## Script/command
```bash
python scripts/memory_write_gate.py candidate.json --policy config/policy.example.json --json-out gate-report.json
```

## Expected result
Exit `0` only for `allow`; exit `2` for `quarantine`; exit `3` for `block`; exit `1` for invalid input/runtime failure.

## Failure behavior
- `quarantine`: route to isolated quarantine storage with provenance metadata; do not expose as privileged instruction.
- `block`: reject write and record sanitized findings.
- runtime/input failure: fail closed for privileged memory; quarantine other external content.

## Blocks completion
Yes for trusted/privileged insertion. A quarantined record may be stored only in an isolated quarantine channel and MUST NOT count as successful trusted persistence.
