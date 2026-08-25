# Hook: Pre-Privileged Tool Attestation

## Trigger
Immediately before a privileged, external-write, credential, production, deployment, or irreversible tool executes.

## Preconditions
The runtime has recorded the causal authoritative event in a JSONL provenance ledger and can identify its event ID.

## Action
Run the deterministic provenance validator against the causal event and exact model-visible content/hash.

## Script/command
`python scripts/provenance_guard.py --ledger "$LEDGER" --event-id "$CAUSAL_EVENT_ID" --content-file "$CAUSAL_CONTENT_FILE" --risk privileged`

The host MUST pass arguments directly rather than interpolating untrusted message content into a shell command.

## Expected result
Exit `0` and JSON verdict `allow`.

## Failure behavior
- Exit `3`: block the tool call, preserve mismatch metadata, and require explicit fresh human authorization if the action is still desired.
- Exit `4`: block because the evidence/ledger is invalid.
- Exit `2`: invalid for a privileged hook; treat as blocked.

## Blocks completion
Yes for any privileged action whose causal event cannot be attested.

## Safety
The hook hashes/reads content only. It MUST NOT execute message text or emit raw secrets into logs.