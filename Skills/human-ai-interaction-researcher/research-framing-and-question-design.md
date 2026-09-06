# Research Framing and Question Design

## Purpose
Turn a vague concern about an AI product or workflow into researchable questions that can materially inform design, policy, or product decisions. This skill prevents teams from running polished studies that cannot change a decision.

## When to use
Use before discovery research, usability testing, trust studies, evaluation design, adoption research, workflow studies, or high-stakes AI deployments. Do not use when the decision is already fixed and research cannot influence it.

## Inputs
Product context, target users, decision to inform, prior evidence, model/system behavior, risk profile, business goals, policy constraints, and available research resources.

## Preconditions
A decision owner exists, the target population is identifiable, and there is at least one plausible action that could change based on findings.

## Context to inspect
Review prior user research, support tickets, analytics, model evaluations, prompt and UX flows, safety policies, target tasks, domain constraints, and known failure modes. Separate observed facts from stakeholder assumptions.

## Core knowledge
Good research questions distinguish exploratory, descriptive, evaluative, comparative, and causal goals. Human-AI studies must treat the model as variable rather than static: outputs depend on prompts, context, sampling, model version, retrieved data, and prior turns. User behavior also changes with repeated exposure, trust calibration, and growing skill.

## Procedure
1. State the product or operational decision in one sentence.
2. Identify who will act on the findings and what choices are available.
3. List current assumptions about users, tasks, model capability, risk, and value.
4. Identify evidence gaps that could change the decision.
5. Convert each gap into a neutral research question.
6. Classify each question as exploratory, descriptive, evaluative, comparative, or causal.
7. Remove questions whose answers would not change any decision.
8. Define the relevant user segment, task, system configuration, and context for each question.
9. Identify confounds such as user expertise, model version, latency, memory, prior turns, or prompt variations.
10. Prioritize questions by decision impact, uncertainty, and cost of being wrong.
11. Define what evidence would increase, decrease, or fail to change confidence.
12. Document non-goals and unresolved risks.

## Decision points
Use exploratory framing when the problem is poorly understood. Use comparative questions when choosing among alternatives. Use causal questions only when the study design can support causal inference. If the decision depends on rare but severe failure, prioritize risk-oriented questions over average satisfaction.

## Common failure patterns
Leading questions, measuring preference when task performance matters, mixing several decisions into one study, ignoring AI nondeterminism, overfitting to power users, treating model output as ground truth, and collecting data without an explicit interpretation plan.

## Verification
A reviewer should be able to map every research question to a decision and every decision to an evidence need. Questions should not encode a desired answer. Confounds and system configuration must be documented well enough for another researcher to understand what was actually studied.

## Expected output
A research brief containing decision context, prioritized questions, assumptions, target users, scope, non-goals, known confounds, evidence criteria, and escalation risks.

## Stop conditions
Stop and escalate when the decision cannot change, the target population is undefined, critical safety ownership is unresolved, or the system configuration cannot be stabilized enough to interpret results.