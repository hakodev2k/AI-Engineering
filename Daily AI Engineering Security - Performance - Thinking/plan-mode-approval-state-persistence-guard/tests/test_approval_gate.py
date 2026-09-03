import unittest,importlib.util
from pathlib import Path
S=Path(__file__).resolve().parents[1]/"scripts"/"approval_gate.py"; sp=importlib.util.spec_from_file_location("m",S); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
class T(unittest.TestCase):
 def b(self): return {"mode":"plan","session_epoch":"e1","plan_hash":"p1","events":[]}
 def test_drop(self):
  d=self.b(); d["events"]=[{"type":"resume","reported_mode":"acceptEdits"}]; self.assertFalse(m.evaluate(d)["ok"])
 def test_mut(self):
  d=self.b(); d["events"]=[{"type":"action","action":"write"}]; self.assertFalse(m.evaluate(d)["ok"])
 def test_ok(self):
  d=self.b(); d["events"]=[{"type":"approval","accepted":True,"plan_hash":"p1","session_epoch":"e1","approval_id":"a1"},{"type":"action","action":"write"}]; self.assertTrue(m.evaluate(d)["ok"])
 def test_stale(self):
  d=self.b(); d["events"]=[{"type":"approval","accepted":True,"plan_hash":"old","session_epoch":"e1","approval_id":"a1"},{"type":"action","action":"write"}]; self.assertFalse(m.evaluate(d)["ok"])
 def test_change(self):
  d=self.b(); d["events"]=[{"type":"approval","accepted":True,"plan_hash":"p1","session_epoch":"e1","approval_id":"a1"},{"type":"plan_changed","plan_hash":"p2"},{"type":"action","action":"write"}]; self.assertFalse(m.evaluate(d)["ok"])
if __name__=="__main__": unittest.main()
