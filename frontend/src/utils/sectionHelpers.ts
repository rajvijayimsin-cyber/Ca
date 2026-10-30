import { SectionDef } from '../config/sectionRegistry';
import { PageCustomizations, SectionCustomization } from '../types';

export interface ResolvedSection extends SectionDef {
  visible: boolean;
  effectiveTitle?: string;
  effectiveGridCols?: number;
  customSx?: Record<string, any>;
  hiddenItems?: string[];
  effectiveTexts: Record<string, string>;
}

export function resolveSections(
  registry: SectionDef[],
  customizations?: PageCustomizations
): ResolvedSection[] {
  return registry
    .map(def => {
      const overrides: SectionCustomization = customizations?.[def.id] || {};
      const mergedTexts: Record<string, string> = {
        ...(def.defaultTexts || {}),
        ...(overrides.texts || {}),
      };
      // effectiveTitle: overrides.title > mergedTexts.title > def.defaultTitle
      const effectiveTitle = overrides.title ?? mergedTexts.title ?? def.defaultTitle;
      // Sync title back into mergedTexts so components always read from effectiveTexts
      if (effectiveTitle !== undefined) {
        mergedTexts.title = effectiveTitle;
      }
      return {
        ...def,
        visible: overrides.visible !== false,
        order: overrides.order ?? def.defaultOrder,
        effectiveTitle,
        effectiveGridCols: overrides.gridColumns ?? def.defaultGridCols,
        customSx: overrides.customSx,
        hiddenItems: overrides.hiddenItems,
        effectiveTexts: mergedTexts,
      };
    })
    .filter(s => s.visible)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Replace template variables like {userName}, {appName}, {date} etc. */
export function resolveTextVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key) => vars[key] ?? match);
}
