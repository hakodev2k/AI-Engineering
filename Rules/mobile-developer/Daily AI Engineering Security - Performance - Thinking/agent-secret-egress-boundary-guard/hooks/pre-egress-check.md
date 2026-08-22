# Hook: Pre-Egress Secret Check

## Trigger
Immediately before any payload is sent to a model provider, persisted to conversation history/logs/artifacts, emitted from a tool, or forwarded to an external network sink.

## Preconditions
A serialized UTF-8 payload exists and the runtime can provide a local registry of secret labels/values or an equivalent taint-aware adapter.

## Action
Run exact-value scanning using `scripts/secret_egress_guard.py`. If the sink supports safe sanitization, redact before transmission and rescan. For authenticated network actions, prefer opaque sink-side resolution so the raw credential never appears in the scanned payload.

## Command
```bash
python scripts/secret_egress_guard.py scan --input pending-payload.txt --secrets-file runtime-secrets.json
```

For a payload explicitly permitted to be sanitized:
```bash
python scripts/secret_egress_guard.py redact --input pending-payload.txt --secrets-file runtime-secrets.json --output sanitized-payload.txt
python scripts/secret_egress_guard.py scan --input sanitized-payload.txt --secrets-file runtime-secrets.json
```

## Expected result
Exit code 0 and zero findings for every sink that is not an approved secret resolver.

## Failure behavior
Exit code 2 indicates configuration/I/O failure and blocks the sink. Exit code 3 means registered secret material is present and blocks the sink. Retry at most once after deterministic sanitization; otherwise invoke the failure path in `workflows/egress-hardening.md`.

## Blocking
Yes. Failure blocks transmission/persistence rather than allowing best-effort leakage.