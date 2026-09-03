import unittest,importlib.util
from pathlib import Path
S=Path(__file__).resolve().parents[1]/"scripts"/"resume_gate.py"; sp=importlib.util.spec_from_file_location("m",S); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
class T(unittest.TestCase):
 def test_scalar(self): self.assertEqual(m.evaluate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":"yes"})["reason"],"ambiguous_scalar_resume")
 def test_map(self): self.assertTrue(m.evaluate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":{"a":"yes","b":"no"}})["ok"])
 def test_partial(self): self.assertEqual(m.evaluate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":{"a":"yes"}})["remaining_ids"],["b"])
 def test_unknown(self): self.assertFalse(m.evaluate({"pending_interrupts":[{"id":"a"},{"id":"b"}],"resume":{"z":"yes"}})["ok"])
 def test_dup(self): self.assertEqual(m.evaluate({"pending_interrupts":[{"id":"a"},{"id":"a"}],"resume":{"a":"yes"}})["reason"],"duplicate_interrupt_id")
if __name__=="__main__": unittest.main()
