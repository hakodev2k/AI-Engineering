# Dependency and Supply Chain Rules
## Purpose
Control third-party software, firmware, models, and tooling that can affect robot behavior.
## Scope
Libraries, OS packages, firmware, containers, ML models, build tools, and vendor components.
## MUST
- Pin or otherwise control production dependency versions and preserve provenance for deployed artifacts.
- Review consequential upgrades for API, timing, numerical, security, licensing, and hardware-compatibility impact.
- Scan supported dependencies for known vulnerabilities and define remediation priorities by actual risk.
- Validate large dependency migrations in representative integration and hardware tests.
## MUST NOT
- Pull mutable or unverified production artifacts at runtime for safety- or control-relevant functions.
- Perform a large production dependency migration without review and rollback planning.
## SHOULD
- Minimize dependency surface in timing- and safety-critical components.
## Exceptions
Urgent dependency changes require explicit risk assessment, focused verification, approval, and follow-up regression coverage.
## Verification
Inspect lockfiles/manifests, provenance, SBOM where available, scan results, licenses, artifact hashes, and regression evidence.