# Intelligence Knowledge Graph
## Purpose
Keep relationships between entities explainable, temporal, and reversible.
## Scope
Entity resolution, relationships, clustering, aliases, and graph-derived assessments.
## MUST
- Store provenance and time context for consequential relationships.
- Distinguish observed edges from inferred edges.
- Make entity merges reversible and preserve prior identifiers.
## MUST NOT
- Merge actors, campaigns, infrastructure, or malware solely from naming similarity.
- Treat graph proximity as proof of association.
## SHOULD
- Assign confidence to inferred relationships and expire stale associations.
## Exceptions
Provisional clusters may be used for investigation if clearly separated from confirmed entities.
## Verification
Sample graph edges, merge history, provenance, inference rules, and expiry behavior.