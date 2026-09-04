# Retention and Deletion Rules
## Purpose
Ensure datasets are retained only as long as justified and deleted reliably when required.
## Scope
Raw data, intermediates, labels, snapshots, backups, caches, and released datasets.
## MUST
- Retention periods MUST be defined from legal, contractual, operational, and model-reproducibility needs.
- Deletion requests or expiry actions MUST propagate to governed copies where required.
- Deletion workflows MUST preserve audit evidence without retaining prohibited content.
## MUST NOT
- Data MUST NOT be retained indefinitely by default.
- Expired sensitive data MUST NOT remain in unmanaged exports or caches.
## SHOULD
- Retention controls SHOULD be automated and tested periodically.
## Exceptions
Exceptions require documented basis, duration, risk, and approval.
## Verification
Review retention policies, lifecycle configuration, deletion logs, backup handling, sampled deletion tests, and orphaned-copy scans.