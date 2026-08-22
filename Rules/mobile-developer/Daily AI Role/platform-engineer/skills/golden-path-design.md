# Skill: Golden Path Design

**Purpose:** design a supported paved road for a recurring engineering task.

**Inputs:** validated problem, consumer journey, platform constraints, standards, security/reliability requirements.

**Procedure:**
1. Define the common case and explicit unsupported cases.
2. Specify contract inputs, defaults, outputs, permissions, ownership, failure semantics, and support expectations.
3. Minimize required decisions; expose only meaningful configuration.
4. Define extension/exception points rather than forcing unsafe workarounds.
5. Include observability, documentation, example, and recovery path.
6. Validate with representative consumers before broad rollout.
7. Version the contract and define compatibility policy.

**Quality gates:** usable without undocumented help; failure messages are actionable; defaults are safe; path is reversible where material.

**Output:** golden-path contract, journey, supported variants, tests, rollout plan.

**Failure:** if consumers need routine escape hatches, revisit the abstraction instead of documenting recurring bypasses.
