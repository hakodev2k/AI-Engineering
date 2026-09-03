import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "liveness_watchdog.py"
spec = importlib.util.spec_from_file_location("liveness_watchdog", SCRIPT)
mod = importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(mod)

CFG = {
    "cpu_threshold_percent": 85.0,
    "required_consecutive_high_cpu_samples": 3,
    "max_progress_age_seconds": 30,
    "post_resume_grace_seconds": 15,
    "max_restart_attempts": 2,
    "restart_requires_stale_progress": True,
}

class WatchdogTests(unittest.TestCase):
    def test_restart_for_hot_stale_process(self):
        state = {"samples":[{"timestamp":100,"cpu_percent":90},{"timestamp":105,"cpu_percent":92},{"timestamp":110,"cpu_percent":95}],"last_progress_timestamp":70,"restart_attempts":0}
        self.assertEqual(mod.analyze(CFG,state)["status"], "restart_recommended")

    def test_high_cpu_with_progress_is_only_suspect(self):
        state = {"samples":[{"timestamp":100,"cpu_percent":90},{"timestamp":105,"cpu_percent":92},{"timestamp":110,"cpu_percent":95}],"last_progress_timestamp":109}
        self.assertEqual(mod.analyze(CFG,state)["status"], "suspect")

    def test_grace_prevents_restart(self):
        state = {"samples":[{"timestamp":100,"cpu_percent":99},{"timestamp":105,"cpu_percent":99},{"timestamp":110,"cpu_percent":99}],"last_progress_timestamp":0,"resume_timestamp":100}
        result = mod.analyze(CFG,state)
        self.assertEqual(result["status"], "healthy")
        self.assertEqual(result["reason"], "post_resume_grace")

    def test_restart_budget_exhaustion_blocks_loop(self):
        state = {"samples":[{"timestamp":100,"cpu_percent":90},{"timestamp":105,"cpu_percent":90},{"timestamp":110,"cpu_percent":90}],"last_progress_timestamp":0,"restart_attempts":2}
        result = mod.analyze(CFG,state)
        self.assertEqual(result["status"], "suspect")
        self.assertEqual(result["reason"], "restart_budget_exhausted")

    def test_normal_process_healthy(self):
        state = {"samples":[{"timestamp":100,"cpu_percent":1},{"timestamp":105,"cpu_percent":2},{"timestamp":110,"cpu_percent":1}],"last_progress_timestamp":108}
        self.assertEqual(mod.analyze(CFG,state)["status"], "healthy")

if __name__ == "__main__":
    unittest.main()
