# Quarantine and Replay Workflow

## Trigger
The same logical message fails, a delivery reaches retry policy, or an operator requests review of a dead-letter/quarantined message.

## Entry conditions / inputs
Repository and consumer version are identifiable; message metadata and failure evidence are available; policy validates.

## Stages
1. **Preflight — Investigator:** validate policy and read-only access. Artifact: preflight evidence.
2. **Context — Investigator:** trace consumer, contract, side effects, tests, and logs. Checkpoint: facts separated from hypotheses.
3. **Classify — Investigator:** choose supported category. Transient failures may retry only while `attempt <= max_transient_retries`.
4. **Quarantine — Investigator:** generate envelope for immediate-quarantine or exhausted failures. Checkpoint: integrity verification passes.
5. **Correct — Implementation owner:** make the smallest evidenced code/config/data-contract correction in the host repository. Normal build/tests must pass. Schema/config/production changes require human approval.
6. **Independent verify — Verifier:** challenge classification and correction; verify envelope and replay prerequisites.
7. **Approval — Human:** required before production replay and any dangerous correction.
8. **Replay — Operator:** inspect exact destination/request and execute once.
9. **Outcome verify — Verifier:** prove expected downstream outcome and absence of duplicate side effect.

## Retry rules
Transient message processing: maximum `max_transient_retries` from policy. Deterministic script/tool invocation may be retried at most 2 times only for transient tool I/O failure, preserving stderr each time. Build/test failure may return once to correction; a second failure stops. Replay has zero automatic retries.

## Failure paths
Validation/business/deserialization: quarantine. Unknown contract: quarantine and escalate. Permission/environment/tool failure: stop without changing message classification. Integrity mismatch: block replay. Failed replay: retain quarantine/evidence and reopen investigation.

## Approval points
Production replay; destructive SQL/data deletion; queue purge; broker/infrastructure/secret/security changes; breaking contracts; irreversible migrations.

## Definition of Done
Policy valid; evidence captured; retry bounded; envelope verified; root cause/correction disposition recorded; tests relevant to correction pass; independent verification complete; required approval exists; if replayed, outcome and duplicate check are evidenced; no blocking failure remains.
