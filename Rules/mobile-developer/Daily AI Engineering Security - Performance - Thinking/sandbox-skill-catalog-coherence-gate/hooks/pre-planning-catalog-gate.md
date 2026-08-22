# Hook — Pre-Planning Catalog Gate

## Trigger
Immediately before a run begins skill-dependent planning, and after any materialization/catalog rebuild.

## Preconditions
Expected eligible skills and the run's materialization generation are known; sandbox-visible path checks are available.

## Action
Export the run snapshot documented by `scripts/skill_catalog_guard.py` and run:

`python3 scripts/skill_catalog_guard.py <snapshot.json> --policy config/policy.json`

## Expected result
Exit `0` only when expected and advertised skill sets satisfy policy, all advertised entries are readable, and materialization/catalog generation metadata is present and coherent.

## Failure behavior
If the guard requests rebuild and the bounded budget remains, invoke the rebuild path in `workflows/build-verify-publish.md`. Otherwise block skill-dependent planning and preserve evidence. Never disable sandboxing or silently remove missing skills from the expected set.

## Blocks completion
Yes. Planning must not claim full capability awareness from an incoherent catalog.
