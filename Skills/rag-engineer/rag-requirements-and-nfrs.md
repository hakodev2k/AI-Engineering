# RAG Requirements and Non-Functional Requirements

## Purpose
Translate a knowledge-assistant goal into measurable retrieval, quality, security, reliability, latency, freshness, and cost requirements.

## When to use
Use before architecture work or when an existing RAG system lacks explicit success criteria.

## Inputs
Business goal, users, corpus, risk level, expected traffic, response-time needs, compliance constraints, budget.

## Context to inspect
Inspect user workflows, consequences of wrong answers, source ownership, existing search behavior, infrastructure constraints, and operational support model.

## Core knowledge
RAG architecture should follow requirements. Accuracy is multidimensional: retrieval coverage, grounded correctness, completeness, citation quality, and abstention. NFRs often conflict and require explicit prioritization.

## Procedure
1. Define user jobs and answerable scope.
2. Identify high-risk wrong-answer classes.
3. Define authoritative sources and freshness expectations.
4. Set retrieval and end-to-end quality targets.
5. Define citation and abstention requirements.
6. Specify authorization and data-handling constraints.
7. Set latency, availability, throughput, and recovery objectives.
8. Establish cost envelope and growth assumptions.
9. Define observability and audit requirements.
10. Record trade-offs and unresolved risks.
11. Convert requirements into acceptance tests and release gates.

## Decision points
Favor correctness and abstention over coverage in high-risk domains. Accept higher latency only where stronger retrieval/ranking produces measurable value.

## Common failure patterns
Vague goal of making a chatbot; no unsupported-query policy; no freshness SLA; security considered after indexing; latency target without corpus scale assumptions.

## Verification
Ensure every critical requirement maps to measurable evidence or a test and has an accountable owner.

## Expected output
A prioritized RAG requirement set suitable for architecture and release decisions.

## Stop conditions
Stop architecture commitment when critical scope, source authority, or security requirements remain undefined.