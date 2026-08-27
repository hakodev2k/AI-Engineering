# Production Safety

## Purpose
Control high-impact firmware actions and preserve recoverability.

## Scope
Production releases, device configuration, irreversible operations, fleet actions, and security state.

## MUST
- Production firmware deployment MUST require human approval after release evidence is reviewed.
- Irreversible fuse, lock-bit, credential, calibration, or persistent-schema operations MUST require explicit approval and validated procedures.
- Rollout plans MUST define halt criteria, rollback/recovery actions, and ownership.
- Changes affecting safety, security boundaries, bootability, or fleet recoverability MUST receive specialist review.
- Analyze, recommend, prepare, and execute authority MUST be distinguished; an AI agent MUST NOT silently escalate from preparation to execution.

## MUST NOT
- Production safeguards MUST NOT be disabled merely to unblock a release.
- Destructive device operations MUST NOT run against production targets by default.
- A known unrecoverable failure mode MUST NOT be accepted without explicit risk ownership.

## SHOULD
- Releases SHOULD use staged cohorts and health observation where fleet infrastructure supports them.

## Exceptions
High-risk exceptions require named human approval, evidence, risk, blast radius, and recovery limitations.

## Verification
Inspect approvals, release artifacts, rollout configuration, recovery drills, audit records, and production-equivalent dry runs.