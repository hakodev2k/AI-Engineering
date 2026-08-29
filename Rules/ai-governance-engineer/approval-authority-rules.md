# Approval and Authority Rules

## Purpose
Prevent AI systems and AI-assisted agents from exceeding delegated authority, especially for high-impact, irreversible, security-sensitive, or production actions.

## Scope
Applies to governance approvals, production deployment, destructive actions, access changes, model or provider migrations, high-risk exceptions, and AI-agent execution authority.

## MUST
- Governance processes MUST distinguish analyze, recommend, prepare, approve, and execute permissions.
- High-risk actions MUST identify the human role authorized to approve execution before automation is enabled.
- Production deployment of high-risk AI, destructive data actions, secret rotation, infrastructure destruction, security-control weakening, breaking public contracts, and high-risk access changes MUST require explicit human approval.
- Approval records MUST identify the action, scope, evidence reviewed, decision, approver, and time.
- AI agents MUST enforce execution boundaries outside natural-language instructions when actions can materially affect production, data, security, finances, users, or external commitments.
- Delegated authority MUST be least-privilege, scoped, revocable, and reviewed after role or system changes.

## MUST NOT
- MUST NOT infer approval from silence, historical approval, task assignment, or model confidence.
- MUST NOT let the same automated component generate and self-approve a high-risk exception.
- MUST NOT use broad standing credentials where per-action or narrowly scoped authorization is feasible.
- MUST NOT execute an irreversible action when the instruction authorizes only analysis, recommendation, or preparation.

## SHOULD
- Approval workflows SHOULD present relevant risk evidence and reversibility before the decision.
- High-risk approvals SHOULD use separation of duties when feasible.
- Repeated approvals SHOULD be converted into explicit bounded policy only after risk review.

## Exceptions
Emergency authority MUST be pre-defined or explicitly granted by an authorized human, with scope, duration, reason, and retrospective review. An emergency does not authorize unrelated actions.

## Verification
Inspect role permissions, agent tool scopes, workflow definitions, approval logs, deployment controls, privileged-access records, and sampled high-risk actions. Confirm execution cannot occur through the normal path without the required approval.