"""Validate the actual WHPS-only Dependabot configuration without network access."""
import copy
from pathlib import Path
import unittest
import yaml

ROOT=Path(__file__).resolve().parents[1]
ECOSYSTEMS={"pip","github-actions","npm"}
DIRECTORIES={"pip":"/","github-actions":"/","npm":"/frontend/astro-primitives"}

def check_config(config):
    if not isinstance(config,dict) or config.get("version")!=2:
        raise ValueError("Dependabot configuration must use version 2")
    updates=config.get("updates")
    if not isinstance(updates,list) or len(updates)!=3:
        raise ValueError("Exactly three monitored ecosystems required")
    seen=set()
    for item in updates:
        if not isinstance(item,dict):
            raise ValueError("Update entries must be mappings")
        eco=item.get("package-ecosystem")
        if eco not in ECOSYSTEMS or eco in seen:
            raise ValueError("Missing duplicate or unsupported ecosystem")
        seen.add(eco)
        if item.get("directory")!=DIRECTORIES[eco]:
            raise ValueError("Unexpected dependency manifest directory")
        schedule=item.get("schedule")
        if not isinstance(schedule,dict) or schedule.get("interval")!="weekly":
            raise ValueError("Expected weekly update cadence")
        limit=item.get("open-pull-requests-limit")
        if type(limit) is not int or not 1<=limit<=5:
            raise ValueError("Pull request limit must be 1–5")
        groups=item.get("groups")
        if not isinstance(groups,dict) or len(groups)!=1:
            raise ValueError("Expected one named update group")
        group=next(iter(groups.values()))
        if not isinstance(group,dict) or group.get("patterns")!=["*"]:
            raise ValueError("Expected all-dependency matching")
        if eco=="npm" and group.get("update-types")!=["minor","patch"]:
            raise ValueError("Frontend may only group minor and patch updates")
    if seen!=ECOSYSTEMS:
        raise ValueError("Missing ecosystem")

class DependabotConfigurationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.config=yaml.safe_load((ROOT/".github/dependabot.yml").read_text(encoding="utf8"))

    def test_actual_configuration(self):
        check_config(self.config)

    def test_invalid_configurations_fail_closed(self):
        for defect in ("ecosystem","duplicate","schedule","path","group","major_group","limit"):
            with self.subTest(defect=defect):
                bad=copy.deepcopy(self.config)
                if defect=="ecosystem":
                    bad["updates"][0]["package-ecosystem"]=""
                elif defect=="duplicate":
                    bad["updates"][2]["package-ecosystem"]="pip"
                elif defect=="schedule":
                    bad["updates"][1]["schedule"]={}
                elif defect=="path":
                    bad["updates"][2]["directory"]="/clients/"
                elif defect=="group":
                    del bad["updates"][0]["groups"]
                elif defect=="major_group":
                    bad["updates"][2]["groups"]["frontend-non-major"]["update-types"]=["major"]
                else:
                    bad["updates"][1]["open-pull-requests-limit"]=0
                with self.assertRaises(ValueError):
                    check_config(bad)

if __name__=="__main__":
    unittest.main()
