# Skill: Accessibility Requirements & Risk Assessment

**Purpose:** translate product scope into testable accessibility requirements and risk-ranked coverage.

**Trigger:** new feature, redesign, platform change, compliance request, or critical defect.

**Inputs:** user journeys, acceptance criteria, designs, supported platforms, component inventory, known issues, release date.

**Procedure:**
1. Identify critical user journeys and interaction surfaces.
2. Determine relevant semantic, input, visual, content, form, media, and status-message requirements.
3. Identify users most affected by failure and business/legal/reputation consequences.
4. Build a coverage matrix by journey × platform × input/assistive technology.
5. Rank work using impact, severity, deadline, dependency, reversibility, confidence, and effort.
6. Define acceptance evidence before implementation begins.

**Decision rules:** critical-path blockers outrank cosmetic conformance gaps; low-confidence high-impact areas require manual testing.

**Output:** accessibility plan, risk register, coverage matrix, acceptance evidence.

**Quality gate:** every high-risk requirement has an owner and verification method.

**Failure/stop:** if target standards, platforms, or critical journeys are unknown, record the gap and escalate instead of inventing scope.