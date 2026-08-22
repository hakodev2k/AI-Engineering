# Contracts & Boundaries
A contract is any behavior another component or person relies on: HTTP/event shape, status/error semantics, database invariant, URL/navigation rule, auth policy, cache freshness, config key, rollout flag, or operational threshold.

Classify changes as additive, compatible behavioral, conditionally compatible, or breaking. Breaking changes require consumer inventory and migration/deprecation plan.

Trust boundaries: browser/device input, public/internal API edge, message ingestion, file import, third-party callback, database/admin tooling. Validate and authorize at the boundary owning the action.

Ownership: product owns intended behavior; engineering owns implementation; security owns exceptions; data/service owners approve destructive operational actions. The Full-stack Developer integrates decisions but MUST NOT override these authorities.