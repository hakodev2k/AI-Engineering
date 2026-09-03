# Research

## Topic
LangGraph Interrupt Resume Addressing Guard

## Category
Thinking

## Problem
Human-in-the-loop and multi-branch agent workflows can resume the wrong pending interrupt, or interpret an ordinary dictionary response as an interrupt-ID map, when resume addressing is ambiguous. The result is not just a runtime error: a human approval or answer can be associated with the wrong branch while the workflow continues.

## Why it matters now
Two recent LangGraph issues expose separate failure modes in resume semantics on current releases/main. Issue #8579 (2026-08-09) shows a scalar resume being accepted when two child interrupts are pending inside one subgraph task, despite the intended rule that multiple pending interrupts require ID-addressed values. Issue #8693 (2026-08-23) shows an ordinary dictionary resume value being misclassified as an interrupt map. These are current, independently reported failures around the same overloaded resume boundary.

## Affected users
Teams building approval workflows, human-in-the-loop agents, nested/subgraph orchestration, parallel review flows, stateful LangGraph applications, and platforms that programmatically translate UI responses into `Command(resume=...)`.

## Current public evidence

### Observed evidence
1. LangGraph issue #8579 reproduces on current `main` and LangGraph 1.2.10. Two different interrupt IDs are produced by parallel child nodes, but a scalar `Command(resume="ambiguous")` is accepted and delivered to one branch while the other remains pending. The report notes that PR #6108 was intended to reject scalar resume when multiple interrupts are pending because ordering is nondeterministic.
2. LangGraph issue #8693, opened 2026-08-23, reports that ordinary dictionary resume values can be interpreted as interrupt-ID mappings. This matters because official docs allow any JSON-serializable value as a resume value, including objects.
3. Current LangGraph documentation says that when parallel branches interrupt simultaneously, callers should map each interrupt ID to its resume value so each response is paired with the correct interrupt. The same docs also state that resume payloads may be arbitrary JSON-serializable values.
4. Current docs warn that nodes restart from the beginning on resume and that multiple interrupt calls are matched using persisted resume state/order, increasing the consequence of an incorrectly addressed response.

### Interpretation
The root problem is an overloaded resume representation combined with incomplete accounting of pending interrupt identities. The caller needs an explicit addressing contract independent of payload type and graph nesting. A dictionary should not implicitly mean "ID map," and a scalar should not be accepted when the pending set makes association ambiguous.

### Proposed solution
Introduce a pre-resume guard with a discriminated envelope. `kind=by_id` explicitly maps interrupt IDs to values; `kind=scalar` explicitly carries an arbitrary JSON value, including dictionaries. The guard inventories all pending interrupt IDs, detects duplicates/unknown IDs, rejects scalar mode when more than one interrupt is pending, optionally requires all pending IDs to be resolved in one call, and records deterministic evidence before invoking the graph.

## Existing approaches
- Use LangGraph `Command(resume=...)` directly.
- For parallel interrupts, follow docs and pass an interrupt-ID-to-value mapping.
- Depend on framework validation added by PR #6108.
- Avoid complicated parallel/nested interrupt structures.
- Add UI/application-specific checks before resume.

## Remaining limitations
- Framework validation can miss multiple interrupts grouped under one parent task (#8579).
- Payload shape is overloaded: dictionaries are valid application values but can also look like ID maps (#8693).
- UI adapters may discard interrupt IDs and retain only display text.
- Nested subgraphs can hide the actual cardinality of pending interrupts from application code.
- Partial resumes can be intentional or accidental; applications need an explicit policy.
- A runtime exception after a bad resume is weaker than preventing ambiguous association before execution.

## Root-cause analysis
1. Resume transport conflates payload data with addressing metadata.
2. Pending-interrupt enumeration may operate at task granularity rather than flattened interrupt-ID granularity.
3. Callers often reason from visible prompt order instead of durable interrupt identity.
4. Nested graphs create multiple execution namespaces but UI adapters frequently flatten them.
5. Verification is usually success-oriented: "graph continued" rather than "the intended interrupt received this exact response."

## Improvement opportunity
Standardize a framework-agnostic, discriminated resume envelope and deterministic preflight. Preserve exact interrupt IDs from runtime to UI and back. Reject unknown, duplicate, stale, or ambiguous addressing before invoking the graph. Measure association coverage and unresolved interrupt count after resume.

## Problem / Gap / Goal
- **Problem:** responses can be routed to the wrong or unintended pending interrupt.
- **Gap:** existing framework behavior and application adapters do not always make addressing explicit or verify complete pending-ID inventory.
- **Goal:** every resume is unambiguously associated with durable interrupt identity before workflow execution continues.

## Metrics
- ambiguous resume attempts blocked
- unknown/stale interrupt IDs blocked
- duplicate pending IDs detected
- percentage of multi-interrupt resumes using explicit ID mapping
- expected-vs-actual resolved ID coverage
- unresolved interrupt count after an intended complete resume
- regression test pass rate

## Trigger
Use before every programmatic resume in workflows that can contain nested, parallel, concurrent, or externally persisted interrupts; also use after LangGraph upgrades affecting interrupt/checkpoint semantics.

## Inputs
Flattened pending interrupt IDs, discriminated resume envelope, policy, thread/checkpoint identity, and optional expected completion mode.

## Outputs
Allow/block decision, normalized framework resume payload, addressed IDs, unresolved IDs, evidence record, and failure reason.

## Relevant sources
- LangGraph issue #8579, opened 2026-08-09: https://github.com/langchain-ai/langgraph/issues/8579
- LangGraph issue #8693, opened 2026-08-23: https://github.com/langchain-ai/langgraph/issues/8693
- LangGraph interrupts documentation: https://docs.langchain.com/oss/python/langgraph/interrupts
- LangGraph multiple-interrupt documentation: https://langchain-ai.github.io/langgraph/how-tos/human_in_the_loop/breakpoints/
- Related validation PR #6108: https://github.com/langchain-ai/langgraph/pull/6108
