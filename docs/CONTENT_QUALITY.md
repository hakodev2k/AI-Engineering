# Content Quality Standard

This standard defines when a reusable asset is ready to be discovered, copied, adapted, and reviewed. It applies to repository documentation, Rules, Skills, Roles, engineering kits, guards, and MCP/API connectors.

Passing the repository audit proves structural consistency. It does not certify technical correctness, production safety, provider behavior, or fitness for a particular organization.

## Quality principles

- **Focused:** one asset solves one recognizable problem with a bounded responsibility.
- **Standalone:** the supported copy unit carries or explicitly declares everything required to understand and validate it.
- **Actionable:** instructions identify inputs, decisions, expected outputs, verification, and stop conditions.
- **Evidence-oriented:** claims distinguish observed evidence from assumptions and recommendations.
- **Safe to evaluate:** examples are synthetic and initial verification avoids production, destructive, privileged, or externally visible effects.
- **Discoverable:** names, summaries, indexes, and comparison notes help a developer select the asset without opening every neighboring package.
- **Maintainable:** dependencies, time-sensitive claims, compatibility boundaries, ownership, and deprecation paths are explicit.

## Readiness by content type

| Content type | Minimum ready contract |
| --- | --- |
| Repository guide | Audience, purpose, authoritative scope, navigation, current commands, and links to package-local details. |
| Rule | Purpose, scope, `MUST`, `MUST NOT`, `SHOULD`, exceptions, and verification. Requirements must not imply new authority. |
| Skill | Intended use, inputs, bounded procedure, decision points, verification, expected output, and stop/escalation conditions. |
| Role | Mission, responsibilities, non-responsibilities, required context, operating workflow, approval boundaries, outputs, handoff, and completion criteria. |
| Kit or guard | Problem/threat model, runtime classification, complete copy boundary, configuration, inputs/outputs, lifecycle placement, side effects, failure behavior, verification, and limitations. |
| MCP/API connector | Provider and transport, capabilities, authentication, least-privilege permissions, local runtime/dependencies, environment variables, approval model, rate limits, errors, tests, examples, and revocation path. |

Executable assets additionally need an exact entrypoint, working directory, dependency declaration, harmless example, exit-code meaning, generated-artifact location, and package-local test or self-check. A reference-only asset must state that it is not enforced until the adopter implements its host integration.

## Review scorecard

Reviewers should evaluate each applicable dimension. A material failure in any required dimension means the asset needs revision, even when automated checks pass.

| Dimension | Review questions |
| --- | --- |
| Scope | Is the problem specific? Are responsibilities and non-goals bounded? |
| Standalone use | Does the documented copy unit contain every required local file and dependency instruction? |
| Correctness | Do commands, schemas, examples, provider claims, and expected outputs agree with the actual files? |
| Safety | Are secrets, permissions, untrusted input, destructive actions, external side effects, and approvals handled explicitly? |
| Verification | Can an adopter distinguish success, failure, unknown, and partial completion using reproducible evidence? |
| Discoverability | Does the nearest index explain what the asset is for and how it differs from similar choices? |
| Portability | Are host-specific assumptions identified instead of presented as universal behavior? |
| Maintenance | Are versions, time-sensitive claims, compatibility, update triggers, and deprecation expectations clear? |

## Overlap and duplicate-content review

Before adding a new asset, compare its problem statement, inputs, procedure, outputs, and stop conditions with existing content.

1. **Extend an existing asset** when the owner, outcome, and lifecycle are the same.
2. **Add a focused companion** when the new procedure is independently useful but belongs to the same discipline.
3. **Create a separate asset** only when it has a distinct trigger, authority boundary, evidence contract, or operational lifecycle.
4. **Add a selection note** when two assets remain similar. Use language such as “Choose X for …; choose Y for …”.
5. **Do not create aliases by copying content.** Prefer one authoritative file and navigation links.

A new name alone is not evidence of a new responsibility. Broad terms such as “safety,” “quality,” “review,” “readiness,” and “validation” require a precise boundary in the summary.

## Status and lifecycle

Content is treated as one of the following:

- **Active:** discoverable and maintained under the current contract.
- **Experimental:** useful for evaluation, but missing production evidence, compatibility breadth, or a stable host integration. The package must say what remains unproven.
- **Deprecated:** retained for existing adopters but no longer recommended. It must link to a replacement or explain why no replacement exists.
- **Archived:** historical material that should not be selected for new adoption. Archive status must be explicit in the entrypoint and nearest index.

Deprecation must not be silent. Document the reason, replacement, compatibility impact, migration steps, and verification required after migration. Do not remove a public path until adopters have enough information to preserve or replace their copy.

## Time-sensitive and external claims

- Prefer official provider, framework, protocol, and standards sources.
- Record the relevant version or review date when behavior may change.
- Separate a provider's documented behavior from repository-specific interpretation.
- Avoid claims such as “fully compliant,” “secure,” or “production-ready” unless the exact scope and evidence are defined.
- Re-review authentication, permissions, pricing-sensitive behavior, rate limits, and supported transports when the upstream provider changes.

## What automation covers

The repository audit checks navigation, local links, structured-file syntax, schema validity, package shape, declared runtimes, standalone boundaries, and required Rule/Skill sections. It does not execute every package, contact providers, test production permissions, identify all semantic duplication, or prove that guidance is current.

Human review remains required for correctness, overlap, threat models, side effects, authority boundaries, provider claims, and the usefulness of verification evidence.

## Reviewer completion checklist

- [ ] The asset solves a distinct and stated problem.
- [ ] The supported copy unit and entrypoint are unambiguous.
- [ ] Similar content was compared and selection guidance was added where needed.
- [ ] Commands, files, schemas, examples, dependencies, and runtime declarations agree.
- [ ] Required permissions and human approvals are explicit.
- [ ] Verification covers success, failure, unknown, and recovery where applicable.
- [ ] Time-sensitive claims identify an authoritative source or review trigger.
- [ ] Navigation, changelog, migration, and deprecation information are updated as applicable.
