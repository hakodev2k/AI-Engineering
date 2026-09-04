# Production Monitoring and Feedback Rules
## Purpose
Use production evidence to detect dataset drift, coverage gaps, and curation defects that require corrective action.
## Scope
Post-deployment feedback, drift signals, failure samples, incident data, and dataset refresh decisions.
## MUST
- Production feedback used for curation MUST preserve provenance, consent or policy constraints, and linkage to the observed failure or drift signal.
- Dataset refresh decisions MUST be supported by measured evidence such as distribution shift, error cohorts, stale sources, or new operating conditions.
- Feedback loops MUST protect evaluation integrity and prevent accidental leakage of test labels or sensitive production data.
## MUST NOT
- Production data MUST NOT be ingested into training sets automatically without governance and quality gates.
- Anecdotal failures MUST NOT be generalized into broad dataset changes without bounded evidence.
## SHOULD
- Recurrent model failures SHOULD be converted into reviewed challenge or regression datasets when appropriate.
## Exceptions
Exceptions require documented risk, evidence, controls, and approval.
## Verification
Review drift reports, failure cohorts, refresh tickets, lineage, privacy checks, and before/after evaluation evidence.