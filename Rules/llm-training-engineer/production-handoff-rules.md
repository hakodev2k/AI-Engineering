# Production Handoff Rules

## Purpose
Ensure training outputs reach inference, evaluation, and operations teams with explicit contracts and risks.

## Scope
Checkpoint handoff, tokenizer/config artifacts, serving constraints, model metadata, operational readiness, and rollback inputs.

## MUST
- Handoff MUST specify exact checkpoint and tokenizer identities, architecture/configuration, supported context assumptions, precision expectations, and known limitations.
- Training engineers MUST provide evidence for required evaluation gates and identify any unresolved risks.
- Conversion requirements and expected parity tolerances MUST be documented.
- A rollback-capable prior artifact MUST remain identifiable when a new model replaces an existing production model.
- Production deployment itself MUST require authorized human approval and follow the receiving system's release controls.

## MUST NOT
- MUST NOT hand off an ambiguous 'latest' checkpoint.
- MUST NOT assume training-time behavior is preserved after quantization, conversion, serving-kernel changes, or prompt-wrapper changes.
- MUST NOT conceal training anomalies that may affect production reliability or safety.

## SHOULD
- Training and serving teams SHOULD jointly validate a representative end-to-end sample before release.
- Handoffs SHOULD include resource expectations and observed behavior on long-context or stress cases where relevant.

## Exceptions
Research-only handoffs may omit production controls if explicitly labeled non-production and access-restricted.

## Verification
Inspect artifact IDs, metadata, evaluation reports, conversion/parity tests, rollback reference, risk notes, and deployment approval records.