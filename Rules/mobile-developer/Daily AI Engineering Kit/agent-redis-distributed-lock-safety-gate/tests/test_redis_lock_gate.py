import importlib.util
import pathlib

MODULE = pathlib.Path(__file__).parents[1] / 'scripts' / 'redis_lock_gate.py'
spec = importlib.util.spec_from_file_location('redis_lock_gate', MODULE)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class FakeRedis:
    def __init__(self):
        self.values={}; self.fence=0; self.ttl={}
    def eval(self, script, nkeys, *args):
        if script == mod.FENCE_LUA:
            key,fence_key,owner,lease=args
            self.fence += 1
            if key in self.values: return 0
            self.values[key]=f'{owner}:{self.fence}'; self.ttl[key]=int(lease); return self.fence
        key=args[0]
        if script == mod.RELEASE_LUA:
            expected=args[1]
            if self.values.get(key)==expected:
                del self.values[key]; return 1
            return 0
        if script == mod.RENEW_LUA:
            expected,lease=args[1],args[2]
            if self.values.get(key)==expected:
                self.ttl[key]=int(lease); return 1
            return 0
        raise AssertionError('unknown script')

def test_owner_cannot_release_another_owner_lock():
    r=FakeRedis(); owner,fence=mod.acquire(r,'lock:a',30000,0,[1])
    assert mod.release(r,'lock:a','wrong',fence) is False
    assert 'lock:a' in r.values
    assert mod.release(r,'lock:a',owner,fence) is True

def test_fencing_token_increases_between_holders():
    r=FakeRedis(); o1,f1=mod.acquire(r,'lock:a',30000,0,[1]); assert mod.release(r,'lock:a',o1,f1)
    o2,f2=mod.acquire(r,'lock:a',30000,0,[1])
    assert o1 != o2 and f2 > f1

def test_wrong_owner_cannot_renew():
    r=FakeRedis(); owner,fence=mod.acquire(r,'lock:a',30000,0,[1])
    assert mod.renew(r,'lock:a','wrong',fence,60000) is False
    assert mod.renew(r,'lock:a',owner,fence,60000) is True
    assert r.ttl['lock:a'] == 60000
