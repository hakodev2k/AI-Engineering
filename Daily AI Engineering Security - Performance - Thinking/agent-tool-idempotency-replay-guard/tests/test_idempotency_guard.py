#!/usr/bin/env python3
from __future__ import annotations
import importlib.util
import json
import tempfile
import threading
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SPEC=importlib.util.spec_from_file_location("guard", ROOT/"scripts"/"idempotency_guard.py")
guard=importlib.util.module_from_spec(SPEC); SPEC.loader.exec_module(guard)

class GuardTests(unittest.TestCase):
    def test_key_stable_across_json_order(self):
        a=guard.operation_key("t","wf","pay","order-1",{"amount":10,"currency":"USD"})
        b=guard.operation_key("t","wf","pay","order-1",{"currency":"USD","amount":10})
        self.assertEqual(a,b)

    def test_tenant_changes_key(self):
        a=guard.operation_key("a","wf","pay","order-1",{"amount":10})
        b=guard.operation_key("b","wf","pay","order-1",{"amount":10})
        self.assertNotEqual(a,b)

    def test_completed_reuse(self):
        with tempfile.TemporaryDirectory() as d:
            db=guard.connect(str(Path(d)/"x.db")); key="k"
            self.assertEqual("owner",guard.reserve(db,key,"a",30)["status"])
            guard.complete(db,key,"a",{"ok":True},"provider-1")
            hit=guard.reserve(db,key,"b",30)
            self.assertEqual("completed",hit["status"])
            self.assertEqual({"ok":True},hit["result"])

    def test_unknown_blocks_new_execution(self):
        with tempfile.TemporaryDirectory() as d:
            db=guard.connect(str(Path(d)/"x.db")); key="k"
            guard.reserve(db,key,"a",30); guard.mark_unknown(db,key,"a")
            self.assertEqual("unknown",guard.reserve(db,key,"b",30)["status"])

    def test_concurrent_reservation_has_one_owner(self):
        with tempfile.TemporaryDirectory() as d:
            path=str(Path(d)/"x.db"); key="same"; barrier=threading.Barrier(12); statuses=[]; lock=threading.Lock()
            def worker(i):
                db=guard.connect(path); barrier.wait(); s=guard.reserve(db,key,f"w{i}",30)["status"]
                with lock: statuses.append(s)
            ts=[threading.Thread(target=worker,args=(i,)) for i in range(12)]
            [t.start() for t in ts]; [t.join() for t in ts]
            self.assertEqual(1,statuses.count("owner"))
            self.assertEqual(11,statuses.count("in_progress"))

    def test_registry_requires_write_identity(self):
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/"r.json"; p.write_text(json.dumps({"tools":[{"name":"x","effect":"non-idempotent-write","businessIdentityFields":[]}]}),encoding="utf-8")
            self.assertTrue(guard.validate_registry(str(p)))

if __name__ == "__main__": unittest.main(verbosity=2)
