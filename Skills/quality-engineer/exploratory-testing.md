# Exploratory Testing

## Purpose
Use structured investigation to discover risks and behaviors not efficiently captured by scripted checks.

## When to use
Use for new features, uncertain domains, complex workflows, incident follow-up, and areas with weak historical coverage.

## Inputs
Product build, requirements, risk model, prior defects, telemetry, test data.

## Context to inspect
Understand users, workflows, state transitions, integrations, recent changes, and known weak areas.

## Core knowledge
Exploratory testing combines learning, test design, and execution. Charters constrain purpose without scripting every action. Evidence and reproducibility matter.

## Procedure
1. Define a risk-focused charter and time box.
2. Prepare representative personas and data.
3. Establish an oracle for expected behavior.
4. Explore boundaries, state transitions, interruptions, concurrency, and unusual sequences.
5. Vary data and environment conditions.
6. Capture observations and evidence continuously.
7. Minimize and reproduce suspected defects.
8. Separate defects, questions, and improvement ideas.
9. Convert valuable discoveries into durable regression coverage where justified.

## Decision points
Extend exploration when new high-risk information appears; stop low-yield paths when evidence stabilizes.

## Common failure patterns
Unstructured clicking, no charter, weak notes, inability to reproduce findings, and automating every discovered scenario.

## Verification
Review session notes, evidence, discovered risks, reproducible defects, and resulting coverage changes.

## Expected output
A concise exploration report with findings, evidence, risks, and follow-up actions.

## Stop conditions
Stop for destructive behavior, unauthorized production testing, or missing safe test data.