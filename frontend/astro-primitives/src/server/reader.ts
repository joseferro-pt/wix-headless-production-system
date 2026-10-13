/**
 * Site-local adapters implement this generic read-only interface using
 * authorised Wix SDK BACKEND modules under visitor/member identity.
 * Never import Wix SDK admin/session/secrets into hydrated browser components.
 */
export type ReadState<T> =
  | { status: 'ready'; items: readonly T[] }
  | { status: 'empty'; items: readonly T[] }
  | { status: 'error'; message: string };
export interface ReadOnlySource<T> { read(): Promise<readonly T[]>; }

export async function loadPublicItems<T>(source: ReadOnlySource<T>): Promise<ReadState<T>> {
  try {
    const items = await source.read();
    if (!Array.isArray(items)) throw new TypeError('Reader must return an array');
    return items.length ? { status: 'ready', items } : { status: 'empty', items };
  } catch {
    // Never expose an SDK exception, credential or private request detail in HTML.
    return { status: 'error', message: 'Content is temporarily unavailable.' };
  }
}
