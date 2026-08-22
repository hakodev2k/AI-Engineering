# SQL Investigation Skill

## Purpose
Turn a database question into evidence-backed, read-only SQL without granting the agent authority to mutate data.

## When to use
Use for production investigations, support queries, data validation, root-cause analysis, and performance evidence gathering.

## Inputs
Question, target DB engine/environment, known schema, repository migrations/models, and permitted connection/tool scope.

## Preconditions
Identity/environment are known; read-only access is preferred; secrets are supplied outside prompts/files.

## Allowed tools
Repository search, schema metadata, query planner in non-mutating mode, SQL gate, read-only DB client.

## Constraints
1. Inspect relevant models/migrations/query code before guessing schema.
2. Generate the smallest query answering the question.
3. Select explicit columns; avoid `SELECT *` for broad tables.
4. Add bounded predicates/limits where supported.
5. Run `scripts/sql_safety_gate.py` before any DB client.
6. A `blocked` result stops the workflow. `approval_required` cannot be treated as pass.
7. Do not execute writes as part of investigation.

## Process
1. Record facts, hypotheses, and unknowns separately.
2. Identify candidate tables/views and join keys from evidence.
3. Draft read-only SQL and explain expected cardinality.
4. Gate the SQL using the target environment policy.
5. If passed, execute only with read-only credentials.
6. Preserve query, parameters, row count, timing, and relevant plan evidence.
7. Compare results with the hypothesis; revise at most twice.
8. Stop when evidence answers the question or remaining uncertainty requires broader access.

## Expected output
Question, SQL path, gate result, evidence, finding, confidence, unresolved risks.

## Verification
Gate status is `passed`; query is read-only; evidence supports the finding; no unrelated data is exposed.

## Failure handling
Transient DB failure: retry once. Permission failure: stop; never request broader permission automatically. Ambiguous schema: return to repository/schema evidence. Two failed hypothesis revisions: escalate.

## Stop conditions
Unsafe SQL, unknown target environment, missing evidence for table semantics, permission escalation, or two unsuccessful revisions.
