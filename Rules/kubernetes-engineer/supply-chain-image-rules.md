# Supply Chain and Image Rules
## Purpose
Reduce risk from container images, registries, dependencies, and deployment artifacts.
## Scope
Image build, registry, provenance, scanning, signing, admission, and runtime references.
## MUST
- Deploy production images from approved registries using immutable references or equivalent provenance controls.
- Scan images for known vulnerabilities and define remediation policy by severity and exploitability.
- Restrict image build and publication permissions.
- Preserve traceability from deployed image to source revision and build process.
## MUST NOT
- Deploy untrusted images merely to accelerate troubleshooting.
- Treat a successful vulnerability scan as proof that an image is safe.
## SHOULD
- Use signing, attestations, SBOMs, and admission verification where platform maturity supports them.
## Exceptions
Emergency image use requires documented source, risk, approval, verification, and replacement plan.
## Verification
Inspect image references, registry policy, scan reports, provenance, build permissions, and admission results.