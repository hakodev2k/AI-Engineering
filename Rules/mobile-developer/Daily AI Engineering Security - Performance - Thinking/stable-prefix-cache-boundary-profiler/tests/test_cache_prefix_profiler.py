import importlib.util
import json
from pathlib import Path

SCRIPT = Path(__file__).parents[1] / "scripts" / "cache_prefix_profiler.py"
spec = importlib.util.spec_from_file_location("cache_prefix_profiler", SCRIPT)
module = importlib.util.module_from_spec(spec)
assert spec and spec.loader
spec.loader.exec_module(module)


def sample(content_tail: str, cached: int = 800, writes: int = 100):
    return {
        "prefix_parts": [
            {"name": "system-policy", "content": "fixed"},
            {"name": "tools", "content": ["a", "b"]},
            {"name": "volatile-user", "content": content_tail},
        ],
        "input_tokens": 1000,
        "cached_tokens": cached,
        "cache_write_tokens": writes,
        "latency_ms": 100,
        "quality_pass": True,
    }


def test_finds_first_unstable_component():
    report = module.analyze([sample("x"), sample("y"), sample("z")])
    assert report["stable_prefix_component_count"] == 2
    assert report["earliest_unstable_component"]["position"] == 2
    assert report["earliest_unstable_component"]["names"] == ["volatile-user"]


def test_usage_ratios_are_aggregated():
    report = module.analyze([sample("x"), sample("x"), sample("x")])
    assert report["usage"]["cached_ratio"] == 0.8
    assert report["usage"]["cache_write_ratio"] == 0.1
    assert report["usage"]["quality_pass_rate"] == 1.0


def test_policy_rejects_insufficient_cache_ratio():
    report = module.analyze([sample("x", cached=200), sample("x", cached=200), sample("x", cached=200)])
    failures = module.evaluate(
        report,
        {
            "minimum_samples": 3,
            "minimum_cached_ratio": 0.8,
            "maximum_cache_write_ratio": 0.2,
            "require_quality_pass": True,
        },
    )
    assert any("cached_ratio" in failure for failure in failures)


def test_load_traces_rejects_missing_parts(tmp_path):
    path = tmp_path / "bad.jsonl"
    path.write_text(json.dumps({"input_tokens": 3}) + "\n", encoding="utf-8")
    try:
        module.load_traces(path)
        assert False, "expected ValueError"
    except ValueError as exc:
        assert "prefix_parts" in str(exc)
