# Code Review and Change Safety Rules

## Purpose
Apply Senior-level scrutiny to compiler changes with large semantic blast radius.

## Scope
Pull requests, refactoring, pass changes, target work, dependencies, generated files, and high-risk maintenance.

## MUST
- Reviews MUST identify affected compiler phases, invariants, supported targets, and user-visible contracts.
- Semantics or ABI changes MUST include authoritative rationale and targeted tests.
- Large refactors MUST separate mechanical movement from semantic change where practical.
- High-risk dependency migrations, history rewriting, force pushes, and irreversible repository operations MUST require explicit human approval.

## MUST NOT
- MUST NOT approve correctness-sensitive code based only on passing happy-path tests.
- MUST NOT merge unexplained generated-code diffs.
- MUST NOT weaken verifier, assertion, sanitizer, or security coverage merely to make CI pass.

## SHOULD
- Reviewers SHOULD request minimized IR/source examples for non-obvious transforms.
- Changes SHOULD be reversible and scoped to the smallest coherent behavior.

## Exceptions
Urgent fixes require documented risk, evidence, rollback plan, and authorized approval.

## Verification
Inspect diffs, test additions, target matrix, benchmark evidence where relevant, reviewer approvals, and CI artifacts.