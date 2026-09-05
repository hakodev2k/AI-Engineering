# AI Failure Mode Classification

## Purpose
Classify incidents by the AI-specific layer most likely responsible so investigation and containment target the correct subsystem.

## When to use
Use when symptoms could originate from model behavior, prompts, retrieval, tools, data, policy controls, orchestration, providers, or conventional infrastructure.

## Inputs
Examples of bad behavior, traces, prompt/model versions, retrieval context, tool calls, deployment history, provider status, application logs.

## Preconditions
Preserve representative failing examples before changing the system.

## Context to inspect
Prompt chain, model routing, RAG pipeline, tool registry, agent state, moderation/safety layers, data pipelines, provider APIs, caches, application code.

## Core knowledge
AI incidents frequently cross boundaries. A hallucination-like symptom may be caused by stale retrieval, truncated context, model substitution, prompt regression, bad tool output, or policy routing.

## Procedure
1. Reconstruct the request path end to end.
2. Identify the first observable divergence from expected behavior.
3. Compare model input, retrieved context, tool results, and final output.
4. Check version and configuration changes.
5. Test whether failure follows model, prompt, data, user segment, or dependency.
6. Classify primary and contributing failure domains.
7. Attach evidence to each hypothesis.
8. Route specialists accordingly.
9. Keep alternate hypotheses until falsified.

## Decision points
Treat the earliest proven divergence as the leading fault domain, not the most visible downstream symptom.

## Common failure patterns
Calling all wrong answers hallucinations, blaming the model without checking context, confusing moderation rejection with model failure, and ignoring orchestration bugs.

## Verification
Reproduce the behavior while selectively holding layers constant and confirm classification explains the evidence.

## Expected output
A failure-mode classification, hypothesis ranking, and investigation owner map.

## Stop conditions
Escalate when evidence cannot distinguish safety, security, or privacy-related root causes.