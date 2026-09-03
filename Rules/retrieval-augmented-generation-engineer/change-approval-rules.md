# Change and Approval Rules

## Purpose
Control high-impact RAG changes and distinguish analysis or preparation from execution in production environments.

## Scope
Applies to production deployments, index rebuilds, destructive corpus operations, model/provider switches, prompt/policy changes, authorization changes, secret rotation, retention changes, and breaking integration contracts.

## MUST
- Analysis, recommendation, and preparation MUST remain distinguishable from production execution.
- Production deployment or configuration changes MUST require the authorization defined by the project's change process.
- Destructive index deletion, source deletion, irreversible migration, breaking contract changes, high-risk access changes, secret rotation, or weakening of security controls MUST require explicit human approval before execution.
- High-impact changes MUST include rollback or recovery strategy, validation criteria, and expected blast radius.
- Changes to embedding models, chunking, ranking, authorization, or grounding policy MUST include relevant regression evidence before promotion.
- Production requests MUST identify the intended environment and target explicitly.
- Emergency changes MUST be documented and reviewed after stabilization.

## MUST NOT
- An AI agent MUST NOT infer approval from prior unrelated messages, urgency, or technical capability.
- Force push, history rewrite, destructive infrastructure action, or irreversible production data change MUST NOT be executed without explicit human approval.
- Controls MUST NOT be disabled merely to unblock a deployment or evaluation.
- A breaking public or client contract MUST NOT be introduced silently.

## SHOULD
- Prefer reversible, staged, canary, or side-by-side changes for high-risk retrieval infrastructure.
- Separate data-plane validation from control-plane rollout where practical.
- Record decision evidence for cost, quality, security, and operational trade-offs.

## Exceptions
Emergency exceptions require the minimum necessary scope, documented reason, accountable human authorization, compensating controls, and a follow-up review.

## Approval Requirements
- Analyze, recommend, and prepare may proceed autonomously within granted authorization.
- Execute actions affecting production, destructive data, credentials, access policy, public contracts, or security posture MUST require explicit human approval.

## Verification
Inspect change records, approvals, diffs, evaluation reports, rollback plans, environment targeting, deployment logs, and post-change metrics. Verify that no high-risk action executed without the required approval evidence.