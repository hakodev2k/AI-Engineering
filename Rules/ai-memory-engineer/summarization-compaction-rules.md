# Summarization and Compaction Rules

## Purpose
Reduce memory volume without losing critical facts, provenance, uncertainty, or safety-relevant context.

## Scope
Summaries, consolidation, deduplication, archival, compression, and hierarchical memory.

## MUST
- Compaction MUST define which information may be discarded and which metadata must survive.
- Summaries MUST distinguish sourced facts from model-generated interpretation.
- Critical constraints, permissions, revocations, and unresolved conflicts MUST survive compaction.
- Compaction output MUST retain links to source memories when later verification may be required.

## MUST NOT
- MUST NOT summarize away uncertainty or contradictory evidence into false certainty.
- MUST NOT merge distinct users, entities, or temporal states into one ambiguous record.
- MUST NOT delete source records before retention and recovery requirements are satisfied.

## SHOULD
- Evaluate summary faithfulness on representative long-memory cases.
- Prefer reversible compaction for high-value memory classes.

## Exceptions
Exceptions require documented information-loss tolerance, evidence, and approval.

## Verification
Inspect compaction tests, source linkage, conflict preservation, information-loss evaluations, and recovery checks.