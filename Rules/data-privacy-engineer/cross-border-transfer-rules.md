# Cross-Border Data Transfer Rules

## Purpose
Ensure international or regional data transfers are deliberate, documented, and technically controlled.

## Scope
Applies to storage regions, backups, support access, subprocessors, replication, analytics, telemetry, model providers, and remote administration.

## MUST
- Systems MUST identify where personal data is stored, processed, replicated, and accessed.
- Region-routing and residency requirements MUST be represented in deployable configuration or enforceable policy where practical.
- New cross-border flows MUST receive required legal or privacy approval before production use.
- Failover and disaster-recovery designs MUST account for transfer restrictions, not only primary-region placement.
- Vendor region settings MUST be verified rather than assumed from marketing or account defaults.

## MUST NOT
- Personal data MUST NOT be routed through an unapproved region for convenience, debugging, or temporary capacity relief.
- Residency claims MUST NOT ignore logs, backups, support tooling, or subprocessors.
- Regional controls MUST NOT depend solely on operator convention when technical enforcement is available.

## SHOULD
- Data locality SHOULD be enforced as close to the processing boundary as practical.
- Architecture SHOULD minimize unnecessary regional duplication.

## Exceptions
Exceptions require documented transfer basis, scope, duration, safeguards, residual risk, and accountable approval.

## Verification
Inspect cloud regions, network routes, backup locations, vendor settings, support-access paths, processor lists, and deployment tests for residency enforcement.