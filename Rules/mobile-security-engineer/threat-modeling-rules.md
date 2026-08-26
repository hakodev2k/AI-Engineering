# Threat Modeling Rules

## Purpose
Prevent security design defects in mobile applications before implementation or release.

## Scope
Mobile clients, backend trust boundaries exposed to clients, local storage, device capabilities, third-party SDKs, and release architecture.

## MUST
- Maintain a threat model for security-sensitive features that identifies assets, actors, trust boundaries, entry points, abuse cases, and mitigations.
- Reassess threats when authentication, authorization, data flows, cryptography, platform permissions, or external integrations change.
- Treat the mobile client and device as potentially attacker-controlled.
- Trace high-impact threats to implemented controls and verification evidence.

## MUST NOT
- Treat code obfuscation, hidden endpoints, or client-side checks as trust boundaries.
- Approve a security-sensitive architecture solely from a happy-path data-flow diagram.

## SHOULD
- Prioritize threats using impact, exploitability, exposure, and detectability rather than severity labels alone.
- Record accepted residual risks and owners.

## Exceptions
Exceptions require documented context, threat impact, compensating controls, verification evidence, expiry or review point, and approval from the accountable security owner.

## Verification
Review threat models against architecture and data-flow changes; confirm mitigations through design review, tests, configuration inspection, and targeted security assessment.