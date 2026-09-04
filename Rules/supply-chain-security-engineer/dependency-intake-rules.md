# Dependency Intake Rules

## Purpose
Control how new third-party dependencies enter a codebase so security, maintenance, provenance, and operational risk are evaluated before adoption.

## Scope
Applies to libraries, SDKs, plugins, build tools, package-manager dependencies, base images, binaries, and externally maintained modules.

## MUST
- New dependencies MUST have a documented functional need that cannot be satisfied reasonably by existing approved components.
- Security posture, maintenance activity, provenance, licensing, release history, and transitive dependency impact MUST be reviewed before adoption for production use.
- Dependency source MUST resolve to an approved registry, repository, or vendor distribution channel.
- High-impact dependencies MUST have an identified replacement or containment strategy when feasible.
- Intake decisions for critical components MUST record reviewer and date.

## MUST NOT
- Dependencies MUST NOT be added solely to save trivial implementation effort when they materially increase attack surface or maintenance burden.
- Abandoned, typosquatted, suspiciously renamed, or unverifiable packages MUST NOT be introduced without explicit security approval.

## SHOULD
- Prefer mature components with transparent governance, predictable releases, and verifiable source history.
- Prefer smaller dependency surfaces when equivalent functionality exists.

## Exceptions
Emergency intake requires documented justification, bounded scope, compensating controls, follow-up review date, and accountable approval.

## Verification
Review pull-request diffs, manifests, lockfiles, package metadata, registry origin, maintenance history, vulnerability scans, and recorded approval evidence.