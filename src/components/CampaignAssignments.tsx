import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Wand2 } from "lucide-react";
import type { Assignment, ConfigForm } from "../types";
import { getInputClass } from "../utils/validation";

const RANK_OPTIONS = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];

type Props = {
  assignments: Assignment[];
  setAssignments: Dispatch<SetStateAction<Assignment[]>>;
  config: ConfigForm;
};

function createAssignmentId() {
  if (
    typeof globalThis !== "undefined" &&
    "crypto" in globalThis &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function defaultAssignment(config: ConfigForm): Assignment {
  return {
    id: createAssignmentId(),
    slotId: config.slotId,
    context: config.context,
    contextId: "",
    configurationId: config.configurationId,
    campaignId: "",
    rank: "",
  };
}

export default function CampaignAssignments({
  assignments,
  setAssignments,
  config,
}: Props) {
  const updateAssignment = <K extends Exclude<keyof Assignment, "id">>(
    id: string,
    key: K,
    value: Assignment[K],
  ) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const addAssignment = () => {
    setAssignments((prev) => [...prev, defaultAssignment(config)]);
  };

  const removeAssignment = (id: string) => {
    setAssignments((prev) => {
      if (prev.length <= 1) {
        return prev;
      }

      return prev.filter((item) => item.id !== id);
    });
  };

  const applyConfigToAssignments = () => {
    setAssignments((prev) =>
      prev.map((item) => ({
        ...item,
        slotId: config.slotId,
        context: config.context,
        configurationId: config.configurationId,
      })),
    );
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle>Campaign Assignments</CardTitle>
            <p className="text-sm text-slate-400">
              Section which campaign the content asset will be added to.
            </p>
            {/* <p className="text-xs text-slate-400">
              Add one or more campaign assignments for this slot configuration pair.
            </p> */}
          </div>

          {/* <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={applyConfigToAssignments}>
              <Wand2 className="mr-2 h-4 w-4" />
              Sync shared fields
            </Button>
            <Button onClick={addAssignment}>
              <Plus className="mr-2 h-4 w-4" />
              Add assignment
            </Button>
          </div> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {assignments.map((item, index) => (
          <div key={item.id} className="rounded-2xl border p-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">Campaign Assignment {index + 1}</h3>
                <p className="text-xs text-slate-400">
                  Link this slot configuration to a campaign and define its rank.
                </p>
              </div>

              {assignments.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeAssignment(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`assignment-campaign-id-${item.id}`}>Campaign ID</Label>
                <Input
                  id={`assignment-campaign-id-${item.id}`}
                  value={item.campaignId}
                  placeholder="shiseido_fr_f&f_offer_1_26"
                  onChange={(e) => updateAssignment(item.id, "campaignId", e.target.value)}
                  className={getInputClass(item.campaignId)}
                />
                <p className="text-xs text-slate-400">Campaign that this content asset should be assigned to.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`assignment-rank-${item.id}`}>Rank</Label>
                <select
                  id={`assignment-rank-${item.id}`}
                  value={item.rank}
                  onChange={(e) => updateAssignment(item.id, "rank", e.target.value)}
                  className={`h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm ${getInputClass(item.rank)}`}
                >
                  <option value="">Select rank</option>
                  {RANK_OPTIONS.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400">Display priority for this campaign assignment.</p>
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor={`assignment-slot-id-${item.id}`}>Slot ID</Label>
                <Input
                  id={`assignment-slot-id-${item.id}`}
                  value={item.slotId}
                  placeholder="cat-grid-slot1"
                  onChange={(e) => updateAssignment(item.id, "slotId", e.target.value)}
                  className={getInputClass(item.slotId)}
                />
                <p className="text-xs text-slate-400">Should match the slot ID used in the slot configuration above.</p>
              </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor={`assignment-context-${item.id}`}>Context</Label>
                <Input
                  id={`assignment-context-${item.id}`}
                  value={item.context}
                  placeholder="category"
                  onChange={(e) => updateAssignment(item.id, "context", e.target.value)}
                  className={getInputClass(item.context)}
                />
                <p className="text-xs text-slate-400">Usually the same context as the slot configuration.</p>
              </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor={`assignment-context-id-${item.id}`}>Category ID</Label>
                <Input
                  id={`assignment-context-id-${item.id}`}
                  value={item.contextId}
                  placeholder="AXE_Makeup"
                  onChange={(e) => updateAssignment(item.id, "contextId", e.target.value)}
                  className={getInputClass(item.contextId)}
                />
                <p className="text-xs text-slate-400">Target category or context code for this specific campaign assignment.</p>
              </div> */}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`assignment-configuration-id-${item.id}`}>Configuration ID</Label>
                <Input
                  id={`assignment-configuration-id-${item.id}`}
                  value={item.configurationId}
                  placeholder="260325_25_with_100_offer_1_ff-grid_banner"
                  onChange={(e) => updateAssignment(item.id, "configurationId", e.target.value)}
                  className={getInputClass(item.configurationId)}
                />
                <p className="text-xs text-slate-400">Should match the configuration ID used in the slot configuration above.</p>
              </div>

              
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
