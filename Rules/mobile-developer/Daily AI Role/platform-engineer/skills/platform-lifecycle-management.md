# Skill: Platform Lifecycle Management

**Purpose:** evolve platform contracts without abandoning consumers.

**Trigger:** breaking change, dependency end-of-life, security requirement, cost shift, replacement capability, or low-value legacy path.

**Procedure:** inventory consumers; classify compatibility impact; define replacement; choose version/deprecation strategy; publish migration path and deadline; provide validation tooling; track adoption; handle justified exceptions through explicit authority; remove old capability only after exit criteria and approval.

**Decision rules:** prefer backward-compatible evolution; breaking change requires evidence that benefits/risk reduction justify migration cost.

**Output:** version plan, consumer inventory, migration guide, progress metrics, exception list, retirement evidence.

**Failure:** if migration repeatedly fails, investigate contract/design mismatch rather than only extending deadline.
