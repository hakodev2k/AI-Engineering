# Skill: Accessibility Review

**Purpose:** identify design-level barriers before implementation or release.
**Trigger:** critical flow design, major interaction change, new form/navigation pattern, or accessibility concern.
**Inputs:** flow/specification, platform, content, interaction states, known standards/policies.
**Preconditions:** review candidate is versioned; intended user/task is known.
**Context/tools:** design artifact, content spec, keyboard/focus model, accessibility checklist; specialist tools only when available.

## Steps
1. Identify task-critical controls, status changes, errors, timing, motion, content, and navigation.
2. Review non-pointer operability assumptions and focus sequence.
3. Review labels, instructions, error identification, recovery, and preservation of input.
4. Review structure, reading order, zoom/reflow, contrast dependencies, touch targets, motion/time limits, and cognitive load.
5. Record barrier, affected users, severity, evidence/assumption, and remediation option.
6. Escalate potential critical exclusion or policy conflict.

## Decisions
Prioritize blockers that prevent task completion or safe recovery over cosmetic issues.

## Constraints
Do not claim standards conformance from design review alone.

## Output
Accessibility findings with severity, owner, remediation, and verification method.

## Quality/verification
Critical findings have explicit reproduction context and resolution evidence.

## Failure/stop
Retry review once after material clarification; after two failed attempts or missing specialist authority, escalate. Stop when findings are resolved/accepted by authorized owner and verification path exists.
