export interface SectionDef {
  id: string;
  label: string;
  defaultOrder: number;
  hasTitle?: boolean;
  defaultTitle?: string;
  hasGrid?: boolean;
  defaultGridCols?: number;
  description?: string;
  items?: { id: string; label: string }[];
  defaultTexts?: Record<string, string>;
}

export interface SectionOverride {
  visible?: boolean;
  title?: string;
  order?: number;
  gridCols?: number;
  sx?: Record<string, any>;
  hiddenItems?: string[];
  texts?: Record<string, string>;
}

export interface SectionCustomization extends SectionOverride {
  gridColumns?: number;
  customSx?: Record<string, any>;
}

export interface PageCustomizations {
  [sectionId: string]: SectionCustomization;
}

export interface ResolvedSection extends SectionDef {
  visible: boolean;
  effectiveTitle?: string;
  effectiveGridCols?: number;
  customSx?: Record<string, any>;
  hiddenItems?: string[];
  effectiveTexts: Record<string, string>;
}
