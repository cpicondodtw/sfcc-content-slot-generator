import type { Assignment, ConfigForm, ConfigurationPair } from "../types";

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeXmlValue(value: string) {
  return value.trim();
}

function normalizeConfig(config: ConfigForm): ConfigForm {
  return {
    ...config,
    slotId: normalizeXmlValue(config.slotId),
    context: normalizeXmlValue(config.context),
    contextId: normalizeXmlValue(config.contextId),
    configurationId: normalizeXmlValue(config.configurationId),
    description: normalizeXmlValue(config.description),
    template: normalizeXmlValue(config.template),
    contentAssetId: normalizeXmlValue(config.contentAssetId),
  };
}

function normalizeAssignment(item: Assignment): Assignment {
  return {
    ...item,
    slotId: normalizeXmlValue(item.slotId),
    context: normalizeXmlValue(item.context),
    contextId: normalizeXmlValue(item.contextId),
    configurationId: normalizeXmlValue(item.configurationId),
    campaignId: normalizeXmlValue(item.campaignId),
    rank: normalizeXmlValue(item.rank),
  };
}

export function buildConfigurationXml(config: ConfigForm) {
  const normalizedConfig = normalizeConfig(config);

  return `    <slot-configuration slot-id="${escapeXml(normalizedConfig.slotId)}" context="${escapeXml(
    normalizedConfig.context,
  )}" context-id="${escapeXml(normalizedConfig.contextId)}" configuration-id="${escapeXml(
    normalizedConfig.configurationId,
  )}" assigned-to-site="${String(
    normalizedConfig.assignedToSite,
  )}">
        <description>${escapeXml(normalizedConfig.description)}</description>
        <template>${escapeXml(normalizedConfig.template)}</template>
        <enabled-flag>${String(normalizedConfig.enabledFlag)}</enabled-flag>
        <content>
            <content-assets>
                <content-asset content-id="${escapeXml(normalizedConfig.contentAssetId)}"/>
            </content-assets>
        </content>
    </slot-configuration>`;
}

export function buildAssignmentXml(item: Assignment) {
  const normalizedAssignment = normalizeAssignment(item);

  return `    <slot-configuration-campaign-assignment slot-id="${escapeXml(
    normalizedAssignment.slotId,
  )}" context="${escapeXml(normalizedAssignment.context)}" context-id="${escapeXml(
    normalizedAssignment.contextId,
  )}" configuration-id="${escapeXml(normalizedAssignment.configurationId)}" campaign-id="${escapeXml(
    normalizedAssignment.campaignId,
  )}">
        <rank>${escapeXml(normalizedAssignment.rank)}</rank>
    </slot-configuration-campaign-assignment>`;
}

export function buildFullXml(pairs: ConfigurationPair[]) {
  const configurationSections = pairs.map((pair) => buildConfigurationXml(pair.config));
  const assignmentSections = pairs.flatMap((pair) =>
    pair.assignments.map((assignment) => buildAssignmentXml(assignment)),
  );

  const sections = [...configurationSections, ...assignmentSections].join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<slot-configurations xmlns="http://www.demandware.com/xml/impex/slot/2008-09-08">
${sections ? `\n${sections}\n` : ""}
</slot-configurations>`;
}
