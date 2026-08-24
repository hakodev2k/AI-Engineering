# AI Risk Assessment Rules

## Purpose
Establish evidence-based risk assessment for AI capabilities, deployments, and changes.

## Scope
Applies to model, agent, tool, data, prompt, policy, and deployment changes that can alter safety risk.

## MUST
- Define affected users, assets, failure modes, threat actors, exposure, severity, and likelihood before approving material changes.
- Record assumptions and distinguish demonstrated capability from hypothesized risk.
- Reassess risk when model capability, autonomy, permissions, data access, or deployment context changes materially.
- Assign an accountable owner and explicit disposition to high-severity risks.

## MUST NOT
- Treat absence of observed incidents as evidence of safety.
- Collapse qualitatively different harms into a single unexplained score.
- Accept high-severity residual risk without documented human approval.

## SHOULD
- Use scenario-based analysis and calibrated severity/likelihood scales.
- Prefer reversible mitigations and defense in depth for uncertain risks.

## Exceptions
Exceptions require documented context, evidence, alternatives considered, residual risk, verification plan, and approval proportional to impact.

## Verification
Review the risk register, evaluation evidence, change diff, approvals, and mitigation ownership. CI or release gates SHOULD verify required assessments exist for safety-significant changes.
