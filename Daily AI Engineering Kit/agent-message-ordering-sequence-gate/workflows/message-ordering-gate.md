# Workflow: Message Ordering Sequence Gate

## Trigger
An order-sensitive asynchronous flow shows stale state, impossible transitions, duplicate side effects, sequence gaps, or inversion; or a change modifies partitioning, consumer concurrency, retries, or sequencing.

## Entry conditions
Repository access plus enough metadata to identify messages and their ordering scope. Production mutation is not required.

## Inputs
Task/incident, business invariant, repository revision, transport configuration, logs/test trace, and policy.

## Stages
1. **Context — Ordering Investigator:** map producer, sequence source, partition key, broker guarantees, consumer concurrency, retry/dead-letter paths, and state mutation. Output facts and evidence.
2. **Deterministic classification — Ordering Investigator:** run `scripts/message_order_gate.py`. Preserve result.
3. **Plan — implementation owner:** choose the smallest repair boundary and list acceptance cases.
4. **Approval checkpoint:** stop if plan includes production config, queue/message deletion, sequence rewrite, destructive data repair, or disabling checks.
5. **Execute — implementation owner:** add regression test, apply one bounded change, capture post-change evidence.
6. **Test — implementation owner:** run relevant host tests plus ordered/duplicate/reversed/gap/concurrency/retry cases.
7. **Independent verify — Verification Agent:** rerun evidence gate, tests, package verifier, and diff review.
8. **Complete:** record status and residual risks.

## Checkpoints
No implementation before ordering scope is known. No completion on invalid evidence. No dangerous action without approval. Implementer is not sole verifier.

## Retry rules
Transient tool/environment failure: maximum 2 retries, preserving stderr/output. Repair/test loop: maximum 2 implementation iterations. A repeated business-rule failure stops and escalates with all evidence.

## Failure paths
Missing sequence/partition evidence → `inconclusive`; instrument or collect better evidence. Deterministic regression → `blocked`; repair. Permission failure → stop without privilege escalation. Approval-required change → stop awaiting explicit approval.

## Outputs
Before/after evidence JSON, gate results, implementation diff, test output, verification status, and residual-risk notes.

## Definition of Done
Ordering scope is proven; original failure is reproduced or evidenced; smallest safe fix exists; duplicate semantics remain safe; relevant tests/build pass; post-change deterministic gate passes; independent verification is `verified`; required approvals exist; no blocking risk remains.
