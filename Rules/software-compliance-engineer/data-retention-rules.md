# Data Retention Rules

## Purpose
Ensure software systems retain and dispose of data according to defined obligations rather than convenience or default storage behavior.

## Scope
Applies to primary records, logs, backups, caches, exports, analytics copies, and derived data.

## MUST
- Retention periods MUST be defined by data category and justified by legal, contractual, operational, or evidentiary need.
- Deletion behavior MUST cover material replicas and secondary stores within documented technical limits.
- Legal holds or equivalent preservation requirements MUST override ordinary deletion through controlled procedures.
- Retention changes MUST be reviewed for downstream systems and historical data.

## MUST NOT
- MUST NOT retain regulated or sensitive data indefinitely without documented basis.
- MUST NOT claim deletion completeness without accounting for backups and asynchronous replicas.

## SHOULD
- Automate retention enforcement and report failures or backlog.

## Exceptions
Exceptions require documented basis, affected data, duration, safeguards, and approval.

## Verification
Inspect retention configuration, deletion jobs, backup policies, legal-hold controls, metrics, and sampled deletion evidence.