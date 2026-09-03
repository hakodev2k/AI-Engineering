# Hook: Pre-Resume Addressability Gate

## Trigger
Immediately before dispatching any resume command into a durable workflow with pending interrupts.

## Preconditions
The host has materialized the effective pending interrupt IDs across nested tasks/subgraphs and serialized the proposed resume payload.

## Action
Run:

```bash
python scripts/resume_gate.py resume-input.json --pretty
```

## Expected result
Exit 0 only when the resume is unambiguous: a single pending interrupt under host semantics, or an ID-keyed mapping for multiple interrupts. Output identifies resumed and remaining IDs.

## Failure behavior
Block resume, preserve checkpoint state, emit the deterministic reason code, and require an explicitly addressed payload or runtime repair.

## Blocking
Yes. Failure MUST NOT be converted into “pick first,” display-order routing, or an automatic retry with the same ambiguous scalar.
