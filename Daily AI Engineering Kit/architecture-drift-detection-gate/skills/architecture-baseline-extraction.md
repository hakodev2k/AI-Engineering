# Skill: Architecture Baseline Extraction

## Purpose

Build a compact, evidence-backed description of the repository's current or declared architecture before evaluating a change.

## When to use

Use before significant feature work, refactoring, dependency changes, module moves, architecture review, or whenever the agent cannot confidently state which dependencies are allowed.

## Inputs

- task or pull-request description;
- repository root;
- architecture policy if present;
- ADRs, architecture docs, project/package files, module manifests, and ownership metadata;
- optional changed-file list.

## Preconditions

- repository is readable;
- task scope is known enough to identify affected modules;
- policy/ADR sources are treated as evidence, not assumptions.

## Process

1. Identify the files/modules touched or likely to be touched by the task.
2. Locate architecture evidence in this order:
   1. explicit policy/config used by automation;
   2. accepted ADRs;
   3. architecture/module documentation;
   4. project/package dependency declarations;
   5. stable repository structure and existing dependency direction.
3. Record each architectural module with path prefix, responsibility, public entry points, and owner if known.
4. Record allowed dependency direction between affected modules.
5. Record prohibited dependencies, internal-only namespaces, generated/vendor areas, and special boundaries.
6. Record relevant ADR IDs/paths and the constraint each one establishes.
7. Detect contradictions between policy, ADRs, docs, and actual code.
8. For contradictions, do not silently choose a winner. Mark the baseline as `conflicted` and list evidence.
9. Identify architecture rules that can be encoded deterministically in `architecture-policy.json`.
10. Identify rules that require semantic review because they concern responsibility, ownership, abstraction, or intent.
11. Produce a baseline summary scoped to the task rather than a full repository encyclopedia.

## Allowed tools

- repository file search/read;
- Git metadata and diff inspection;
- dependency/project manifest inspection;
- read-only build graph/project graph commands;
- architecture policy validator.

## Constraints

- Do not edit production code during baseline extraction.
- Do not infer a rule solely because many existing files happen to follow it.
- Do not convert accidental legacy coupling into an approved architecture rule.
- Do not treat an implementation detail as a public module interface without evidence.
- Do not read secrets or production data to infer architecture.

## Expected output

A concise baseline containing:

- affected modules;
- responsibilities;
- allowed dependency edges;
- forbidden dependency edges/patterns;
- relevant ADRs/decisions;
- explicit conflicts or unknowns;
- deterministic rules to run;
- semantic rules that require review.

## Verification

The baseline is usable only when every affected module is either mapped or explicitly marked unknown and every claimed architectural constraint cites a policy, ADR, project dependency, documentation source, or clearly labeled repository observation.

## Failure handling

- Missing evidence: perform one targeted search expansion.
- Conflicting evidence: stop classification of the disputed rule and escalate it as a baseline conflict.
- Unknown ownership/boundary after targeted search: mark blocked rather than inventing a module rule.

## Stop conditions

Stop when the affected change surface has enough architecture evidence to judge dependency direction and module responsibility, or when a blocking ambiguity/conflict has been identified for human resolution.
