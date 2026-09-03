# Theorem Proving Rules

## Purpose
Ensure machine-checked proofs support clearly stated claims and remain maintainable as specifications evolve.

## Scope
Applies to interactive theorem proving, automated theorem proving, SMT-backed proofs, proof assistants, and proof-producing verification.

## MUST
- State theorem assumptions and conclusions explicitly.
- Keep trusted axioms and admitted obligations visible and minimized.
- Distinguish proved lemmas from conjectures, automation hints, and unverified external facts.
- Review changes to foundational lemmas for downstream proof impact.
- Preserve proof scripts or artifacts sufficient for deterministic replay where the toolchain supports it.

## MUST NOT
- Introduce unsound axioms or unchecked admissions to obtain a passing proof without explicit approval.
- Claim implementation correctness from a theorem whose premises are not established for the implementation.
- Hide proof failures behind disabled checks or broad trusted code.

## SHOULD
- Build reusable lemmas around stable domain concepts.
- Prefer proof structure that makes assumptions and induction boundaries reviewable.

## Exceptions
Temporary admissions require explicit tracking, bounded scope, risk statement, and prohibition on using affected results as completed assurance claims.

## Verification
Replay proofs from a clean environment, inspect trusted bases, theorem dependencies, admitted goals, solver logs, and review the correspondence between theorem premises and system assumptions.