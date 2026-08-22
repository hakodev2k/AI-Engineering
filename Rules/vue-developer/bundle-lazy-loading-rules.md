# Bundle and Lazy Loading Rules

## Purpose
Control initial download cost and avoid shipping unused or prematurely loaded frontend code.

## Scope
Bundling, tree shaking, route/component lazy loading, chunks, assets, and source maps.

## MUST
- Large new dependencies MUST be evaluated for shipped size, duplication, runtime cost, and available alternatives.
- Feature or route code not needed for initial interaction MUST be considered for lazy loading when the split improves user experience.
- Lazy-loaded failures MUST have an error/recovery strategy for critical flows.
- Production source-map exposure MUST follow the project's security and observability policy.
- Bundle changes with material impact MUST be measured in CI or reproducible build analysis.

## MUST NOT
- Entire utility/component libraries MUST NOT be imported when narrow imports are supported and materially reduce shipped code.
- Code splitting MUST NOT create excessive request fragmentation without evidence of benefit.
- Private source or secrets MUST NOT be assumed safe merely because source maps are disabled.

## SHOULD
- Establish bundle budgets for mature applications.
- Preload/prefetch only when usage probability and bandwidth impact justify it.

## Exceptions
A larger dependency may be accepted when it reduces operational risk or implementation complexity enough to justify measured cost.

## Verification
Inspect build analyzer output, chunk graphs, network waterfalls, compressed sizes, and lazy-load failure tests.