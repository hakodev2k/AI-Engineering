# Dependency and Supply Chain Rules

## Purpose
Control API security risk introduced by libraries, frameworks, build systems, and third-party components.

## Scope
Runtime dependencies, SDKs, containers, packages, generated clients, and build artifacts.

## MUST
- Inventory security-relevant dependencies and scan supported artifacts for known vulnerabilities.
- Assess exploitability and exposure rather than relying only on severity labels.
- Define remediation timelines based on risk and available mitigations.
- Verify provenance and integrity of production artifacts through approved build processes.

## MUST NOT
- Ignore a vulnerable dependency merely because application code does not call an obvious vulnerable method without validating reachability.
- Disable dependency or integrity checks simply to unblock a release.

## SHOULD
- Minimize dependencies and pin/reproduce security-sensitive build inputs where practical.

## Exceptions
Deferred remediation requires documented exposure analysis, compensating controls, owner, deadline, and approval.

## Verification
Review SBOM/dependency reports, scanner findings, artifact provenance, lockfiles, and remediation evidence.