# Maintenance and Housekeeping Rules

## Purpose
Prevent reliability degradation caused by neglected routine database maintenance.

## Scope
Statistics, vacuuming or cleanup, index maintenance, retention, partition lifecycle, and scheduled housekeeping.

## MUST
- Define maintenance tasks from engine behavior and workload evidence.
- Monitor maintenance duration, backlog, failures, and impact on production traffic.
- Validate retention and cleanup jobs against legal, recovery, and business requirements.
- Schedule disruptive work within approved risk windows with rollback or stop criteria.

## MUST NOT
- Do not run blanket maintenance solely by calendar when workload evidence contradicts it.
- Do not delete historical data without approved retention policy and recovery consideration.

## SHOULD
- Automate routine maintenance with workload-aware throttling and observability.

## Exceptions
Deferred maintenance requires documented risk, owner, and next review date.

## Verification
Inspect maintenance schedules, execution history, backlog metrics, storage trends, and change approvals.