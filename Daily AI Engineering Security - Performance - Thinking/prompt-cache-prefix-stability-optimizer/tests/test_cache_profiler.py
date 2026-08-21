import importlib.util
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "cache_profiler.py"
spec = importlib.util.spec_from_file_location("profiler", MODULE)
profiler = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(profiler)


def row(dynamic, cached, quality=True, latency=100):
    return {
        "segments": [
            {"name":"system","content":"stable system","expected_stable":True},
            {"name":"tools","content":"stable tools","expected_stable":True},
            {"name":"request","content":dynamic,"expected_stable":False},
        ],
        "input_tokens":1000,
        "cached_tokens":cached,
        "latency_ms":latency,
        "quality_ok":quality,
    }


def test_profile_detects_cache_ratio_and_dynamic_divergence():
    p=profiler.profile([row("a",700),row("b",700)])
    assert p["mean_cached_input_ratio"] == 0.7
    assert p["first_divergence"]["reference"] == "request"
    assert p["expected_stable_hash_variants"] == {}


def test_profile_detects_unstable_expected_stable_segment():
    a=row("a",500); b=row("b",500); b["segments"][1]["content"]="tools reordered"
    p=profiler.profile([a,b])
    assert p["expected_stable_hash_variants"]["tools"] == 2


def test_compare_passes_improved_candidate():
    base=profiler.profile([row(str(i),300,True,120) for i in range(5)])
    cand=profiler.profile([row(str(i),800,True,90) for i in range(5)])
    thresholds={"minimum_comparable_samples":5,"minimum_cached_input_ratio":0.6,"maximum_quality_regression_rate":0.01,"maximum_latency_regression_ratio":0.05,"stable_segment_hash_variants_allowed":1,"require_quality_evidence":True}
    assert profiler.compare(base,cand,thresholds)["decision"] == "pass"


def test_compare_fails_quality_regression():
    base=profiler.profile([row(str(i),300,True) for i in range(5)])
    cand=profiler.profile([row(str(i),800,i<4) for i in range(5)])
    thresholds={"minimum_comparable_samples":5,"minimum_cached_input_ratio":0.6,"maximum_quality_regression_rate":0.01,"stable_segment_hash_variants_allowed":1,"require_quality_evidence":True}
    result=profiler.compare(base,cand,thresholds)
    assert result["decision"] == "fail"
    assert any("quality" in r for r in result["reasons"])
