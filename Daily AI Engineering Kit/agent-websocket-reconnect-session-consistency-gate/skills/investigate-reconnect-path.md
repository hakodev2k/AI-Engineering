# Skill: Investigate Reconnect Path

## Purpose
Map the complete reconnect state machine before changes are made.

## When to use
Before fixing reconnect loops, duplicate subscriptions, replay gaps, stale sessions, heartbeat disconnects, or event loss after reconnection.

## Inputs
Repository root, incident/test symptom, client/server protocol notes, available traces/logs.

## Preconditions
Relevant connection code is readable and the symptom can be described with observable behavior.

## Required context
Start with connection factory/entry point, reconnect scheduler, event handlers, subscription registry, authentication/session code, replay/sequence checkpointing, and nearby tests. Expand only where references lead.

## Allowed tools
Repository search/read, tests, logs/traces, local debugger, non-production protocol client.

## Constraints
Do not modify production state or weaken security controls.

## Procedure
1. Identify connection creation and shutdown entry points.
2. Trace state transitions: idle → connecting → connected → application-ready → disconnected → reconnecting.
3. Locate all reconnect timers/tasks and cancellation paths.
4. Locate subscription registry ownership and restoration code.
5. Locate session/authentication restoration.
6. Locate sequence/replay checkpoints and determine reset/resume semantics.
7. Find heartbeat and timeout interactions.
8. Find tests covering disconnect timing windows.
9. Collect one trace showing the defect.
10. Separate facts, hypotheses, decisions, evidence, and open questions.
11. Produce one bounded fix hypothesis at a time.

## Expected output
State map, affected files, evidence, defect hypothesis, risk, recommended test scenario.

## Verification
Every claimed reconnect transition must cite repository code, trace evidence, or test output.

## Failure handling
If session/replay semantics are undocumented and cannot be inferred from server behavior/tests, mark blocked instead of guessing.

## Stop conditions
Stop before production traffic replay, secret access, or protocol-breaking changes requiring approval.
