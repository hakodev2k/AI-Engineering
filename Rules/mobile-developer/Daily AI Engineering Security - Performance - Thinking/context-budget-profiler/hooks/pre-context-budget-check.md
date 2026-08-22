# Hook — Pre-Context Budget Check

## Trigger
Before merging a change that adds or materially changes static prompt, tool, skill, plugin, or project-instruction content.

## Preconditions
A baseline inventory and candidate inventory are available in the package JSON format.

## Action
Run the profiler on both inventories and compare totals. Flag any new single fragment above 1,000 estimated tokens and any total fixed-context increase above the project-defined threshold.

## Command
```bash
python scripts/context_profiler.py baseline.json > baseline-report.json
python scripts/context_profiler.py candidate.json > candidate-report.json
```

## Expected result
Both reports parse successfully, required fragments remain present, and budget growth is either within threshold or explicitly reviewed.

## Failure behavior
Invalid inventory, missing required fragments, or unexplained budget regression blocks completion. Estimated-token differences are advisory until representative task regression also passes.

## Blocks completion
Yes for missing required content or invalid input; configurable for pure budget increase.
