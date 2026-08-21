# AI Context Optimization Agent

Reusable AI engineering kit for reducing unnecessary repository context loading while preserving accuracy.

## Problem
AI coding agents often waste tokens by reading unrelated files and lose reliability from missing relevant evidence.

## Workflow
Trigger -> Map Repository -> Select Evidence -> Build Context Package -> Execute -> Verify

## Components
- skills: context procedures
- rules: loading and safety constraints
- subagents: ownership separation
- workflows: bounded execution
- scripts: deterministic validation

## Safety
Never expose secrets. Never edit code before required context is collected.
