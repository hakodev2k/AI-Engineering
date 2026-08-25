# Gameplay AI Behavior Rules

## Purpose
Keep non-player behavior predictable, performant, debuggable, and fair to players.

## Scope
Behavior trees, planners, navigation, perception, steering, utility systems, and NPC decision making.

## MUST
- AI decisions MUST have observable state sufficient to diagnose why an action was selected.
- Navigation and perception workloads MUST be bounded or scheduled to respect frame budgets.
- AI state transitions MUST handle target loss, invalid paths, despawn, and interruption.
- Competitive or stealth-critical perception MUST use defined rules rather than accidental engine visibility.

## MUST NOT
- MUST NOT depend on nondeterministic iteration order where outcome stability is required.
- MUST NOT grant hidden information to AI unless explicitly part of the design.

## SHOULD
- Expensive decisions SHOULD run at the lowest frequency consistent with gameplay quality.

## Exceptions
Scripted sequences may bypass general decision logic when transitions and recovery are explicit.

## Verification
Use AI debug visualization, deterministic scenarios, navigation stress tests, profiler captures, and fairness review.