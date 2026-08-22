# Consent and Preference Engineering

## Purpose
Implement trustworthy capture, enforcement, withdrawal, and evidence for user privacy choices where consent or preferences are required.

## When to use
Use for optional tracking, marketing, personalization, sharing, or other choice-dependent processing.

## Inputs
Approved choice model, purposes, UI requirements, identifiers, processing systems, and evidence requirements.

## Context to inspect
Inspect defaults, regional behavior, identity state, anonymous-to-authenticated transitions, downstream consumers, and withdrawal propagation.

## Core knowledge
A preference is useful only if processing systems enforce it. Consent evidence should capture what was chosen, for which purpose, under which version, and when, without excessive data.

## Procedure
1. Define granular purposes and states.
2. Set privacy-preserving defaults.
3. Design clear capture and withdrawal flows.
4. Persist versioned evidence.
5. Propagate choices to every dependent processor.
6. Handle identity merges and device changes.
7. Make withdrawal as operationally effective as granting.
8. Test race conditions and stale caches.
9. Monitor enforcement drift.

## Decision points
Prefer purpose-level controls over one broad toggle when processing purposes differ materially.

## Common failure patterns
Preselected choices, UI-only toggles, stale downstream state, bundled purposes, and continuing processing after withdrawal.

## Verification
Change preferences in representative states and prove downstream processing starts or stops accordingly.

## Expected output
Consistent, auditable preference enforcement.

## Stop conditions
Escalate unclear legal basis, deceptive UX concerns, or processors unable to honor choices.