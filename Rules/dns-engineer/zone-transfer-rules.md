# Zone Transfer Rules

## Purpose
Secure and validate zone replication.

## Scope
AXFR, IXFR, primary-secondary synchronization, and transfer authentication.

## MUST
- Zone transfers MUST be restricted to explicitly authorized peers.
- Transfers across untrusted networks MUST use authenticated and integrity-protected mechanisms where supported.
- Secondary freshness and serial convergence MUST be monitored.

## MUST NOT
- MUST NOT expose unrestricted transfer of non-public operational zone data.
- MUST NOT treat a configured secondary as healthy without verifying current zone state.

## SHOULD
- Transfer topology SHOULD avoid a single replication source where availability requirements demand independence.

## Exceptions
Public-transfer requirements must be explicit and reviewed for information disclosure risk.

## Verification
Attempt authorized and unauthorized transfers, compare SOA serials, inspect transfer logs, and test primary failure.