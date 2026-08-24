import importlib.util, pathlib, unittest

P = pathlib.Path(__file__).parents[1] / "scripts" / "convergence_check.py"
spec = importlib.util.spec_from_file_location("cc", P)
cc = importlib.util.module_from_spec(spec); spec.loader.exec_module(cc)
BASE={"session_id":"s1","surface":"canonical","canonical_version":7,"last_durable_turn":12,"selected_child_id":"c2","active_writer_id":None,"writer_lease_expires_at":None,"registration_epoch":4,"captured_at":"2026-08-24T20:00:00+07:00"}

class TestConvergence(unittest.TestCase):
    def test_matching(self): self.assertEqual(cc.compare(BASE, dict(BASE, surface="desktop")), [])
    def test_stale_version_turn(self):
        mm=cc.compare(BASE, dict(BASE, surface="mobile", canonical_version=6, last_durable_turn=10))
        self.assertIn("canonical_version", mm); self.assertIn("last_durable_turn", mm)
    def test_child_drift(self): self.assertIn("selected_child_id", cc.compare(BASE, dict(BASE, surface="desktop", selected_child_id="c1")))
    def test_registration_drift(self): self.assertIn("registration_epoch", cc.compare(BASE, dict(BASE, surface="web", registration_epoch=3)))

if __name__ == "__main__": unittest.main()