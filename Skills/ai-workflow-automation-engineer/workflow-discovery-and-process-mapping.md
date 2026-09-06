# Workflow Discovery and Process Mapping

## Purpose
Turn an informal business process into an evidence-based workflow model suitable for automation. The goal is to expose actors, decisions, dependencies, exceptions, data movement, controls, and failure paths before implementation.

## When to use
Use when automating a manual or partially automated process, replacing brittle scripts, or redesigning an existing workflow. Do not automate a process whose owner, outcome, or compliance boundary is unknown.

## Inputs
Business objective, stakeholder interviews, current procedures, screenshots or recordings, system inventory, sample records, SLAs, policies, incident history, and known exceptions.

## Preconditions
Identify a process owner and obtain access to representative process evidence.

## Context to inspect
Inspect actual execution traces, handoffs, queues, forms, APIs, permissions, spreadsheets, emails, and exceptions. Compare documented procedure with observed behavior.

## Core knowledge
A workflow is more than a happy path. Senior automation design models states, decision rules, side effects, retry safety, manual judgment, data ownership, and operational controls.

## Procedure
1. Define the outcome and start/end boundaries.
2. Identify actors, systems, records, and external dependencies.
3. Map the happy path in chronological order.
4. Capture every decision and its source of truth.
5. Enumerate exceptions, rework loops, timeouts, and manual escalations.
6. Mark irreversible side effects and approval gates.
7. Record data inputs, outputs, ownership, sensitivity, and retention.
8. Quantify volume, latency expectations, and peak periods.
9. Identify steps based on human judgment versus deterministic rules.
10. Validate the map with process operators and system owners.
11. Separate automation candidates from steps requiring redesign first.

## Decision points
Automate stable, repeatable rules before ambiguous judgment. Keep human review where consequences are high or evidence is insufficient. Redesign unnecessary process complexity rather than encoding it permanently.

## Common failure patterns
Automating only the happy path, trusting outdated SOPs, missing hidden spreadsheet steps, ignoring handoffs, treating email as a reliable queue, and failing to identify the true system of record.

## Verification
Walk representative normal and failure scenarios through the map with operators. Confirm every side effect, exception, and ownership boundary is represented.

## Expected output
A validated process map with states, actors, systems, data flows, decisions, exceptions, controls, and automation candidates.

## Stop conditions
Stop when the process has no accountable owner, critical rules conflict, required evidence cannot be obtained, or automating the current process would preserve a known unsafe practice.