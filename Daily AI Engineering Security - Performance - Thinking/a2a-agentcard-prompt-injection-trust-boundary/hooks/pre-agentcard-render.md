# Hook: Pre-AgentCard Render

## Trigger
Immediately before discovered AgentCard data is added to any model context.

## Preconditions
Raw card is available as a local JSON file; trusted local policy exists.

## Action
Run:
```bash
python scripts/scan_agentcard.py "$AGENTCARD_JSON" --policy config/policy.json --normalized-out "$AGENTCARD_NORMALIZED_JSON"
```

## Expected result
Exit `0` and a normalized JSON file containing data-only fields plus provenance-neutral structure.

## Failure behavior
Exit `2` blocks model rendering and dispatch. Exit `64` indicates invalid input/config and also blocks completion.

## Blocking
Yes. The host MUST NOT render raw card text after a hook failure.