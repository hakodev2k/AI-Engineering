# Change Risk and Approval Rules

## Purpose
Match review, evidence, and human authority to the blast radius and reversibility of API reliability changes.

## Scope
Covers production configuration, routing, quotas, data changes, dependency migrations, security controls, and public contracts.

## MUST
- Material changes MUST be classified by blast radius, reversibility, user impact, and failure detectability before execution.
- Destructive data operations, irreversible migrations, production security weakening, breaking public contracts, infrastructure destruction, and high-risk access changes MUST require explicit human approval.
- Proposed changes MUST identify verification signals and rollback or containment steps.
- Emergency changes MUST remain auditable and receive retrospective review.
- Agents and automation MUST distinguish analysis, recommendation, preparation, and execution authority.

## MUST NOT
- MUST NOT force push or rewrite shared Git history as part of routine reliability work.
- MUST NOT infer execution authority from permission to analyze or prepare a change.
- MUST NOT bypass required approvals because a change appears technically simple.

## SHOULD
- Reversible, staged changes SHOULD be preferred over big-bang changes.
- Peer review SHOULD focus on failure modes and operational evidence, not only syntax.

## Exceptions
Only an established emergency authority process may shorten normal review; required safety boundaries and auditability remain.

## Verification
Inspect change records, approvals, diffs, deployment logs, audit trails, rollback evidence, and post-change telemetry.