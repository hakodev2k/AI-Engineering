# Modular Monolith Design

## Purpose
Design a single deployable application with strong internal boundaries and controlled coupling.

## When to use
Use when independent service deployment is unnecessary but a large codebase needs clear modularity, ownership, and evolution paths.

## Inputs
Domain boundaries, deployment model, team structure, repository, database usage, change history.

## Context to inspect
Module dependencies, shared tables, cross-module calls, package structure, transaction boundaries, and release process.

## Core knowledge
A modular monolith keeps deployment simple while enforcing internal contracts. Modules should own behavior and data access, expose narrow APIs, and avoid hidden backdoors.

## Procedure
1. Identify cohesive business modules.
2. Assign module ownership and responsibilities.
3. Define public interfaces and internal implementations.
4. Prevent direct access to another module’s internals.
5. Clarify data ownership and allowed cross-module reads.
6. Use events or explicit calls for module collaboration.
7. Enforce dependency rules automatically where possible.
8. Test representative changes for blast radius.
9. Define extraction criteria if a module later needs service independence.

## Decision points
Keep modules in-process for simplicity unless deployment, scaling, fault isolation, or ownership requires separation. Prefer explicit contracts over shared utility layers.

## Common failure patterns
Folder-only modularity, shared database ownership, circular dependencies, global service locators, and premature microservice extraction.

## Verification
Dependency checks pass, module internals are inaccessible externally, and typical changes remain localized.

## Expected output
A coherent module model with contracts, data ownership, and enforceable dependency rules.

## Stop conditions
Stop if domain boundaries or data ownership are unresolved enough to make module contracts speculative.