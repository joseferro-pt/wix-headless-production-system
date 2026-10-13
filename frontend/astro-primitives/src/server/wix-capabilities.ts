/** Documentation-scoped, NOT a live Wix app inventory or app support guarantee. */
export type SupportLevel = 'documented-template' | 'verify-api-per-feature' | 'widget-not-portable';
export interface WixCapability { feature: string; support: SupportLevel; docs: string; }
const templates='https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/get-started/astro-templates';
export const wixCapabilities: readonly WixCapability[] = Object.freeze([
  ...['Stores','Bookings','Events','Blog','CMS','Forms'].map(feature=>({feature,support:'documented-template' as const,docs:templates})),
  { feature:'Members', support:'verify-api-per-feature', docs:'https://dev.wix.com/docs/go-headless/wix-managed-headless/full-integration-astro/about-the-astro-integration' },
  { feature:'Pricing Plans', support:'verify-api-per-feature', docs:'https://dev.wix.com/docs/go-headless/project-management/add-apps-to-a-project' },
  { feature:'Widget-only App Market app', support:'widget-not-portable', docs:'https://dev.wix.com/docs/go-headless/project-management/add-apps-to-a-project' },
]);
