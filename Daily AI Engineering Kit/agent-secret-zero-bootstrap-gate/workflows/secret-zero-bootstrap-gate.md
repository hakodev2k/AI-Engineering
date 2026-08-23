# Secret-Zero Bootstrap Gate Workflow

## Trigger
A service, CI job, agent, or deployment needs a first credential; authentication code/config changes; or static credential material is discovered.

## Entry conditions and inputs
Repository is readable; target workload/environment/resource are known; production secret values are not required. Inputs: task/incident, deployment configuration, expected identity and permissions, tests, sanitized logs.

## Flow
```text
Trigger → Explore → Scan → Classify → Plan → Approval? → Implement → Test → Independent Verify → Complete
```

## Stages
1. **Explore — Identity Explorer.** Trace the actual bootstrap and authorization path. Artifact: evidence/findings.
2. **Scan — deterministic script.** Run `scripts/secret_zero_gate.py`. Checkpoint: no finding may be ignored.
3. **Classify — Identity Explorer.** Separate active credentials, examples, obsolete material, and false positives.
4. **Plan — implementation owner.** Choose the smallest supported secretless mechanism and least-privilege resource access. Record rollback.
5. **Approval checkpoint.** Stop for human approval before production identity binding/trust/IAM changes, secret rotation/deletion, or security-policy relaxation.
6. **Implement.** Change only the evidenced credential path. Do not introduce a production static-secret fallback.
7. **Test.** Run package tests, repository tests, positive authentication, negative unauthorized-identity test, and renewal/failure behavior where available.
8. **Verify — Identity Verifier.** Independently inspect evidence and diff and return `verified` or `blocked`.
9. **Complete.** Record remaining risk and cleanup actions. Cleanup that deletes/rotates production credentials remains separately approval-controlled.

## Retry and recovery
Transient repository/tool/identity endpoint failure: preserve error evidence and retry at most 2 times with bounded backoff. Validation/auth failure: one fix-retest attempt only when a concrete hypothesis changed. Permission failure, missing approval, repeated authentication failure, or unknown active credential ownership: stop and escalate. Never retry by adding permissions or disabling validation.

## Produced artifacts
Scanner JSON result, investigation finding, diff, test evidence, approval record if needed, verifier result.

## Definition of Done
Bootstrap path is explicit; no unexplained static production bootstrap secret remains; intended identity authenticates and is authorized; unauthorized identity fails; package and relevant repository tests pass; no credential values leaked; verifier returns `verified`; required approval exists; unresolved risks are recorded.
