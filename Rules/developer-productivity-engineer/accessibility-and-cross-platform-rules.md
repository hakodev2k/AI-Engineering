# Accessibility and Cross-Platform Rules
## Purpose
Ensure developer tools remain usable across supported environments and access needs.
## Scope
Portals, CLIs, IDE integrations, local tooling, operating systems, shells, and assistive workflows.
## MUST
- Supported platforms MUST be explicitly defined and validated in representative environments.
- Web interfaces MUST preserve keyboard operation, semantic structure, readable status, and accessible error feedback.
- CLI workflows MUST not depend solely on color or cursor control to communicate critical state.
- Platform-specific behavior MUST have tests or documented constraints.
## MUST NOT
- MUST NOT introduce mandatory tooling that excludes a supported platform without approved migration decision.
- MUST NOT encode critical information only visually when a textual equivalent is feasible.
## SHOULD
- Tools SHOULD degrade gracefully in terminals, remote environments, and reduced-capability contexts.
## Exceptions
Platform exclusions require usage evidence, impact analysis, alternative path, and approval.
## Verification
Run platform matrix checks, keyboard/accessibility review, terminal compatibility tests, and documented fallback validation.