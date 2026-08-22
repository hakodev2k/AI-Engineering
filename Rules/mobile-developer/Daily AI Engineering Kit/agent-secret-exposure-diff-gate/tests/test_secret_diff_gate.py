import importlib.util
from pathlib import Path

MODULE=Path(__file__).resolve().parents[1]/'scripts'/'secret_diff_gate.py'
spec=importlib.util.spec_from_file_location('secret_diff_gate',MODULE)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)

def test_entropy_low_for_repetition():
    assert mod.entropy('aaaaaaaaaaaaaaaaaaaa') == 0.0

def test_entropy_higher_for_varied_token():
    assert mod.entropy('Ab3dEf7hJk9Lm2Np4Qr6') > 3.5

def test_sha256_is_stable_and_redacted():
    h=mod.sha256('example-secret-value')
    assert len(h)==64
    assert 'example-secret-value' not in h

def test_ignored_matches_glob():
    assert mod.ignored('node_modules/pkg/a.js',['node_modules/**'])
    assert not mod.ignored('src/a.js',['node_modules/**'])

def test_allowlist_requires_exact_path_pattern_and_hash():
    item={'path':'a.txt','pattern_id':'p','value_hash':'abc'}
    assert mod.is_allowed(item,[{'path':'a.txt','pattern_id':'p','value_hash':'abc'}])
    assert not mod.is_allowed(item,[{'path':'b.txt','pattern_id':'p','value_hash':'abc'}])
