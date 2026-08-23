# Reproducibility and Lineage Rules

## Purpose
Ensure analytical results can be reconstructed and audited.

## Scope
Queries, notebooks, transformation scripts, extracts, models, and published outputs.

## MUST
- Preserve source references, query or code version, parameters, filters, and execution context needed to reproduce material results.
- Record lineage from published metrics back to governed sources where practical.
- Separate manual adjustments from computed results and document every material override.
- Make recurring analytical logic version-controlled or otherwise governed.

## MUST NOT
- MUST NOT rely on undocumented spreadsheet edits for critical recurring metrics.
- MUST NOT publish numbers that cannot be traced to a source and transformation path.

## SHOULD
- Automate reproducible pipelines for repeated analyses.

## Exceptions
One-off exploration may use lightweight tooling if the final decision evidence is captured reproducibly before publication.

## Verification
Re-run representative outputs from recorded inputs and inspect lineage, version history, parameters, and override logs.