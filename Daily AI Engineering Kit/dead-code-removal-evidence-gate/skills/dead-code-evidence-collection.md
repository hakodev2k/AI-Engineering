# Dead Code Evidence Collection

## Purpose
Establish whether a code symbol, file, endpoint, job, configuration key, feature branch, or module is truly unused before any removal is proposed.

## When to use
Use when static analysis reports unused code, during repository cleanup, after feature retirement, before deleting legacy integrations, or when an agent proposes removing code to simplify a change.

## Inputs
- Candidate identifier and repository path.
- Candidate kind: symbol, file, endpoint, job, config-key, module, migration-helper, test-fixture, or generated artifact.
- Repository root and target revision.
- Known runtime/framework conventions.

## Preconditions
- Repository is readable at a known revision.
- Candidate identity is unambiguous.
- Generated/vendor/build-output directories are identified.

## Required context
Inspect nearby implementation, registrations, tests, config, documentation, build files, serializers, routing, DI, reflection/dynamic-loading patterns, and deployment/runtime references relevant to the candidate.

## Allowed tools
Repository search, language-aware references, grep/ripgrep, build/test tools, configuration inspection, dependency graph tools, logs/telemetry supplied for the task, and `scripts/scan-references.py`.

## Constraints
- Absence of a static reference is not proof of dead code.
- Treat reflection, string-based lookup, serialization, routing, dependency injection, plugin discovery, scheduled jobs, templates, scripts, config, generated code, and external consumers as separate evidence channels.
- Never delete or edit the candidate during evidence collection.
- Never infer production non-use from local test coverage alone.

## Procedure
1. Record candidate identity, kind, path, declaration, visibility, and owning component.
2. Classify exposure: private/internal/public/external-contract/runtime-discovered.
3. Run deterministic repository reference scan and preserve the report.
4. Inspect language-aware callers/references where supported.
5. Search exact symbol/name plus common transformed forms: route names, config keys, kebab/snake/camel variants, type names, assembly-qualified names, job names, event names, serialization names.
6. Inspect DI/service registration, factories, registries, plugin catalogs, reflection, `GetType`, `Activator`, attributes, annotations, source generators, and assembly scanning.
7. Inspect API routing, controllers, RPC/event contracts, message consumers, cron/schedulers, background jobs, queues, webhooks, CLI commands, and UI/template references.
8. Inspect configuration and infrastructure files for indirect enablement.
9. Inspect tests. Tests count as references but do not by themselves prove production use.
10. Inspect changelog/issues/docs only as supporting context, never as sole proof.
11. If runtime evidence is available, record its source, environment, observation window, and limitations.
12. Classify each channel as `clear`, `reference-found`, `unknown`, or `not-applicable`.
13. Produce an evidence record using `schemas/dead-code-evidence.schema.json`.
14. Set status to `candidate` only if no blocking reference is found. Set `blocked` if any live reference exists. Keep `investigating` if a required channel is unknown.

## Expected output
A machine-readable evidence record containing candidate metadata, evidence channels, findings, unresolved risks, recommended action, and verification state.

## Verification
Run `scripts/validate-evidence.py`. The record is not removal-ready unless all policy-required channels are resolved and no live reference is present.

## Failure handling
- Tool/reference search failure: retry once if transient; otherwise mark the channel `unknown` and stop removal progression.
- Ambiguous symbol identity: stop and request disambiguation in the evidence record.
- Repository too large: narrow by module first, then expand based on discovered dependency edges; never silently skip required channels.

## Stop conditions
Stop when a live reference is found, a required evidence channel remains unknown, candidate identity is ambiguous, or evidence collection is complete enough to hand off to the Removal Reviewer.