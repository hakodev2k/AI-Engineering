# Variable and Output Contracts

## Purpose
Design Terraform inputs and outputs as clear, validated, evolvable interfaces between modules and stacks.

## When to use
Module authoring, API cleanup, cross-stack integration, and compatibility review.

## Inputs
Consumer needs, configuration shapes, defaults, sensitivity, compatibility requirements.

## Context to inspect
Existing variables/outputs, call sites, tfvars, remote-state consumers, validation and preconditions.

## Core knowledge
Strong types and validation fail early. Defaults encode policy. Outputs create coupling and may expose sensitive state. Prefer semantic objects over loosely related parameter lists when cohesion is stable.

## Procedure
1. Inventory consumers and required capabilities.
2. Define minimal typed inputs.
3. Add validation for domain constraints.
4. Use nullable/optional values intentionally.
5. Choose defaults only when universally safe.
6. Expose stable semantic outputs, not internal implementation details.
7. Mark sensitive values and minimize secret-bearing outputs.
8. Test invalid inputs and compatibility with existing callers.

## Decision points
Use objects for cohesive evolving contracts; separate variables when values vary independently. Avoid outputting whole resources merely for convenience.

## Common failure patterns
any types, magic defaults, excessive variables, leaking secrets, outputting internals, and breaking object shapes without versioning.

## Verification
Invalid configurations fail with actionable messages; representative callers plan successfully; outputs contain only required data.

## Expected output
A small typed module interface with documented semantics.

## Stop conditions
Stop when consumer requirements conflict or changing the contract requires an unplanned breaking release.