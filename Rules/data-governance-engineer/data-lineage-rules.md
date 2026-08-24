# Data Lineage Rules
## Purpose
Provide evidence of where important data originates, changes, and is consumed.
## Scope
Critical data elements, transformations, pipelines, reports, models, and external exchanges.
## MUST
- Critical data MUST have lineage from authoritative source through material transformations to significant consumers.
- Lineage MUST identify transformation boundaries and system handoffs.
- Material lineage gaps MUST be treated as governance risks with owners and remediation dates.
## MUST NOT
- Manually asserted lineage MUST NOT be presented as complete when known gaps exist.
- Breaking pipeline changes MUST NOT ignore downstream lineage impact.
## SHOULD
- Lineage SHOULD be captured automatically and supplemented with business lineage for semantic transformations.
## Exceptions
Unavailable lineage requires documented scope, risk, compensating evidence, and approval.
## Verification
Trace representative critical elements end-to-end and compare catalog lineage with pipeline and query metadata.