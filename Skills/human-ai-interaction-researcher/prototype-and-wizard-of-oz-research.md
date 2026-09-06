# Prototype and Wizard-of-Oz Research

## Purpose
Test human-AI interaction concepts before full technical implementation by simulating selected AI behavior in a controlled, ethically disclosed research setup.

## When to use
Use when validating workflow, interaction, initiative, control, explanation, or value propositions before model/tool infrastructure is complete.

## Inputs
Concept, research questions, target tasks, prototype, intended AI behavior, operator protocol, participant risk, and fidelity constraints.

## Context to inspect
Inspect which behaviors are real versus simulated, latency expectations, model limitations, operator actions, data exposure, and decisions the study is intended to inform.

## Core knowledge
Wizard-of-Oz methods can isolate interaction questions from immature technology, but unrealistic consistency or hidden human intelligence can overstate feasibility. Participants must be debriefed appropriately and high-risk deception requires ethics review.

## Procedure
1. Define which hypotheses concern interaction rather than technical feasibility.
2. Specify exactly which system behaviors will be simulated.
3. Create an operator protocol with bounded responses and timing.
4. Prevent the operator from using knowledge the intended system would not possess.
5. Build realistic failure, uncertainty, and latency cases.
6. Pilot the setup for consistency and accidental disclosure.
7. Run task-based sessions and observe user behavior.
8. Record where participant expectations exceed plausible implementation.
9. Separate findings about interaction value from claims about technical capability.
10. Debrief participants according to approved protocol.
11. Translate validated concepts into technical requirements and remaining feasibility questions.

## Decision points
Use low fidelity for workflow concepts, higher fidelity for timing and control details, and real models when model variability itself is the research subject.

## Common failure patterns
A human operator being unrealistically intelligent, perfect responses that inflate trust, hiding impossible capabilities, inconsistent simulation, and treating concept validation as proof of technical feasibility.

## Verification
Audit operator behavior against the protocol and ensure findings explicitly identify simulated assumptions and implementation dependencies.

## Expected output
A concept research report with validated interaction hypotheses, failed assumptions, simulated boundaries, feasibility dependencies, and next-step requirements.

## Stop conditions
Stop when simulation requires unethical deception, exposes sensitive data to unauthorized operators, or the simulated capability is too implausible to inform a real product decision.