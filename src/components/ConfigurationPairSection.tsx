import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ConfigurationPair } from "../types";
import CampaignAssignments from "./CampaignAssignments";
import SlotConfigurationForm from "./SlotConfigurationForm";

type Props = {
  pair: ConfigurationPair;
  index: number;
  canRemove: boolean;
  onRemove: (pairId: string) => void;
  onUpdateConfig: (pairId: string, nextConfig: ConfigurationPair["config"]) => void;
  onUpdateAssignments: (pairId: string, nextAssignments: ConfigurationPair["assignments"]) => void;
};

export default function ConfigurationPairSection({
  pair,
  index,
  canRemove,
  onRemove,
  onUpdateConfig,
  onUpdateAssignments,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Slot &amp; Campaign Configuration {index + 1}</h2>
          <p className="text-sm text-slate-500">
            One slot configuration with its related campaign assignments.
          </p>
        </div>

        {canRemove && (
          <Button variant="ghost" size="icon" onClick={() => onRemove(pair.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <SlotConfigurationForm
        config={pair.config}
        setConfig={(updater) => {
          const nextConfig = typeof updater === "function" ? updater(pair.config) : updater;
          onUpdateConfig(pair.id, nextConfig);
        }}
      />

      <CampaignAssignments
        assignments={pair.assignments}
        setAssignments={(updater) => {
          const nextAssignments =
            typeof updater === "function" ? updater(pair.assignments) : updater;
          onUpdateAssignments(pair.id, nextAssignments);
        }}
        config={pair.config}
      />
    </div>
  );
}