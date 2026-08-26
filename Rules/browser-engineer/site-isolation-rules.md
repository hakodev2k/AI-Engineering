# Site Isolation Rules
## Purpose
Prevent cross-origin data exposure through incorrect process, frame, or browsing-context isolation.
## Scope
Frames, origins, site instances, process assignment, navigation, and cross-process proxies.
## MUST
- Process assignment MUST preserve defined origin and site isolation guarantees.
- Cross-origin state MUST cross boundaries only through validated, capability-limited messages.
- Navigation transitions MUST re-evaluate isolation requirements before committing content.
## MUST NOT
- MUST NOT co-locate mutually isolated content merely for performance convenience without approved architecture support.
- MUST NOT trust renderer-provided origin or frame identity without browser-side validation.
## SHOULD
- SHOULD keep security decisions in the more privileged process.
## Exceptions
Isolation exceptions require explicit threat modeling, security approval, and regression coverage.
## Verification
Use cross-origin security tests, navigation tests, process-model diagnostics, IPC validation tests, and adversarial cases.