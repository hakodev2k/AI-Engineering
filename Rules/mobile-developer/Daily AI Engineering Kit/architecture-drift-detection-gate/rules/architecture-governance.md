# Architecture Governance Rules

## MUST

- MUST load or extract the architecture baseline before judging a nontrivial structural change.
- MUST classify changed files into architectural modules when a module model exists.
- MUST evaluate every new cross-module dependency against the approved dependency direction.
- MUST keep deterministic architecture policy and semantic architecture evidence separate.
- MUST cite the ADR, policy rule, project dependency, or repository evidence supporting each architecture finding.
- MUST rerun architecture checks against the final file state before declaring architecture verification.
- MUST record temporary exceptions with narrow scope, owner, reason, and review/expiry date.
- MUST require explicit human approval for a new dependency direction, breaking public module contract, architecture-policy relaxation, or ADR supersession.
- MUST report unknown or conflicting architecture evidence instead of silently choosing an interpretation.
- MUST run relevant build/tests separately from the architecture gate.

## MUST NOT

- MUST NOT treat a successful build or passing tests as proof of architecture compliance.
- MUST NOT modify architecture policy merely to make a violating change pass.
- MUST NOT convert existing legacy violations into approved rules without evidence.
- MUST NOT introduce cross-module access to internal implementation details when a published interface exists.
- MUST NOT move business/domain rules into transport, UI, persistence, or infrastructure code solely for implementation convenience.
- MUST NOT bypass module APIs by sharing mutable internal models across boundaries.
- MUST NOT create permanent exceptions without explicit human approval.
- MUST NOT hide deterministic violations by adding broad ignore globs or catch-all exceptions.
- MUST NOT delete modules/files, rewrite Git history, change database schema, infrastructure, secrets, security controls, or production configuration without explicit human approval.
- MUST NOT claim `verified` while an architecture finding remains `insufficient-evidence`, `confirmed-drift`, or `architecture-change-required` without approval.

## SHOULD

- SHOULD prefer explicit module interfaces over direct implementation coupling.
- SHOULD keep architecture rules small enough to explain and enforce.
- SHOULD encode stable dependency-direction rules deterministically where practical.
- SHOULD use ADRs for deliberate architecture changes rather than burying decisions in code review comments.
- SHOULD keep exceptions temporary and remove them as soon as the migration path is complete.
- SHOULD scope checks to changed/affected modules for fast feedback, then run the repository-wide gate before completion when feasible.
- SHOULD distinguish desired target architecture from tolerated legacy state so the gate does not require unrelated cleanup.
