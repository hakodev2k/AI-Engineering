# Metadata Contract Rules

## Purpose
Ensure registered models contain the metadata required for safe discovery, review, deployment, and audit.

## Scope
Model cards, ownership, framework/runtime requirements, interfaces, datasets, metrics, risk classification, and lifecycle state.

## MUST
- Every production-candidate model MUST record owner, purpose, artifact identity, framework/runtime requirements, input/output contract, and lifecycle state.
- Evaluation metrics used for promotion MUST identify dataset or benchmark version and evaluation procedure.
- Runtime dependencies that can affect model behavior MUST be recorded or linked to an immutable environment specification.
- Risk-relevant metadata MUST identify applicable security, privacy, safety, or regulatory constraints.
- Required metadata fields MUST be validated before a model enters a governed lifecycle stage.

## MUST NOT
- Models with missing mandatory ownership or interface metadata MUST NOT be promoted to production stages.
- Free-text metadata MUST NOT replace machine-verifiable fields when automation depends on them.
- Registry metadata MUST NOT claim evaluation or approval that cannot be traced to evidence.

## SHOULD
- Metadata SHOULD use controlled vocabularies for lifecycle state, framework, task type, and risk class where practical.
- Large evidence artifacts SHOULD be linked by immutable reference rather than copied into mutable notes.

## Exceptions
Exceptions require documented missing fields, reason, operational impact, compensating evidence, and approval.

## Verification
Run schema validation, inspect model records, trace evidence references, and verify deployment automation reads the expected metadata fields.