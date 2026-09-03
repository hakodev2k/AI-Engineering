# Safety-Critical Assurance Rules

## Purpose
Ensure formal evidence used in safety-critical decisions is scoped, reviewable, and connected to the actual hazard controls.

## Scope
Applies when formal methods support hazard mitigation, safety cases, critical control logic, or high-consequence system claims.

## MUST
- Trace each safety-relevant formal claim to identified hazards, mitigations, and system requirements.
- State the assurance boundary, trusted toolchain, environmental assumptions, and unverified dependencies.
- Require independent review for proofs or models whose failure could contribute to catastrophic or severe outcomes.
- Revalidate affected claims after requirement, architecture, implementation, or toolchain changes.
- Preserve auditable evidence sufficient to reconstruct how the assurance conclusion was reached.

## MUST NOT
- Treat formal verification as evidence for hazards outside the modeled scope.
- Replace required system testing, operational controls, or independent assurance with a proof unless the governing process explicitly permits it.
- Execute safety-impacting production or certification changes without authorized human approval.

## SHOULD
- Use diverse evidence sources for the highest-risk claims.
- Keep assumptions conservative and operationally monitorable where possible.

## Exceptions
Departures from the approved assurance process require documented rationale, risk acceptance, and authority appropriate to the safety impact.

## Verification
Inspect hazard traceability, safety-case evidence, proof artifacts, independent-review records, change impact analysis, and tool qualification evidence where applicable.