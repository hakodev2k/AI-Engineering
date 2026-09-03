# Research

## Topic
Multi-Interrupt Resume Addressability Gate

## Category
Thinking

## Problem
A stateful agent workflow can have multiple pending human interrupts while accepting one scalar resume value. If the runtime cannot prove which interrupt the value belongs to, resumption becomes ambiguous: one branch may consume the value while another remains pending, producing nondeterministic or unintended decisions.

## Why it matters now
LangGraph issue #8579, opened 2026-08-09, provides a self-contained reproduction on current `main`: a subgraph with two parallel interrupts returns two interrupt IDs, yet `Command(resume="ambiguous")` is accepted and delivered to one branch instead of being rejected. The report references PR #6108, which intentionally introduced rejection of arbitrary scalar resumes when multiple interrupts are pending because ordering is nondeterministic. Official LangGraph interrupt documentation instructs applications handling multiple interrupts to pair interrupt IDs with resume values.

## Affected users
Agent/workflow developers using human-in-the-loop approval, parallel subgraphs, durable execution, multi-branch review, or any runtime that resumes several pending decisions from serialized state.

## Current public evidence

### Observed evidence
1. `langchain-ai/langgraph#8579` reproduces a case where two different interrupt IDs are pending inside one subgraph task but a scalar resume is accepted; one branch consumes it and the other remains pending.
2. The issue points to `langchain-ai/langgraph#6108`, where the project explicitly added protection against scalar resume when multiple interrupts are pending because their ordering is nondeterministic.
3. Current LangGraph documentation says multiple interrupts should be resumed by pairing interrupt IDs with resume values.

### Interpretation
The safety/correctness invariant is addressability, not merely the presence of a resume value. When more than one decision is pending, a value must identify its intended interrupt. Task/subgraph nesting must not weaken that invariant.

### Proposed solution
Add a runtime-independent pre-resume gate that inventories pending interrupt IDs and rejects scalar resume when more than one unique interrupt is pending. For multi-interrupt state, accept only an ID-keyed resume map, reject unknown/duplicate IDs, preserve intentionally unresumed IDs as pending, and verify behavior across nesting boundaries.

## Existing approaches
- LangGraph interrupt IDs and `Command(resume=...)`.
- A runtime check introduced by PR #6108 for multiple pending interrupts.
- Documentation recommending ID/value pairing for multiple interrupts.
- Application-specific forms that collect several human answers before resume.

## Remaining limitations
- Validation can be scoped at the wrong task level and miss multiple interrupts nested inside one parent task/subgraph.
- A scalar value can be type-valid while semantically ambiguous.
- Applications may flatten or reorder pending interrupt state during serialization.
- Tests that cover only top-level parallel tasks can miss nested-subgraph behavior.
- A blanket requirement to resume every pending interrupt at once would unnecessarily reduce valid partial-resume workflows.

## Root-cause analysis
1. Pending-interrupt cardinality is computed from task structure instead of the effective set of interrupt IDs.
2. Resume validation assumes task identity implies decision identity.
3. Scalar resume is treated as convenience syntax without checking whether addressability is unique.
4. Nested parallelism changes where interrupts are stored and can bypass a top-level validation path.
5. Regression tests insufficiently cross product top-level/nested and single/multiple interrupts.

## Improvement opportunity
Normalize all pending interrupts into a unique ID set before resume dispatch. If cardinality is greater than one, require an explicit map keyed by interrupt ID. Allow partial addressed maps so workflows can intentionally resolve one decision while preserving others. Expose reason codes for ambiguous scalar, unknown ID, duplicate pending ID, and empty maps.

## Goal
Make every resumed human decision deterministically attributable to the intended pending interrupt across task and subgraph nesting.

## Metrics
- Ambiguous scalar resumes rejected / attempted.
- Unknown resume IDs rejected.
- Correctly addressed multi-interrupt resumes accepted.
- Nested-subgraph regression coverage.
- Unintended branch consumption incidents.
- Remaining-pending set correctness after partial resume.

## Trigger
Use before dispatching a resume command whenever durable state contains interrupts, especially with parallel branches or subgraphs.

## Inputs
Canonical list of pending interrupt objects with stable IDs and the proposed resume payload.

## Outputs
Allow/deny decision, reason code, resumed ID set, remaining ID set, and verification evidence.

## Relevant sources
- LangGraph issue #8579, opened 2026-08-09: https://github.com/langchain-ai/langgraph/issues/8579
- LangGraph PR #6108: https://github.com/langchain-ai/langgraph/pull/6108
- LangGraph interrupts documentation: https://docs.langchain.com/oss/javascript/langgraph/interrupts
