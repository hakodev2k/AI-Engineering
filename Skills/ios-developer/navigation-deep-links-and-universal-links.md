# Navigation, Deep Links, and Universal Links

## Purpose
Design deterministic in-app navigation that supports external URLs, notifications, restoration, authentication gates, and multi-scene lifecycle.

## When to use
Use for navigation architecture, deep/universal links, push destinations, or route-state defects.

## Inputs
Route catalog, URL contract, auth rules, scene model, restoration requirements.

## Context to inspect
NavigationStack/UIKit coordinators, URL handlers, associated domains, app/scene delegates, notification routing, analytics.

## Core knowledge
External routes are untrusted input. Routing should parse into typed destinations, validate prerequisites, then execute navigation from current application state.

## Procedure
1. Inventory supported destinations and parameters.
2. Define canonical route representation.
3. Parse and validate external URLs strictly.
4. Separate route parsing from navigation execution.
5. Resolve authentication/onboarding prerequisites.
6. Define behavior from cold start, background, and active states.
7. Handle invalid/obsolete routes safely.
8. Preserve route compatibility when links are externally published.
9. Test multi-step and repeated routing.

## Decision points
Use URL-based public routes for externally durable contracts; internal typed routes for refactor safety. Queue a route only when prerequisite completion is deterministic.

## Common failure patterns
Stringly typed navigation, duplicate pushes, trusting URL parameters, lost cold-start routes, and navigation before hierarchy readiness.

## Verification
Test universal links, custom links if supported, push routes, cold/warm starts, auth transitions, malformed input, and backward compatibility.

## Expected output
Typed routing contract with deterministic lifecycle behavior and validation tests.

## Stop conditions
Stop when domain association, public URL ownership, or authentication requirements cannot be verified.