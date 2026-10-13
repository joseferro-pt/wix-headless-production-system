import { useId, useMemo, useState } from 'react';

/** Only explicitly public, serialisable data may cross into a hydrated island. */
export interface PublicListItem { id: string; label: string; detail?: string; href?: string; }
interface Props { items: readonly PublicListItem[]; label?: string; emptyMessage?: string; }

function safeHref(value: string | undefined): string | undefined {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\r\n\\]/.test(value)) return undefined;
  return value;
}
export default function FilterableList({ items, label = 'Filter items', emptyMessage = 'No matching items.' }: Props) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const text = query.toLocaleLowerCase().trim();
    return items.filter(item => (item.label + ' ' + (item.detail ?? '')).toLocaleLowerCase().includes(text));
  }, [items, query]);
  return (
    <div className="space-y-4">
      <label className="block" htmlFor={inputId}>{label}</label>
      <input id={inputId} type="search" value={query}
        onChange={event => setQuery(event.currentTarget.value)}
        className="w-full rounded-md border px-3 py-2" autoComplete="off" />
      <p role="status" aria-live="polite">{filtered.length} results</p>
      {filtered.length ? <ul className="grid gap-3 sm:grid-cols-2">
        {filtered.map(item => <li className="rounded-md border p-4" key={item.id}>
          {safeHref(item.href) ? <a href={safeHref(item.href)}>{item.label}</a> : <strong>{item.label}</strong>}
          {item.detail && <p className="mt-2 text-sm">{item.detail}</p>}
        </li>)}
      </ul> : <p role="status">{emptyMessage}</p>}
    </div>
  );
}
