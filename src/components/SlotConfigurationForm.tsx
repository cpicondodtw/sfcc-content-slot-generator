import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { ConfigForm } from "../types";
import { getInputClass } from "../utils/validation";

type Props = {
  config: ConfigForm;
  setConfig: Dispatch<SetStateAction<ConfigForm>>;
};

export default function SlotConfigurationForm({ config, setConfig }: Props) {
  const updateConfig = <K extends keyof ConfigForm>(key: K, value: ConfigForm[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle>Slot Configuration</CardTitle>
        <p className="text-sm text-slate-400">
          Section where to add the values for the setup of the content slot for category.
        </p>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slot-id">Slot ID</Label>
          <Input
            id="slot-id"
            value={config.slotId}
            placeholder="cat-grid-slot1"
            onChange={(e) => updateConfig("slotId", e.target.value)}
            className={getInputClass(config.slotId)}
          />
          <p className="text-xs text-slate-400">Slot ID identifier where the content asset will appear.</p>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="slot-context">Context</Label>
          <Input
            id="slot-context"
            value={config.context}
            placeholder="category"
            onChange={(e) => updateConfig("context", e.target.value)}
            className={getInputClass(config.context)}
          />
          <p className="text-xs text-slate-400">Set to the type of page context, such as category.</p>
        </div> */}

        <div className="space-y-2">
          {/* <Label htmlFor="slot-context-id">Context ID</Label> */}
          <Label htmlFor="slot-context-id">Category ID</Label>
          <Input
            id="slot-context-id"
            value={config.contextId}
            placeholder="AXE_Fragrance"
            onChange={(e) => updateConfig("contextId", e.target.value)}
            className={getInputClass(config.contextId)}
          />
          <p className="text-xs text-slate-400">The category or context code where this slot configuration is applied.</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-configuration-id">Configuration ID</Label>
          <Input
            id="slot-configuration-id"
            value={config.configurationId}
            placeholder="260325_25_with_100_offer_1_ff-grid_banner"
            onChange={(e) => updateConfig("configurationId", e.target.value)}
            className={getInputClass(config.configurationId)}
          />
          <p className="text-xs text-slate-400">Auto generate value from File Naming. But, user needs to add the asset name</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-description">Description</Label>
          <Textarea
            id="slot-description"
            value={config.description}
            placeholder="Rank 40 | Mar 25 - 31, 2026 @12am | 25% with 100€ | Mar 11, 2026"
            onChange={(e) => updateConfig("description", e.target.value)}
            rows={2}
            className={getInputClass(config.description)}
          />
          <p className="text-xs text-slate-400">Internal description to help identify the timing, offer, or usage of this slot setup.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slot-template">Template</Label>
          <Input
            id="slot-template"
            value={config.template}
            placeholder="slots/content/contentassetbody.isml"
            onChange={(e) => updateConfig("template", e.target.value)}
            className={getInputClass(config.template)}
          />
          <p className="text-xs text-slate-400">Template file used to render the assigned content asset.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-context">Context</Label>
          <Input
            id="slot-context"
            value={config.context}
            placeholder="category"
            onChange={(e) => updateConfig("context", e.target.value)}
            className={getInputClass(config.context)}
          />
          <p className="text-xs text-slate-400">Set to the type of page context, such as category.</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-content-asset-id">Content Asset ID</Label>
          <Input
            id="slot-content-asset-id"
            value={config.contentAssetId}
            placeholder="260325_25_with_100_offer_1_ff-grid_banner"
            onChange={(e) => updateConfig("contentAssetId", e.target.value)}
            className={getInputClass(config.contentAssetId)}
          />
          <p className="text-xs text-slate-400">Content asset that will be inserted into this slot configuration.</p>
        </div>

        {/* <div className="flex items-center justify-between rounded-2xl border p-4">
          <div className="pr-4">
            <p className="font-medium">Assigned to site</p>
            <p className="text-sm text-slate-400">Set whether the slot configuration is assigned directly to the site.</p>
          </div>
          <Switch
            checked={config.assignedToSite}
            onCheckedChange={(checked) => updateConfig("assignedToSite", checked)}
          />
        </div> */}

        <div className="flex items-center justify-between rounded-2xl border p-4 space-y-2 md:col-span-2">
          <div className="pr-4">
            <p className="font-medium">Enabled flag</p>
            <p className="text-xs text-slate-400">Turn this on to include the slot configuration as enabled in the XML.</p>
          </div>
          <Switch
            checked={config.enabledFlag}
            onCheckedChange={(checked) => updateConfig("enabledFlag", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}