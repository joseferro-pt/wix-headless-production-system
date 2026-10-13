import copy
import json
import unittest
from pathlib import Path
from jsonschema import Draft202012Validator

ROOT=Path(__file__).resolve().parents[1]
PLAN=json.loads((ROOT/"schemas/toolkit-adoption-plan-input.schema.json").read_text())
RECORD=json.loads((ROOT/"schemas/site-toolkit-adoption.schema.json").read_text())
EXAMPLE=json.loads((ROOT/"examples/toolkit-adoption.synthetic.json").read_text())

class TestDistributionSchemas(unittest.TestCase):
    def test_schema_validity(self):
        Draft202012Validator.check_schema(PLAN)
        Draft202012Validator.check_schema(RECORD)

    def test_example_input_valid(self):
        self.assertEqual(list(Draft202012Validator(PLAN).iter_errors(EXAMPLE)),[])

    def test_plan_rejects_extra_data_and_floating_pin(self):
        p=copy.deepcopy(EXAMPLE)
        p["secret"]="must-not-add"
        self.assertTrue(list(Draft202012Validator(PLAN).iter_errors(p)))
        p=copy.deepcopy(EXAMPLE)
        p["target"]["tag"]="main"
        self.assertTrue(list(Draft202012Validator(PLAN).iter_errors(p)))

    def test_site_record_requires_explicit_approval_and_verification(self):
        pin=EXAMPLE["target"]
        record={"recordVersion":1,
                "toolkit":{"repository":"https://github.com/joseferro-pt/wix-headless-production-system",**pin},
                "status":"candidate-unverified","verification":"required-live-github-check",
                "approval":"pending","siteCommit":EXAMPLE["site"]["siteCommit"]}
        v=Draft202012Validator(RECORD)
        self.assertEqual(list(v.iter_errors(record)),[])
        record["status"]="adopted-owner-recorded"
        self.assertTrue(list(v.iter_errors(record)))
        record["approval"]="approved"
        record["verification"]="operator-checked-github"
        self.assertEqual(list(v.iter_errors(record)),[])
        record["toolkit"]["components"].append("unrecognised")
        self.assertTrue(list(v.iter_errors(record)))

if __name__=="__main__":
    unittest.main()
