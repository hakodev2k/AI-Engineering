# Data Quality Ownership Rules
## Purpose
Ensure every critical quality obligation has accountable ownership.
## Scope
Dataset owners, rule owners, escalation, stewardship, and consumer responsibilities.
## MUST
- Critical datasets and blocking quality rules MUST have accountable owners and escalation paths.
- Ownership transfer MUST include open incidents, known limitations, contracts, and operational obligations.
- Unowned critical failures MUST be escalated rather than silently ignored.
## MUST NOT
- MUST NOT assign ownership to generic teams without a resolvable accountable function or contact mechanism.
- MUST NOT treat data quality as solely a downstream testing responsibility when defects originate upstream.
## SHOULD
- Ownership SHOULD align with authority to remediate the relevant source or transformation.
## Exceptions
Shared ownership requires explicit decision rights and escalation boundaries.
## Verification
Inspect catalog metadata, alert routing, incident assignments, handover records, and remediation authority.