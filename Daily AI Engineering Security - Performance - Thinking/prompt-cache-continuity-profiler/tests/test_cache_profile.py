import importlib.util
from pathlib import Path

MODULE=Path(__file__).parents[1]/'scripts'/'cache_profile.py'
spec=importlib.util.spec_from_file_location('cache_profile',MODULE)
mod=importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
POLICY={'min_cached_input_ratio':0.7,'max_uncached_input_regression_ratio':0.15,'max_latency_regression_ratio':0.1,'max_quality_regression_ratio':0.0,'require_critical_context_retention':True}

def profile(hashes,cached=800,input_tokens=1000,latency=100,quality=1.0,ctx=True,key='k'):
    return {'segments':[{'name':f's{i}','sha256':h} for i,h in enumerate(hashes)],'usage':{'input_tokens':input_tokens,'cached_tokens':cached,'cache_write_tokens':0},'latency_ms':latency,'quality_score':quality,'critical_context_ok':ctx,'cache_key':key,'model':'m'}

def test_passes_stable_profile():
    p=profile(['a'*64,'b'*64]); assert mod.analyze(p,p,POLICY)['decision']=='pass'

def test_finds_earliest_divergence():
    a=profile(['a'*64,'b'*64]); b=profile(['a'*64,'c'*64]); assert mod.divergence(a,b)['index']==1

def test_detects_cache_regression():
    a=profile(['a'*64],cached=800); b=profile(['a'*64],cached=500); r=mod.analyze(b,a,POLICY); assert 'cached_input_ratio_below_threshold' in r['reasons']

def test_critical_context_loss_blocks():
    a=profile(['a'*64]); b=profile(['a'*64],ctx=False); assert 'critical_context_lost' in mod.analyze(b,a,POLICY)['reasons']

def test_quality_regression_blocks():
    a=profile(['a'*64],quality=1.0); b=profile(['a'*64],quality=0.9); assert 'quality_regression' in mod.analyze(b,a,POLICY)['reasons']
