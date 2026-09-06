# Skill: Discover Generation Contract

## Purpose
Establish how an OpenAPI document is transformed into checked-in client code before any remediation.

## When to use
Use when generated SDK files appear stale, API changes are not reflected in clients, regeneration produces unexpected diffs, or CI should verify generated-code synchronization.

## Inputs
Repository root, suspected spec path, generated-client path, CI/build configuration, generator configuration.

## Preconditions
Repository is readable and the current Git revision/worktree state is known.

## Required context
Start with OpenAPI specs, generated roots, package/tool manifests, generator config/templates, and CI scripts that invoke generation. Expand only through direct references.

## Allowed tools
Repository read/search, Git status/diff, local generator help/version commands, `scripts/gate.py snapshot`.

## Constraints
Do not edit generated files, API contracts, dependencies, credentials, or infrastructure while discovering the contract.

## Process
1. Locate every plausible OpenAPI/Swagger source and determine which one is authoritative from build/CI/repository evidence.
2. Locate generated client roots and identify language/runtime.
3. Find the exact generator executable or wrapper and its version pin.
4. Capture generator configuration, templates, namespace/package settings, target framework, serialization choices, and output path.
5. Trace pre-generation transformations such as spec bundling, filtering, templating, or server URL rewriting.
6. Trace post-generation transformations such as formatting, patch scripts, file moves, or normalization.
7. Identify build/tests that consume generated code.
8. Run `snapshot` and preserve source revision, spec fingerprint, and generated fingerprint.
9. Produce a generation contract containing authoritative spec, complete command chain, versions, inputs, outputs, and unresolved assumptions.

## Expected output
A generation contract with facts, evidence, hypotheses, open questions, and exact verification commands.

## Verification
Every generated root is explained by a command chain rooted in an identified spec, or explicitly marked unresolved and blocking.

## Failure handling
Missing generator command or ambiguous authoritative spec blocks remediation. Tool/permission failures preserve evidence and stop.

## Stop conditions
Stop before secret retrieval, generator major upgrade, public API modification, production configuration change, or any action requiring approval.
