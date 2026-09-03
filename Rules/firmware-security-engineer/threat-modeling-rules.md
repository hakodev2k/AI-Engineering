# Threat Modeling Rules

## Purpose
Ensure firmware security decisions are driven by explicit assets, trust boundaries, attacker capabilities, and failure impact.

## Scope
Applies to boot chains, update paths, device interfaces, debug features, persistent storage, cryptographic services, and hardware-software boundaries.

## MUST
- Identify security-sensitive assets, entry points, trust boundaries, and attacker capabilities before approving material firmware architecture changes.
- Trace high-impact threats to concrete mitigations and verification evidence.
- Revisit the threat model when interfaces, privilege boundaries, update mechanisms, or cryptographic assumptions change.
- Distinguish remote, adjacent, local, and physical attacker models where controls differ.

## MUST NOT
- Treat obscurity or undocumented behavior as a security boundary.
- Assume physical access is impossible unless the product threat model explicitly establishes that constraint.
- Close a threat solely because exploitation appears difficult without evidence supporting the residual risk.

## SHOULD
- Rank threats by exploitability, impact, exposure, and recoverability.
- Keep mitigations close to the boundary they protect and prefer fail-safe designs.

## Exceptions
Any accepted threat requires documented rationale, affected assets, residual risk, compensating controls, verification, and accountable approval.

## Verification
Review threat-model artifacts against firmware architecture, interface inventory, security tests, abuse cases, and design changes before release.