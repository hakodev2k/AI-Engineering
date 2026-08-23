# Change Review Rules

## Purpose
Require disciplined review of prompt changes that can alter production behavior.

## Scope
Prompt text, templates, examples, tool instructions, retrieval instructions, schemas, and runtime prompt configuration.

## MUST
- Material prompt changes MUST receive review proportional to user impact and operational risk.
- Reviewers MUST inspect behavioral intent, safety implications, compatibility, evaluation evidence, and rollback readiness.
- High-risk changes MUST have an explicit owner and approval record before production release.
- Changes that modify public behavior or machine-consumed contracts MUST identify downstream dependencies.

## MUST NOT
- MUST NOT approve changes solely because the wording appears clearer.
- MUST NOT bypass review for urgent convenience when the change increases authority or weakens safeguards.
- MUST NOT merge unrelated behavioral changes into one opaque revision when they can be evaluated separately.

## SHOULD
- Reviews SHOULD compare before/after evaluations and inspect newly introduced failure modes.
- Small wording-only changes SHOULD still run targeted regression tests when they affect production prompts.

## Exceptions
Emergency changes may use expedited approval if risk, evidence, rollback, and post-change review are documented.

## Verification
Inspect diffs, approvals, linked evaluation evidence, dependency notes, and release records.