import unittest
from scripts.context_amplification_guard import evaluate

class BudgetTests(unittest.TestCase):
    def test_allow_small_dispatch(self):
        p={"parent_tokens":50000,"children":[{"name":"review","required_tokens":10000,"optional_inherited_tokens":5000,"expected_turns":2,"context_window":200000}]}
        self.assertEqual(evaluate(p)["decision"],"allow")

    def test_reduce_on_amplification(self):
        p={"parent_tokens":10000,"children":[{"name":"a","required_tokens":10000,"optional_inherited_tokens":10000,"expected_turns":2,"context_window":200000},{"name":"b","required_tokens":10000,"optional_inherited_tokens":10000,"expected_turns":2,"context_window":200000}]}
        self.assertEqual(evaluate(p,max_amplification=3.0)["decision"],"reduce-context")

    def test_block_on_context_window(self):
        p={"parent_tokens":50000,"children":[{"name":"small-model","required_tokens":150000,"optional_inherited_tokens":100000,"expected_turns":1,"context_window":200000}]}
        self.assertEqual(evaluate(p,max_child_tokens=300000)["decision"],"block-fanout")

    def test_block_required_context_loss(self):
        p={"parent_tokens":50000,"required_context_removed":True,"children":[{"name":"x","required_tokens":10000,"optional_inherited_tokens":0,"expected_turns":1,"context_window":200000}]}
        self.assertEqual(evaluate(p)["decision"],"block-fanout")

    def test_invalid_rejected(self):
        with self.assertRaises(ValueError):
            evaluate({"parent_tokens":0,"children":[]})

if __name__=="__main__": unittest.main()
