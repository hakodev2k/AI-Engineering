# Pipeline Incident Response

**Purpose:** restore trustworthy data service while limiting blast radius.

**Trigger:** missed SLA, failed job, corrupt output, runaway cost or consumer-impact alert.

**Procedure**
1. Classify severity by consumer impact, correctness, security/privacy and deadline.
2. Freeze unsafe writes if continued processing can worsen data.
3. Capture run IDs, partitions, code/config versions, source health and error evidence.
4. Parallelize source health, platform health, recent-change and data-quality investigation when independent.
5. Separate symptom, suspected cause and confirmed cause.
6. Choose safe recovery: retry transient failure, quarantine bad input, rollback change, replay range or fail over.
7. Verify restored freshness and reconciliation before declaring recovery.
8. Communicate affected datasets, time ranges, consumers and confidence.
9. Create failure-learning record for meaningful incidents.

**Retry:** bounded; no retry for deterministic schema/data defects without correction.

**Stop:** required production permission missing, destructive recovery needs approval, or root cause remains unsafe to bypass.
