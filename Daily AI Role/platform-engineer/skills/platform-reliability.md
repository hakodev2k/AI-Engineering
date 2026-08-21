# Skill: Platform Reliability

**Purpose:** keep platform capabilities dependable enough for consuming teams to build on.

**Inputs:** SLOs, incidents, error budgets, latency/error telemetry, dependency health, support signals.

**Procedure:**
1. Identify critical user journeys and dependencies.
2. Define SLIs/SLOs around consumer-visible success.
3. Instrument failure classes and dependency boundaries.
4. Triage incidents by blast radius and blocked developer workflows.
5. Prefer containment and reversible recovery before deep remediation.
6. After recovery, remove recurring failure modes through platform changes.
7. Track error budget and reliability debt against roadmap pressure.

**Output:** reliability assessment, incident actions, SLO evidence, prevention work.

**Trade-off:** higher reliability can increase cost and complexity; align targets with actual consumer criticality rather than maximizing every component.
