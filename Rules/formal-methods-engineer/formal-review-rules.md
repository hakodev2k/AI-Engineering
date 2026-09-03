# Formal Review Rules

## Purpose
Ensure significant formal artifacts receive review focused on semantics, assumptions, proof scope, and engineering consequences rather than syntax alone.

## Scope
Applies to specifications, properties, proofs, refinement mappings, verification configurations, counterexamples, and assurance reports.

## MUST
- Require reviewers to inspect assumptions, excluded behaviors, property intent, and model-to-system correspondence.
- Require independent review for security-, safety-, or high-impact correctness claims.
- Record unresolved semantic questions and block completion claims when they materially affect correctness.
- Review changes to shared definitions for downstream proof and property impact.
- Require evidence supporting claims of completeness, soundness, or conformance.

## MUST NOT
- Approve a formal artifact solely because automated checks pass.
- Treat dense notation as a substitute for an understandable engineering argument.
- Allow the author to silently resolve material review objections by weakening the claim.

## SHOULD
- Use review checklists tailored to the formalism and risk level.
- Include domain or implementation experts when semantics cross disciplinary boundaries.

## Exceptions
Reduced review requires documented low-risk justification and must not apply to critical assurance claims without authorized approval.

## Verification
Inspect review records, resolved comments, proof/property diffs, independent reviewer evidence, and traceability between review findings and final artifacts.