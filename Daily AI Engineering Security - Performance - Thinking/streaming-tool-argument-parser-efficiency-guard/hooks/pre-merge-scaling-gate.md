# Hook — Pre-Merge Scaling Gate

## Trigger
Any change touching streamed tool-call argument accumulation, partial JSON parsing/repair, provider adapters, preview materialization, or final tool dispatch.

## Preconditions
Python 3 is available and the benchmark script is unchanged or its change is separately reviewed.

## Action
Run:

`python3 scripts/stream_arg_bench.py --sizes 4096,16384,65536,262144 --chunk-size 128 --repeats 3`

Then run:

`python3 tests/test_stream_arg_bench.py`

For a production parser, run the same payload/chunk matrix against the implementation before and after the change and archive both outputs.

## Expected result
Exit 0, `semantic_equivalence: true`, no scaling violations for the reference final-parse path, regression tests PASS, and production before/after evidence demonstrates the claimed improvement.

## Failure behavior
Exit 1 blocks merge for scaling regression. Exit 2 blocks merge for invalid benchmark input or semantic mismatch. Any malformed/truncated input accepted for execution also blocks merge.

## Blocking
Yes for parser-path changes. Performance claims without baseline/post-change evidence are not complete.
