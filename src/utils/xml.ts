import type { Assignment, ConfigForm, ConfigurationPair } from "../types";

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildConfigurationXml(config: ConfigForm) {
  return `    <slot-configuration slot-id="${escapeXml(config.slotId)}" context="${escapeXml(
    config.context,
  )}" context-id="${escapeXml(config.contextId)}" configuration-id="${escapeXml(
    config.configurationId,
  )}" assigned-to-site="${String(config.assignedToSite)}">
        <description>${escapeXml(config.description)}</description>
        <template>${escapeXml(config.template)}</template>
        <enabled-flag>${String(config.enabledFlag)}</enabled-flag>
        <content>
            <content-assets>
                <content-asset content-id="${escapeXml(config.contentAssetId)}"/>
            </content-assets>
        </content>
    </slot-configuration>`;
}

export function buildAssignmentXml(item: Assignment) {
  return `    <slot-configuration-campaign-assignment slot-id="${escapeXml(
    item.slotId,
  )}" context="${escapeXml(item.context)}" context-id="${escapeXml(
    item.contextId,
  )}" configuration-id="${escapeXml(item.configurationId)}" campaign-id="${escapeXml(
    item.campaignId,
  )}">
        <rank>${escapeXml(item.rank)}</rank>
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
${sections ? `\n\n${sections}\n` : ""}
</slot-configurations>`;
}