# Memory Consistency Rules

## Purpose
Keep agent memory trustworthy, scoped, and reconcilable so stale or inferred information does not silently become operational truth.

## Scope
Applies to ephemeral context, session memory, durable user memory, task state, summaries, retrieved facts, and agent-maintained knowledge used across steps or runs.

## MUST
- Memory classes MUST distinguish ephemeral, session-scoped, and durable records with explicit retention and ownership semantics.
- Durable factual memory MUST retain provenance, source authority, capture time, and freshness information when those affect correctness.
- Conflicting memory records MUST be resolved by an explicit precedence or reconciliation policy.
- Memory access MUST preserve user, tenant, environment, and authorization boundaries.
- Volatile facts MUST define freshness or expiration criteria before they can influence consequential actions.
- Writes to durable memory MUST be attributable to the run and evidence that justified the write.

## MUST NOT
- Model-generated inference MUST NOT be stored or reused as verified fact without appropriate evidence.
- Lower-authority memory MUST NOT silently overwrite a higher-authority source.
- Secrets or sensitive data MUST NOT be retained merely for agent convenience.
- Stale memory MUST NOT override current authoritative state when that state is available.

## SHOULD
- Durable records SHOULD be versioned when corrections or history are operationally relevant.
- Time-sensitive memory SHOULD use explicit TTL or revalidation rules.

## Exceptions
Exceptions require documented data need, retention justification, access controls, risk assessment, and approval where sensitive or regulated information is involved.

## Verification
Test stale-data behavior, conflicting records, tenant isolation, authorization changes, provenance retention, memory correction, and expiration. Sample production memory records for traceability and policy compliance.