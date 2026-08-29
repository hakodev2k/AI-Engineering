# Technical Roadmap Alignment

## Purpose
Align customer technical priorities with current product capabilities, documented deprecations, and approved roadmap information while preventing accidental commitments.

## When to use
Use during strategic planning, architecture evolution, executive reviews, renewal preparation, or when future capability influences customer design decisions.

## Inputs
Customer roadmap, product documentation, supported versions, deprecation notices, approved roadmap material, architecture dependencies, and target dates.

## Context to inspect
Which customer initiatives depend on existing capability, future capability, migration work, or unsupported assumptions; also inspect decision deadlines and fallback options.

## Core knowledge
Roadmap alignment is uncertainty management. Senior TAMs separate generally available capability, committed customer obligations, directional roadmap information, and customer requests.

## Procedure
1. Capture the customer's planned technical initiatives and decision dates.
2. Map each initiative to current supported capability.
3. Identify gaps, deprecations, and migration dependencies.
4. Validate roadmap information through approved internal sources.
5. Label roadmap statements by certainty and avoid implied commitments.
6. Define customer fallback options where future capability is uncertain.
7. Route strategic feature gaps to product with business and technical context.
8. Revisit alignment when roadmap or customer priorities change.

## Decision points
Design around available capability when deadlines are firm. Treat future features as optional dependencies unless formally committed through authorized channels.

## Common failure patterns
Promising dates, presenting requests as roadmap commitments, delaying viable architecture for speculative features, and failing to plan for deprecations.

## Verification
Confirm each customer initiative has a current-capability path, documented dependency, or explicit uncertainty and fallback.

## Expected output
A roadmap-alignment record with initiatives, capability mapping, gaps, uncertainty, dependencies, and next decisions.

## Stop conditions
Stop when roadmap information is restricted, contractual commitment is requested, or authoritative product guidance is unavailable.