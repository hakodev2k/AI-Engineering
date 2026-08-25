# Generated Code and Toolchain Rules

## Purpose
Keep protobuf generation reproducible, reviewable, and safe across languages.

## Scope
Compilers, plugins, generated SDKs, dependency versions, and code-generation pipelines.

## MUST
- Compiler/plugin versions MUST be pinned or otherwise reproducible.
- Generated artifacts MUST originate from reviewed schemas and approved toolchains.
- Toolchain upgrades MUST run compatibility and representative client/server tests.
- Generated code policy MUST be consistent and documented.

## MUST NOT
- MUST NOT hand-edit generated files as the source of truth.
- MUST NOT accept unreviewed generator changes that alter public API shape.
- MUST NOT execute untrusted code-generation plugins in privileged CI contexts.

## SHOULD
- Automate drift detection between schemas and generated outputs.
- Keep generator configuration with its reproducible build definition.

## Exceptions
Emergency generated-code patches require explicit ownership and immediate backport to schema/generator source.

## Verification
Rebuild from clean checkout, compare generated diffs, inspect pinned versions, run security scans, and execute compatibility tests.