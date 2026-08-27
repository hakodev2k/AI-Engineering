# Automation and Scripting Rules

## Purpose
Use forensic automation without sacrificing reproducibility, evidence integrity, or reviewability.

## Scope
Applies to scripts, notebooks, pipelines, bulk parsers, enrichment, normalization, and automated reporting.

## MUST
- Automation that transforms evidence MUST preserve source references and deterministic transformation logic where practical.
- Script versions, dependencies, parameters, and execution logs MUST be retained for material analyses.
- Bulk processing MUST detect and report failed, skipped, and malformed inputs.
- Automated classifications used in conclusions MUST expose criteria and confidence or validation evidence.
- Scripts that can alter source evidence or production systems MUST default to non-destructive behavior.

## MUST NOT
- MUST NOT silently drop records on parse errors.
- MUST NOT embed credentials or secrets in scripts or notebooks.
- MUST NOT use generated summaries as substitutes for underlying evidence validation.

## SHOULD
- Pin dependencies for reproducible case work.
- Test transformations against known fixtures and edge cases.

## Exceptions
Exploratory scripts may have lighter packaging, but any result promoted to a material finding MUST become reproducible and reviewed.

## Verification
Review source code, dependency manifests, execution logs, test fixtures, failure counts, parameters, and sampled source-to-output traces.