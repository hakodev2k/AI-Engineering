# Navigation and Pathfinding

## Purpose
Build reliable agent navigation with appropriate pathfinding, local avoidance, recovery behavior, and performance controls.

## When to use
Use for NPC movement, dynamic obstacles, large worlds, crowd navigation, unreachable targets, or navigation performance issues.

## Inputs
World representation, agent sizes, movement constraints, dynamic obstacle behavior, engine navigation APIs, and agent-count targets.

## Context to inspect
Inspect navigation meshes/graphs, path request frequency, obstacle updates, off-mesh links, steering, avoidance, and fallback behavior.

## Core knowledge
A* and navigation meshes solve global routing; steering/local avoidance solves short-range motion. Replanning too often is expensive and can create oscillation. Navigation data must match actual locomotion capabilities.

## Procedure
1. Define traversable space and agent classes.
2. Choose navmesh, grid, waypoint graph, or specialized representation.
3. Configure path cost and traversal constraints.
4. Separate global pathfinding from local steering.
5. Add unreachable/stuck detection.
6. Define replanning triggers and cooldowns.
7. Handle moving destinations and dynamic obstacles.
8. Profile path generation and crowd updates.
9. Add navigation debug visualization.

## Decision points
Use navmeshes for continuous 3D walkable surfaces, grids for discrete/tactical spaces, and hierarchical routing for very large worlds. Replan on meaningful invalidation rather than every frame.

## Common failure patterns
No stuck recovery, paths that ignore character dimensions, synchronous mass path requests, obstacle carving churn, and treating local avoidance as global pathfinding.

## Verification
Test narrow passages, unreachable goals, dynamic obstacles, crowds, moving targets, streaming boundaries, and peak agent counts.

## Expected output
Robust navigation with bounded pathfinding cost and explicit recovery behavior.

## Stop conditions
Stop when world traversal rules or locomotion capabilities are unresolved, or target scale exceeds the selected navigation representation without redesign.