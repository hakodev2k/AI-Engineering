# Release Approval Rules

## Purpose
Ensure production releases cross supply-chain trust boundaries only after required security evidence and accountable authorization are present.

## Scope
Applies to release candidates, package publishing, image promotion, artifact signing, deployment handoff, and externally distributed software.

## MUST
- Protected releases MUST require evidence that required provenance, signatures, vulnerability checks, dependency policy, and artifact identity checks passed.
- Human approval MUST be required before executing a release when organizational policy designates the action as high risk or irreversible.
- Release approval MUST reference the exact artifact digest or immutable version being approved.
- Approval records MUST identify the approver, decision time, evidence reviewed, and any active exceptions.
- If required evidence changes after approval, the affected approval MUST be re-evaluated.

## MUST NOT
- Approval of source code MUST NOT automatically imply approval of a different built artifact.
- Release operators MUST NOT substitute an unreviewed artifact after security validation.
- Failed supply-chain controls MUST NOT be waived informally in chat, comments, or verbal instructions alone.

## SHOULD
- High-risk releases SHOULD separate artifact production from final promotion authority.
- Release evidence SHOULD be generated automatically and presented consistently to reviewers.

## Exceptions
Emergency release exceptions require defined incident or business authority, documented risk, compensating controls, exact artifact scope, and follow-up review.

## Verification
Inspect release records, artifact digests, CI evidence, approval logs, exception records, signing/provenance verification, and promotion audit trails.