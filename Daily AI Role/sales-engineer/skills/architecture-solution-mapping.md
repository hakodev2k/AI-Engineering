# Skill: Architecture Solution Mapping

**Purpose:** Map customer architecture and requirements to a realistic solution shape.

**Inputs:** Discovery record, current architecture, product capabilities, constraints.

**Procedure:**
1. Draw system boundary, actors, data flows, trust boundaries, integrations, and ownership.
2. Map each requirement to supported/conditional/gap/unknown.
3. Identify prerequisites, nonfunctional constraints, migration impact, and operational ownership.
4. Generate alternatives when material trade-offs exist.
5. Review security, reliability, performance, and maintainability implications in parallel when independent.
6. Consolidate into one recommended option with rejected alternatives and rationale.

**Output:** Architecture proposal and fit-gap matrix.

**Verification:** Every component and dependency has an owner/source; unapproved exceptions are not presented as decisions.