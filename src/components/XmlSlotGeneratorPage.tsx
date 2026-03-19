import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import type { Assignment, ConfigForm, ConfigurationPair, FileNamingForm } from "../types";
import { sanitizeFileNamePart } from "../utils/fileName";
import { buildFullXml } from "../utils/xml";
import ConfigurationPairSection from "./ConfigurationPairSection";
import FileNamingSection from "./FileNamingSection";
import XmlPreviewCard from "./XmlPreviewCard";

function createId(prefix: string) {
  if (
    typeof globalThis !== "undefined" &&
    "crypto" in globalThis &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  return `${yyyy}${mm}${dd}`;
}

function buildConfigurationId(date: string, campaignName: string, contextId: string) {
  const cleanDate = date.trim();

  const cleanCampaignName = campaignName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const cleanContextId = contextId
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return [cleanDate, cleanCampaignName, cleanContextId].filter(Boolean).join("_");
}

function createDefaultConfig(): ConfigForm {
  return {
    slotId: "",
    context: "category",
    contextId: "",
    configurationId: "",
    assignedToSite: false,
    description: "",
    template: "slots/content/contentassetbody.isml",
    enabledFlag: true,
    contentAssetId: "",
  };
}

function createDefaultAssignment(config?: ConfigForm): Assignment {
  return {
    id: createId("assignment"),
    slotId: config?.slotId ?? "",
    context: config?.context ?? "category",
    contextId: config?.contextId ?? "",
    configurationId: config?.configurationId ?? "",
    campaignId: "",
    rank: "",
  };
}

function createDefaultPair(): ConfigurationPair {
  const config = createDefaultConfig();

  return {
    id: createId("pair"),
    config,
    assignments: [createDefaultAssignment(config)],
  };
}

const defaultFileNaming: FileNamingForm = {
  date: getTodayDate(),
  campaignName: "",
  locale: "",
};

export default function XmlSlotGeneratorPage() {
  const initialPair = createDefaultPair();

  const [pairs, setPairs] = useState<ConfigurationPair[]>([initialPair]);
  const [activePairId, setActivePairId] = useState<string>(initialPair.id);
  const [fileNaming, setFileNaming] = useState<FileNamingForm>(defaultFileNaming);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setPairs((prev) =>
      prev.map((pair) => {
        const nextConfigurationId = buildConfigurationId(
          fileNaming.date,
          fileNaming.campaignName,
          pair.config.contextId,
        );

        return {
          ...pair,
          config: {
            ...pair.config,
            configurationId: nextConfigurationId,
          },
          assignments: pair.assignments.map((assignment) => ({
            ...assignment,
            contextId: pair.config.contextId,
            configurationId: nextConfigurationId,
          })),
        };
      }),
    );
  }, [fileNaming.date, fileNaming.campaignName]);

  const validationError = useMemo(() => {
  for (const pair of pairs) {
    const { config, assignments } = pair;

    if (
      !config.slotId.trim() ||
      !config.context.trim() ||
      !config.contextId.trim() ||
      !config.configurationId.trim() ||
      !config.description.trim() ||
      !config.template.trim() ||
      !config.contentAssetId.trim()
    ) {
      return "All Slot Configuration fields must be filled.";
    }

    for (const assignment of assignments) {
      if (
        !assignment.slotId.trim() ||
        !assignment.context.trim() ||
        !assignment.contextId.trim() ||
        !assignment.configurationId.trim() ||
        !assignment.campaignId.trim() ||
        !assignment.rank.trim()
      ) {
        return "All Campaign Assignment fields must be filled.";
      }
    }
  }

  return null;
}, [pairs]);

  const xmlOutput = useMemo(() => {
    if (validationError) {
      return "";
    }

    return buildFullXml(pairs);
  }, [pairs, validationError]);

  const downloadFileName = useMemo(() => {
    const datePart = fileNaming.date.trim() || getTodayDate();
    const campaignPart = sanitizeFileNamePart(fileNaming.campaignName) || "campaign_name";
    const localePart = sanitizeFileNamePart(fileNaming.locale) || "locale";

    return `${datePart}_${campaignPart}_${localePart}.xml`;
  }, [fileNaming]);

  const addPair = () => {
    const newPair = createDefaultPair();
    const nextConfigurationId = buildConfigurationId(
      fileNaming.date,
      fileNaming.campaignName,
      newPair.config.contextId,
    );

    const pairWithGeneratedValues: ConfigurationPair = {
      ...newPair,
      config: {
        ...newPair.config,
        configurationId: nextConfigurationId,
      },
      assignments: newPair.assignments.map((assignment) => ({
        ...assignment,
        contextId: newPair.config.contextId,
        configurationId: nextConfigurationId,
      })),
    };

    setPairs((prev) => [...prev, pairWithGeneratedValues]);
    setActivePairId(pairWithGeneratedValues.id);
  };

  const removePair = (pairId: string) => {
    setPairs((prev) => {
      if (prev.length <= 1) {
        return prev;
      }

      const nextPairs = prev.filter((pair) => pair.id !== pairId);

      if (pairId === activePairId && nextPairs.length > 0) {
        setActivePairId(nextPairs[0].id);
      }

      return nextPairs;
    });
  };

  const updatePairConfig = (pairId: string, nextConfig: ConfigForm) => {
    setPairs((prev) =>
      prev.map((pair) => {
        if (pair.id !== pairId) {
          return pair;
        }

        const nextConfigurationId = buildConfigurationId(
          fileNaming.date,
          fileNaming.campaignName,
          nextConfig.contextId,
        );

        return {
          ...pair,
          config: {
            ...nextConfig,
            configurationId: nextConfigurationId,
          },
          assignments: pair.assignments.map((assignment) => ({
            ...assignment,
            slotId: nextConfig.slotId,
            context: nextConfig.context,
            contextId: nextConfig.contextId,
            configurationId: nextConfigurationId,
          })),
        };
      }),
    );
  };

  const updatePairAssignments = (pairId: string, nextAssignments: Assignment[]) => {
    setPairs((prev) =>
      prev.map((pair) => {
        if (pair.id !== pairId) {
          return pair;
        }

        const nextConfigurationId = buildConfigurationId(
          fileNaming.date,
          fileNaming.campaignName,
          pair.config.contextId,
        );

        return {
          ...pair,
          assignments: nextAssignments.map((assignment) => ({
            ...assignment,
            slotId: pair.config.slotId,
            context: pair.config.context,
            contextId: pair.config.contextId,
            configurationId: nextConfigurationId,
          })),
        };
      }),
    );
  };

  const copyXml = async () => {
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    try {
      await navigator.clipboard.writeText(xmlOutput);
      setCopied(true);

      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const downloadXml = () => {
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    const blob = new Blob([xmlOutput], { type: "application/xml;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = downloadFileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">XML Slot Generator</h1>
            <p className="mt-2 text-sm text-slate-600">
              Create one or more Slot + Campaign configuration pairs and switch between them using tabs.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <FileNamingSection
            fileNaming={fileNaming}
            setFileNaming={setFileNaming}
            downloadFileName={downloadFileName}
          />

          <div className="rounded-2xl border bg-white shadow-sm">
            <Tabs value={activePairId} onValueChange={setActivePairId} className="w-full">
              <div className="border-b px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TabsList className="h-auto bg-slate-100 p-1">
                    {pairs.map((pair, index) => (
                      <TabsTrigger
                        key={pair.id}
                        value={pair.id}
                        className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm"
                      >
                        Slot {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Button type="button" variant="outline" onClick={addPair} className="rounded-md">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Slot
                  </Button>
                </div>
              </div>

              <div className="block w-full p-6">
                {pairs.map((pair, index) => (
                  <TabsContent key={pair.id} value={pair.id} className="mt-0 block w-full">
                    <div className="block w-full">
                      <ConfigurationPairSection
                        pair={pair}
                        index={index}
                        canRemove={pairs.length > 1}
                        onRemove={removePair}
                        onUpdateConfig={updatePairConfig}
                        onUpdateAssignments={updatePairAssignments}
                      />
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <XmlPreviewCard
            xmlOutput={xmlOutput}
            copied={copied}
            onCopy={copyXml}
            onDownload={downloadXml}
          />
        </div>
      </div>
    </div>
  );
}