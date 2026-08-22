# AI Context Optimization Agent

Reusable AI engineering kit for reducing unnecessary repository context loading while preserving accuracy.

## Problem
AI coding agents often waste tokens by reading unrelated files and lose reliability from missing relevant evidence.

## Workflow
Trigger -> Map Repository -> Select Evidence -> Build Context Package -> Execute -> Verify

## Components
- rules: loading and safety constraints
- subagents: ownership separation
- workflows: bounded execution
- scripts: deterministic validation

## Safety
Never expose secrets. Never edit code before required context is collected.

## Prerequisites, run, and verification

Requires Bash plus standard `find` and `head` utilities. Run against a local target repository:

```bash
bash scripts/validate-context.sh /path/to/target-repository
```

The script prints at most 50 directories within depth two and exits `0` when enumeration completes; exit `1` means the path does not exist. It is an inventory aid, not evidence that selected context is complete. Follow `workflows/context-driven-change.md`, apply `rules/context-safety.md`, and record why each loaded file is relevant plus which likely sources were intentionally excluded.
