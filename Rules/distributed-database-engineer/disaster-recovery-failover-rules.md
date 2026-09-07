# Disaster Recovery and Failover Rules

## Purpose
Control data correctness and service continuity during large-scale failures.

## Scope
Regional failover, cluster failover, disaster declaration, failback, and continuity operations.

## MUST
- Failover architecture MUST define trigger conditions, authority, data-loss exposure, DNS/routing behavior, and failback.
- Automated failover MUST include safeguards against split brain.
- Manual production failover MUST require authorized human approval unless a pre-approved automated policy governs it.
- Failback MUST verify replication convergence and write authority before traffic restoration.

## MUST NOT
- MUST NOT perform untested emergency topology changes as routine recovery procedure.
- MUST NOT promote a stale replica without quantifying potential data loss.

## SHOULD
- Disaster exercises SHOULD simulate dependency and control-plane failures, not only database-node loss.

## Exceptions
Emergency deviations require incident-command authorization and contemporaneous evidence capture.

## Verification
Use game days, runbook exercises, replication checks, RTO/RPO evidence, and post-drill review.