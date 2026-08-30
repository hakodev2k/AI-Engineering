# Pre-Ingest Discovery Metadata Hook

## Trigger
Immediately after protocol discovery/AgentCard retrieval and before any remote natural-language field is added to model context.

## Preconditions
Raw payload saved or hashed; endpoint identity known; policy file readable.

## Action
Run the deterministic guard against the raw payload and emit a guarded envelope.

## Command
```bash
python scripts/discovery_metadata_guard.py "$DISCOVERY_PAYLOAD" --policy config/policy.example.json --out "$GUARDED_PAYLOAD"
```

## Expected result
Exit code 0 and a guarded JSON envelope whose remote natural-language fields have `trusted_as_instruction: false`. Findings and provenance are present. The local action policy is not modified by input metadata.

## Failure behavior
Exit code non-zero blocks ingestion. Quarantine the payload, retain its hash and error, and do not fall back to raw metadata.

## Blocks completion
Yes. Unknown provenance, invalid policy, malformed input, or guard failure is a blocking condition.
