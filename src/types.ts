export type Assignment = {
  id: string;
  slotId: string;
  context: string;
  contextId: string;
  configurationId: string;
  campaignId: string;
  rank: string;
};

export type ConfigForm = {
  slotId: string;
  context: string;
  contextId: string;
  configurationId: string;
  assignedToSite: boolean;
  description: string;
  template: string;
  enabledFlag: boolean;
  contentAssetId: string;
};

export type FileNamingForm = {
  date: string
  campaignName: string
  locale: string
}

export type ConfigurationPair = {
  id: string;
  config: ConfigForm;
  assignments: Assignment[];
};  
