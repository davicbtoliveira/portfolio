export const prerender = true;
export const trailingSlash = "always";

export function load({ url }: { url: URL }) {
  return { showChrome: url.pathname !== "/" };
}
