# Roadmap and Platform Investment

## Purpose
Balance customer-facing roadmap work with platform, infrastructure, and internal engineering investments based on measurable constraints and strategic leverage.

## When to use
Use when platform requests compete with product work, shared capabilities are repeatedly rebuilt, or foundational constraints limit multiple teams.

## Inputs
Product roadmap, dependency patterns, developer experience data, reliability issues, architecture constraints, platform consumers, costs, and strategic goals.

## Context to inspect
Inspect repeated duplicated work, common operational pain, consumer demand, adoption barriers, current platform ownership, and whether proposed abstractions are mature enough to standardize.

## Core knowledge
Platforms are internal products. Their value comes from reducing cognitive load and repeated work for consumers. Premature platforms can institutionalize the wrong abstraction and create central bottlenecks.

## Procedure
1. Identify repeated constraints affecting multiple teams.
2. Quantify current cost, delay, risk, or duplicated effort.
3. Identify target consumers and their jobs to be done.
4. Compare platform investment with simpler standards, libraries, automation, or local solutions.
5. Define a thin self-service capability with measurable adoption value.
6. Assign product-like ownership, support, reliability, and documentation.
7. Pilot with representative consumers.
8. Measure adoption, lead-time reduction, reliability, and support burden.
9. Expand only when evidence supports shared abstraction.
10. Retire platform capabilities that no longer justify ownership cost.

## Decision points
Centralize capabilities with strong commonality and economies of scale; keep domain-specific logic with stream teams. Avoid mandatory adoption until the paved road is genuinely easier and safer.

## Common failure patterns
Platform by mandate, no consumer discovery, ticket-queue platforms, abstraction before repeated need, hidden migration cost, and platform success measured by features shipped.

## Verification
Verify target consumers gain measurable benefit, self-service works, operational ownership exists, adoption is evidence-driven, and total organizational cost decreases.

## Expected output
A platform investment decision with consumer outcomes, scope, adoption plan, measures, and exit criteria.

## Stop conditions
Stop when no repeated consumer need exists, ownership cannot be sustained, or mandatory standardization would create more coupling than value.