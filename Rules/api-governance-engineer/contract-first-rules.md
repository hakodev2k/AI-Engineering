# Contract-First Rules

## Purpose
Make API behavior reviewable before implementation choices become consumer dependencies.

## Scope
Applies to new APIs and material contract changes.

## MUST
- Material APIs MUST define a precise contract before production release.
- Requests, responses, errors, schemas, and compatibility expectations MUST be documented in the contract or linked normative documentation.
- Contract review MUST occur before irreversible consumer adoption.
- Generated artifacts MUST be reproducible from the authoritative contract when generation is used.
- Deployed behavior MUST match the approved contract.

## MUST NOT
- Implementation code MUST NOT be the only authoritative description of an externally consumed contract.
- Examples MUST NOT contradict normative schemas.
- Undocumented behavior MUST NOT be presented as a stable public guarantee.

## SHOULD
- Consumer feedback SHOULD be gathered before finalizing high-impact contracts.
- Contracts SHOULD be linted automatically for structural and governance requirements.

## Exceptions
Exceptions require rationale, affected consumers, risk, compensating controls, approval, and a convergence plan.

## Verification
Inspect API specifications, schema artifacts, contract tests, deployed behavior, review records, and CI lint results.