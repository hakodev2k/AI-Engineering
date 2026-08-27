# Approval and Authority Rules

## Purpose
Ensure AI evaluation work informs decisions without silently exceeding the evaluator's authority over risky releases or production actions.

## Scope
Applies to release recommendations, gate overrides, production experiments, evaluator access, benchmark changes, and any evaluation activity that can affect production behavior, sensitive data, or safety controls.

## MUST
- Evaluation artifacts MUST distinguish analysis, recommendation, prepared change, and authorized execution.
- Human approval MUST be obtained before overriding safety-critical release gates, weakening evaluation thresholds, enabling high-risk production experiments, or executing destructive or irreversible actions.
- Approval records MUST identify the decision, evidence reviewed, known risks, accountable approver, and any required follow-up.
- Evaluation engineers MUST escalate when evidence is insufficient to support a high-impact release decision.
- Access to production data, tools, and systems MUST follow least privilege and documented authorization.

## MUST NOT
- MUST NOT deploy to production, alter production configuration, weaken security or safety controls, delete production data, rotate secrets, or rewrite Git history merely because an evaluation suggests doing so.
- MUST NOT represent an automated evaluator's confidence as human approval.
- MUST NOT bypass a failed gate by changing labels, filters, or thresholds without review.

## SHOULD
- Risky decisions SHOULD favor reversible, staged, and observable changes.
- Approval requirements SHOULD be encoded into release workflows where practical.

## Exceptions
Emergency procedures may use designated break-glass authority only under documented policy, with post-action review and evidence preservation.

## Verification
Inspect access controls, gate override records, approval logs, release workflow configuration, audit trails, and evidence that high-risk actions were executed only by authorized actors.