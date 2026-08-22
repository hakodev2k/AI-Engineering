# Root Cause Analysis

## Purpose
Identify the underlying business, process, data, control, or system causes of a problem so teams address the cause rather than repeatedly treating symptoms.

## When to use
Use for recurring defects, operational failures, customer complaints, process delays, data-quality incidents, and repeated workarounds.

## Inputs
Incident history, process evidence, logs or reports, stakeholder observations, defect records, metrics, and known changes.

## Preconditions
There is enough evidence to distinguish observed symptoms from assumptions.

## Context to inspect
Timeline, affected actors, process steps, data flows, recent changes, controls, upstream/downstream dependencies, and prior corrective actions.

## Core knowledge
Root cause analysis is evidence-driven. Techniques such as Five Whys, cause-and-effect diagrams, fault trees, or timeline analysis are aids, not substitutes for validating causal links.

## Procedure
1. Define the problem using observable facts and impact.
2. Separate symptoms, contributing factors, and assumed causes.
3. Build a timeline or process location for the failure.
4. Gather evidence from people, data, systems, and procedures.
5. Generate plausible causal hypotheses.
6. Test each hypothesis against evidence and counterexamples.
7. Identify systemic and enabling causes, not only the final triggering event.
8. Propose corrective options that interrupt the causal chain.
9. Assess unintended impacts and ownership.
10. Define measures to verify recurrence is reduced.

## Decision points
Use a lightweight Five Whys for simple causal chains; use structured multi-cause analysis when failures involve several systems or organizational factors.

## Common failure patterns
Stopping at human error, selecting a cause before collecting evidence, confusing correlation with causation, and closing the issue without recurrence measures.

## Verification
Confirm the proposed root cause explains the evidence and that corrective actions measurably address the causal mechanism.

## Expected output
A root-cause record containing evidence, causal factors, corrective options, owners, and verification measures.

## Stop conditions
Escalate when evidence is unavailable, investigation requires restricted production access, or suspected causes involve governance or safety decisions beyond BA authority.