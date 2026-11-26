// Addresses of the icon set pages and their images, for each icon style. Kept apart from the set
// data so client components can link to the sets without loading it.
export type SetStyle = "layered" | "duotone" | "line";
export const SET_STYLES: SetStyle[] = ["layered", "duotone", "line"];
/** What the icon browser needs to open a set in place: a short name for the sidebar, the full title and the icons. */
export type BrowserSet = { id: string; name: string; title: string; icons: string[] };

/** The page listing a style's icon sets. */
export const setsPath = (style: SetStyle) => (style === "layered" ? "/icons/sets/" : `/icons/sets/${style}/`);
/** One icon set's page in a style. */
export const setPath = (style: SetStyle, id: string) => `${setsPath(style)}${id}/`;
/** A still image of an icon in a style. */
export const previewPath = (style: SetStyle, name: string) => (style === "layered" ? `/icons/${name}/preview.svg` : `/icons/${name}/${style}.svg`);
/** Where an icon opens: its own page for layered icons, the browser in that style for the others. */
export const iconHref = (style: SetStyle, name: string) => (style === "layered" ? `/icons/${name}/` : `/icons/?style=${style}&icon=${name}`);
/** A set opened in place in the icon browser, in its style whatever style the visitor last picked. */
export const browserSetHref = (style: SetStyle, id: string) => `/icons/?style=${style}&set=${id}`;
