# Malicious Package Defense Rules

## Purpose
Reduce exposure to typosquatting, dependency confusion, maintainer compromise, malicious updates, and poisoned package ecosystems.

## Scope
Applies to public and private package managers, registries, dependency resolution, internal package namespaces, and package update workflows.

## MUST
- Package resolution MUST distinguish trusted internal namespaces from public sources where dependency confusion is possible.
- New or unexpectedly renamed packages MUST be reviewed for publisher identity, repository linkage, release history, and suspicious behavior before production adoption.
- Automated dependency update systems MUST preserve review gates for high-impact or executable dependencies.
- Security monitoring MUST investigate sudden ownership changes, unexplained maintainer turnover, anomalous releases, or install-time scripts in critical dependencies.
- Internal package names that could collide with public registries MUST be protected by registry configuration or namespace reservation.

## MUST NOT
- Package managers MUST NOT search untrusted public sources ahead of authoritative private sources for protected internal names.
- Newly published packages with suspicious provenance MUST NOT be approved solely because scanners find no known CVE.

## SHOULD
- Critical ecosystems SHOULD use allowlists or controlled mirrors when practical.
- Install scripts SHOULD be disabled or constrained where they are unnecessary.

## Exceptions
Exceptions require documented threat analysis, compensating controls, owner, expiry, and security approval.

## Verification
Test dependency resolution order, inspect registry configuration, package ownership metadata, update diffs, install scripts, and alerts for namespace or publisher anomalies.