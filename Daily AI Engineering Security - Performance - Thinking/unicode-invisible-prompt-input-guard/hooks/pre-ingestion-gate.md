# Pre-Ingestion Gate

## Trigger
Before external text is inserted into model context, RAG memory, privileged tool arguments, or a human approval prompt.

## Preconditions
Raw text is stored in a non-executable quarantine location; downstream consumer has not yet seen it.

## Action
Run `python3 scripts/unicode_input_guard.py <input.txt> --strip-risky --output <canonical.txt>` and capture the JSON report. For high-authority paths, any finding requires policy review before `canonical.txt` can be released downstream.

## Expected result
Clean input exits `0`. Risky input exits `2`, includes an escaped representation and code-point findings, and does not proceed automatically to privileged execution.

## Failure behavior
Exit `3`, missing report, unreadable input, or hash mismatch blocks ingestion. Retry once for deterministic operational errors; otherwise escalate.

## Blocking
Yes for execution, credential, write, deployment, external-send, or persistent-memory paths. Read-only low-authority paths may quarantine for human review but MUST NOT silently bypass the gate.
