import importlib.util
from pathlib import Path

P=Path(__file__).parents[1]/'scripts/validate-url.py'
spec=importlib.util.spec_from_file_location('validator', P); v=importlib.util.module_from_spec(spec); spec.loader.exec_module(v)

def test_block_private_ipv4(): assert v.blocked('127.0.0.1',['127.0.0.0/8'])
def test_block_link_local(): assert v.blocked('169.254.169.254',['169.254.0.0/16'])
def test_block_private_ipv6(): assert v.blocked('fc00::1',['fc00::/7'])
def test_public_not_blocked(): assert not v.blocked('8.8.8.8',['10.0.0.0/8','127.0.0.0/8'])
def test_policy_loads():
    p=v.load_policy(Path(__file__).parents[1]/'config/policy.yaml')
    assert p['mode']=='enforce' and p['max_redirects']==0 and p['allowed_schemes']==['https']
