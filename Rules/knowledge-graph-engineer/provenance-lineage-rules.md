# Provenance and Lineage Rules

## Purpose
Make graph facts traceable to their origin, transformation, and responsible producer.

## Scope
Source records, derived assertions, ingestion jobs, transformations, ontology versions, and downstream consumers.

## MUST
- Production facts MUST be traceable to authoritative source records or documented derivation logic.
- Derived assertions MUST record enough provenance to reproduce or explain their creation.
- Lineage MUST identify the transformation and schema or ontology version that produced material graph state.
- Conflicting facts from different sources MUST preserve source attribution until resolved.

## MUST NOT
- MUST NOT publish high-impact facts with unknown provenance.
- MUST NOT erase provenance during entity merges or graph migrations.
- MUST NOT treat inferred facts as source-observed facts without distinction.

## SHOULD
- Automate provenance capture in ingestion and reasoning pipelines.
- Preserve immutable source references where practical.

## Exceptions
Reduced provenance requires documented limitation, risk, and accountable owner.

## Verification
Inspect sampled graph facts, lineage metadata, derivation records, and reconstruction tests.