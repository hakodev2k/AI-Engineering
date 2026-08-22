# Code Review Rules

## Purpose
Use review to protect correctness, architecture, security, maintainability, and operational behavior rather than only style.

## Scope
Pull requests and equivalent reviews for Vue frontend changes.

## MUST
- Review MUST assess behavior, state ownership, reactivity, security, accessibility, performance risk, tests, and compatibility relevant to the change.
- High-risk changes MUST include evidence appropriate to their claim: tests, profiles, screenshots, network traces, or design/contract decisions.
- Reviewers MUST identify assumptions they cannot verify and request evidence when consequences are material.
- Shared component/store/API contract changes MUST include affected-consumer analysis.
- Security-control weakening, production-risk exceptions, and breaking public contracts MUST receive explicit authorized approval.

## MUST NOT
- Approval MUST NOT be based solely on a green CI status when material design or behavioral risk remains unreviewed.
- Large generated diffs MUST NOT hide meaningful hand-written changes from review.
- Review comments MUST NOT demand personal style preferences that conflict with established project conventions without technical rationale.

## SHOULD
- Keep changes reviewable and separate mechanical refactors from behavioral changes when practical.
- Prefer evidence-linked review comments for defects and risks.

## Exceptions
Emergency fixes may use expedited review only with documented risk, post-release validation, and follow-up review where required.

## Verification
Inspect PR evidence, approvals, unresolved discussions, CI, contract impact, and exception records before merge.