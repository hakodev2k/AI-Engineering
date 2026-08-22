# Project Governance

This document explains how AI Engineering is maintained, how decisions are made, and what contributors can expect during review.

## Project scope

AI Engineering is a reusable knowledge and implementation repository for AI-assisted engineering roles, rules, skills, safety controls, workflows, and provider-scoped integrations. Contributions should remain modular, reviewable, evidence-oriented, and safe to adapt across repositories.

The project does not certify third-party services, guarantee production readiness, or replace an adopter's security, legal, compliance, architecture, or operational review.

## Stewardship

Repository maintainers are responsible for:

- defining project direction and collection boundaries;
- reviewing contributions for correctness, safety, maintainability, and fit;
- protecting credentials, private reports, and responsible-disclosure channels;
- managing releases, labels, automation, and repository settings;
- resolving conflicts between packages or project policies;
- enforcing the [Code of Conduct](CODE_OF_CONDUCT.md).

Maintainers may delegate review of a specialized change without transferring final stewardship of the repository.

## Decision model

Routine, reversible changes are accepted through normal pull-request review. Maintainers seek technical consensus when practical, but the designated maintainer makes the final decision when consensus cannot be reached.

The following changes require heightened review:

- new top-level collections or significant taxonomy changes;
- breaking changes to schemas, manifests, commands, or package contracts;
- new external side effects, provider permissions, or credential flows;
- security-boundary, approval, sandbox, or production-safety changes;
- dependency changes with material supply-chain or licensing impact;
- repository automation that can write, publish, deploy, or communicate externally.

Major proposals should begin with an issue that describes the problem, alternatives, compatibility impact, migration path, verification plan, and residual risk.

## Review principles

- Review the smallest coherent change possible.
- Separate observed evidence from assumptions and recommendations.
- Require deterministic checks for machine-enforceable claims.
- Prefer least privilege and deny-by-default behavior for external actions.
- Preserve backwards compatibility or document a migration path.
- Do not approve a change solely because its author or an AI system reports that it works.
- Record unresolved risks instead of hiding them behind broad assurances.

Authors should not be the sole approver of security-sensitive or high-impact changes.

## Security and conduct

Security vulnerabilities follow [SECURITY.md](SECURITY.md), not the public issue process. Participation in all project spaces is governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Documentation lifecycle

Documentation is maintained alongside the behavior or package it describes. Material user-facing changes should update the relevant guide and [CHANGELOG.md](CHANGELOG.md). Outdated or unverifiable content may be corrected, deprecated, or removed after compatibility and migration impact are considered.

## Changes to governance

Governance changes use the same pull-request process as other repository-wide policy changes and should explain their motivation and impact clearly.
