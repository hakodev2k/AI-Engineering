# Origin Security Model

## Purpose
Apply origin, site, secure-context, and isolation rules correctly when designing or reviewing browser features.

## When to use
Use for cross-origin APIs, navigation, storage, embedding, messaging, permissions, or security review.

## Inputs
Feature contract, URLs/origins, frame relationships, policy headers, security requirements.

## Context to inspect
Origin computation, opaque origins, site boundaries, frame ancestry, sandbox flags, CSP, permissions policy, isolation state.

## Core knowledge
The same-origin policy is foundational but not the only boundary. Site, origin, agent cluster, browsing context, secure context, and process isolation have distinct semantics. Opaque origins require special care.

## Procedure
1. Identify all principals and resources.
2. Compute relevant origins and sites explicitly.
3. Map read, write, navigate, embed, and message capabilities.
4. Apply sandbox and policy restrictions.
5. Check redirects and inherited/opaque origin cases.
6. Ensure privileged data is not exposed through side channels or error detail.
7. Test same-origin, cross-origin, sandboxed, opaque, and nested-frame cases.

## Decision points
Use the narrowest principal required by the standard. Do not substitute site equality for origin equality. Require secure contexts for powerful capabilities when specified or risk warrants it.

## Common failure patterns
String-comparing URLs; mishandling default ports; trusting initiator-controlled metadata; forgetting opaque origins; checking policy only after data access.

## Verification
Security tests cover positive and negative matrices, redirects, nested contexts, and policy combinations.

## Expected output
A least-privilege implementation or review with explicit principal reasoning.

## Stop conditions
Stop when a new capability changes the browser security model or when standards/security ownership approval is required.