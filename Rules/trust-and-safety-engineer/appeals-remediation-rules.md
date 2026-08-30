# Appeals and Remediation Rules

## Purpose
Provide a reliable path to correct enforcement errors and restore affected users or content when decisions are reversed.

## Scope
Applies to appeals intake, secondary review, reversal, remediation, restoration, and feedback loops.

## MUST
- Eligible high-impact enforcement actions MUST have a documented appeal or equivalent review path unless prohibited by law or credible safety risk.
- Appeal reviewers MUST have access to the original evidence, policy version, reason code, and decision history.
- Reversed decisions MUST trigger restoration or remediation of affected access, content, reputation signals, or restrictions where technically possible.
- Appeal outcomes MUST be tracked by policy area, detector, reviewer path, and enforcement type to identify systematic errors.
- Repeated reversal patterns MUST feed back into detector thresholds, policy guidance, reviewer training, or product controls.
- Appeals involving new evidence MUST preserve the distinction between original-decision correctness and later changed circumstances.

## MUST NOT
- MUST NOT route appeals back to the same decision process without meaningful independent reconsideration when independence is required.
- MUST NOT leave reversible restrictions active after an approved reversal without documented technical or legal reason.
- MUST NOT suppress reversal metrics because they negatively affect performance reporting.

## SHOULD
- Appeals SHOULD be prioritized by user impact and irreversibility.
- Remediation SHOULD include downstream systems that consumed the original enforcement state.
- Appeal explanations SHOULD be clear enough to communicate the basis of the outcome without exposing sensitive detection methods.

## Exceptions
Appeal access MAY be limited for spam, automated abuse, or safety-sensitive cases when disclosure would materially enable evasion. The limitation MUST be policy-approved and periodically reviewed.

## Verification
Inspect appeal eligibility rules, queue routing, reviewer independence, reversal SLAs, restoration jobs, downstream state reconciliation, and reversal-rate analysis. Sample reversed cases to verify remediation completed end to end.