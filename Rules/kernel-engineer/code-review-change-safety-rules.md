# Code Review and Change Safety Rules

## Purpose
Ensure kernel changes receive risk-proportionate review and remain understandable, reversible, and evidence-based.

## Scope
Patches, pull requests, subsystem review, refactoring, backports, and high-risk changes.

## MUST
- Every change MUST state the problem, intended behavior, affected invariants, and verification performed.
- High-risk changes MUST identify rollback or recovery strategy before production adoption.
- Review MUST inspect error paths, concurrency, lifetime, compatibility, and security implications relevant to the change.
- Refactoring mixed with behavior changes MUST be separated when separation materially improves reviewability.
- Reviewer concerns about correctness MUST be resolved with evidence or explicit maintainer decision.

## MUST NOT
- MUST NOT approve code solely because tests pass when the design violates known invariants.
- MUST NOT hide generated, mechanical, or broad formatting changes inside behavior patches when avoidable.
- MUST NOT rewrite shared history or force-push protected branches without explicit authorization.
- MUST NOT execute production-impacting changes merely because analysis or preparation was authorized.

## SHOULD
- Patches SHOULD be minimal enough to reason about independently.
- Commit messages SHOULD preserve rationale and failure context.
- Risky changes SHOULD receive subsystem-expert review.

## Exceptions
Exceptions require urgency/context, residual risk, compensating verification, and authorized reviewer acceptance.

## Verification
Inspect diffs, commit history, review approvals, CI evidence, risk notes, and correspondence between stated behavior and actual changed paths.