# Incident and Recovery Rules
## Purpose
Restore trustworthy data quickly while preserving evidence and preventing repeated damage.
## Scope
Pipeline outages, corrupt data, delayed datasets, failed loads, and production data incidents.
## MUST
- Incidents MUST identify affected datasets, time range, consumers, and current trust status.
- Recovery MUST prioritize containment before broad correction when ongoing corruption is possible.
- Root cause SHOULD be identified or bounded by evidence before broad permanent changes.
- Corrected data MUST be reconciled and consumers informed when published outputs were affected.
## MUST NOT
- MUST NOT silently repair production data without audit evidence.
- MUST NOT declare recovery complete before freshness and correctness are verified.
## SHOULD
- Prefer reproducible recovery procedures and retained incident timelines.
## Exceptions
Immediate containment may precede diagnosis when damage is continuing.
## Verification
Inspect incident records, logs, lineage, reconciliation results, consumer communication, and follow-up actions.