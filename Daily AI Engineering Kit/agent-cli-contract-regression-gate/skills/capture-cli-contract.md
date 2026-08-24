# Skill: Capture CLI Contract

## Purpose

Create a normalized, reviewable snapshot of the currently supported CLI surface.

## When to use

Before modifying a public CLI or when introducing this package to an existing repository.

## Inputs

- CLI entry points.
- Parser/router configuration.
- Existing help output and docs.
- Tests that encode command behavior.

## Preconditions

The baseline revision is known and represents the currently supported interface.

## Process

1. Locate CLI entry points and command registration code.
2. Enumerate public commands and subcommands.
3. For each command, capture public options with name, requiredness, default, and accepted choices.
4. Capture public positional arguments and requiredness.
5. Capture documented exit codes.
6. Cross-check the snapshot against `--help` output and parser tests.
7. Normalize the data to `schemas/cli-contract.schema.json` shape.
8. Review the snapshot for aliases and hidden/internal flags; exclude non-public implementation details.
9. Save the baseline in a stable repository path chosen by the host project.
10. Record the source revision in surrounding change evidence.

## Expected output

A complete version-1 CLI contract JSON.

## Verification

A second reviewer or Verification Agent confirms representative commands/options in the snapshot exist in the actual CLI.

## Failure handling

If CLI registration is dynamic or environment-dependent, capture the supported variants separately and document the conditions. Do not invent values from documentation alone when runtime evidence disagrees.

## Stop conditions

Stop if the public/private boundary is unknown, the baseline revision is unstable, or representative runtime help cannot be reconciled with source/tests.