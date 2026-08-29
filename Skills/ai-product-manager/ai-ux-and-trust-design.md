# AI UX and Trust Design

## Purpose
Design user experiences that make probabilistic AI useful, understandable, controllable, and appropriately trusted.

## When to use
Use for copilots, assistants, generative features, agent workflows, or any experience where output can be uncertain or wrong.

## Inputs
User tasks, risk levels, model behavior, latency, confidence signals, source availability, editing/retry capabilities, user research.

## Context to inspect
Current interaction patterns, error cases, disclosure requirements, feedback mechanisms, permission prompts, citations, loading states, and recovery flows.

## Core knowledge
Trust should be calibrated, not maximized. Users need enough transparency and control to detect, correct, or avoid costly errors without being overloaded with model internals.

## Procedure
1. Classify user tasks by consequence of error.
2. Identify where uncertainty, provenance, or limitations must be visible.
3. Design preview, edit, undo, retry, and confirmation controls.
4. Make high-impact actions explicit before execution.
5. Define useful empty, failure, timeout, and refusal states.
6. Provide citations or evidence when factual trust matters.
7. Minimize anthropomorphic cues that overstate capability.
8. Test comprehension, correction behavior, and user over-reliance.
9. Measure both task success and harmful acceptance of bad outputs.

## Decision points
Use more friction for high-risk actions and less for reversible low-risk assistance. Show confidence only if it is calibrated and actionable.

## Common failure patterns
Overconfident wording, hidden uncertainty, irreversible one-click actions, excessive disclaimers, and treating chat as the only suitable interface.

## Verification
Usability-test representative failures and verify users can recognize, correct, and recover from them.

## Expected output
An AI UX specification covering trust cues, controls, failure states, action safety, and measurable usability criteria.

## Stop conditions
Stop when the product cannot give users sufficient control for the consequence level of the task.