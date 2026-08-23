# Cognitive Load Reduction

## Purpose
Reduce unnecessary concepts, decisions, and context switching developers must carry to deliver and operate software safely.

## When to use
Use when workflows require extensive tribal knowledge, configuration choices, platform details, or repeated cross-team coordination.

## Inputs
Journey maps, architecture, developer interviews, support data, configuration surfaces, and platform capabilities.

## Context to inspect
Inspect required concepts, decision frequency, defaults, naming, interfaces, ownership boundaries, and exception rates.

## Core knowledge
Distinguish intrinsic domain complexity from extraneous platform complexity. Remove the latter through coherent abstractions, defaults, automation, and information architecture.

## Procedure
1. Choose a representative developer job.
2. Inventory concepts and decisions required.
3. Identify which complexity is domain-essential.
4. Find duplicated, incidental, or infrastructure-specific knowledge.
5. Simplify interfaces and defaults.
6. Automate low-value decisions safely.
7. Reveal advanced detail progressively.
8. Test whether developers can explain and execute the workflow with less context.

## Decision points
Abstract stable complexity; expose underlying detail when developers need control or debugging visibility.

## Common failure patterns
Hiding essential failure semantics, creating leaky abstractions, adding another portal without removing old paths, and assuming fewer clicks means lower cognitive load.

## Verification
Compare required concepts, decision count, support interventions, task success, and qualitative mental effort before and after.

## Expected output
A simplified workflow with documented retained complexity, removed decisions, safe defaults, and evidence of reduced cognitive burden.

## Stop conditions
Stop when simplification would conceal material security, reliability, cost, or domain decisions.