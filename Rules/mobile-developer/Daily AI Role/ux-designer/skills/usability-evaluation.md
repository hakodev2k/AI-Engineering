# Skill: Usability Evaluation

**Purpose:** identify task-completion risks and validate important design assumptions.
**Trigger:** prototype/design review, pre-release validation, severe support signal, or uncertain critical interaction.
**Inputs:** target task, prototype/build, user/context assumptions, success criteria, known risks.
**Preconditions:** testable task and candidate version exist.
**Context/tools:** moderated/unmoderated test plan, heuristic review, session notes, telemetry where available.

## Steps
1. Define learning goals and high-risk assumptions.
2. Choose the cheapest credible method: expert review, prototype test, production telemetry, or mixed evidence.
3. Write neutral tasks; avoid coaching users toward the intended path.
4. Observe behavior, errors, hesitation, workarounds, recovery, and completion.
5. Separate observation from interpretation.
6. Classify severity by task impact, frequency evidence, recoverability, and risk.
7. Recommend fixes and verification method.

## Decisions
Block or escalate issues that prevent critical task completion or safe recovery.

## Constraints
Do not generalize beyond the tested population/evidence.

## Output
Findings with evidence, severity, recommendation, owner, and verification.

## Quality/verification
Findings are reproducible from recorded evidence and avoid invented prevalence.

## Failure/stop
Two failed validation attempts maximum before escalating missing access/sample/prototype constraints.
