# Pinia State Management

## Purpose
Design and operate Pinia stores that coordinate genuinely shared application state without turning stores into uncontrolled global containers.

## When to use
Use for cross-route state, shared workflows, session-level coordination, or refactoring legacy Vuex/global state.

## Inputs
State requirements, store definitions, consumers, persistence rules, and API interactions.

## Context to inspect
Inspect existing stores, ownership boundaries, plugins, persistence, SSR, tests, and whether remote data already has a dedicated cache layer.

## Core knowledge
Stores should represent cohesive domains or workflows. Getters derive state; actions coordinate mutations and side effects. Persistence and SSR introduce serialization and isolation concerns.

## Procedure
1. Identify state that truly needs shared ownership.
2. Group state by cohesive domain/workflow.
3. Define minimal state, getters, and actions.
4. Keep component-only state local.
5. Establish API orchestration boundaries.
6. Handle loading, error, and concurrency states explicitly.
7. Add persistence only for explicit requirements.
8. Prevent sensitive data from unsafe storage.
9. Test actions, getters, reset behavior, and multiple consumers.

## Decision points
Use local state when one subtree owns it; provide/inject for scoped sharing; Pinia for application-level coordination. Persist only data that must survive reloads and can safely be stored client-side.

## Common failure patterns
One giant store, duplicating server state, direct mutations scattered across components, persistent stale state, cross-store cycles, and storing secrets in browser persistence.

## Verification
Verify store isolation, transitions, refresh behavior, failure handling, SSR safety where relevant, and tests for concurrent actions.

## Expected output
Small cohesive stores with explicit ownership and predictable state transitions.

## Stop conditions
Stop when persistence/security requirements are unclear or migration could break existing persisted state without a compatibility plan.