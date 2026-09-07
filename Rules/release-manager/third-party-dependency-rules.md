# Third-Party Dependency Rules

## Purpose
Control release risk introduced by vendors, external APIs, managed services, package ecosystems, and other dependencies outside the release team's direct authority.

## Scope
Applies to externally operated services, vendor changes, third-party packages, certificates, licenses, quotas, and integration prerequisites.

## MUST
- Material external dependencies MUST identify owner, required version or capability, availability assumptions, compatibility constraints, and failure impact.
- Release readiness MUST verify critical vendor prerequisites, credentials or certificate validity, quotas, and announced maintenance when relevant.
- Significant dependency upgrades MUST include compatibility, security, operational, and rollback evidence appropriate to risk.
- External failures that can block or degrade rollout MUST have defined detection and contingency behavior.
- Large or high-risk dependency migrations MUST receive required human approval before production execution.

## MUST NOT
- A vendor status page or marketing compatibility claim MUST NOT replace project-specific validation when failure impact is material.
- Unpinned or unexpectedly mutable third-party artifacts MUST NOT be promoted without integrity controls.
- Known external maintenance conflicts MUST NOT be ignored to preserve a planned date.

## SHOULD
- Critical integrations SHOULD be tested against realistic failure and timeout behavior.
- Dependency concentration and single-provider risk SHOULD be visible in release risk assessment.

## Exceptions
When direct validation is impossible, document the limitation, authoritative external evidence, residual risk, contingency plan, and approval.

## Verification
Review dependency inventory, versions, vendor notices, contract tests, security/dependency scans, certificate/quota checks, fallback plans, and approval records.