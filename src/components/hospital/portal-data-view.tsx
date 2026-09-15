import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortalCard, PortalPageHeader, SectionEmpty, StatusBadge } from "@/components/hospital/portal-shell";
import { Search, Plus, Download, MoreHorizontal } from "lucide-react";

export type TableColumn<T> = { key: keyof T; label: string; render?: (row: T) => ReactNode };

export function PortalDataView<T extends { id?: string; name?: string; status?: string }>({
  title,
  description,
  eyebrow,
  columns,
  rows,
  addLabel = "Add new",
  emptyTitle = "Nothing here yet",
  emptyDescription = "New records will appear here as your team adds them.",
  onAdd,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  columns: readonly TableColumn<T>[];
  rows: T[];
  addLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onAdd?: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <>
    <PortalPageHeader eyebrow={eyebrow} title={title} description={description} actions={<><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>{onAdd && <Button size="sm" onClick={onAdd}><Plus className="mr-2 h-4 w-4" />{addLabel}</Button>}</>} />
    <PortalCard title={`${rows.length} records`} action={<div className="relative w-52"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" aria-label={`Search ${title}`} className="h-8 pl-8 text-xs" /></div>}>
      {filtered.length === 0 ? <SectionEmpty title={emptyTitle} description={emptyDescription} /> : <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead><tr className="border-b border-border text-xs text-muted-foreground">{columns.map((column) => <th key={String(column.key)} className="pb-3 pr-4 font-medium">{column.label}</th>)}<th className="pb-3 text-right font-medium"> </th></tr></thead><tbody>{filtered.map((row, index) => <tr key={row.id ?? `${row.name ?? "row"}-${index}`} className="border-b border-border/70 last:border-0"><>{columns.map((column) => <td key={String(column.key)} className="py-4 pr-4 align-middle">{column.render ? column.render(row) : String(row[column.key] ?? "—")}</td>)}</><td className="py-4 text-right"><Button variant="ghost" size="icon" aria-label={`More actions for ${row.name ?? "record"}`}><MoreHorizontal className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div>}
    </PortalCard>
  </>;
}

export function SimpleStatus({ status }: { status: string }) {
  const tone = /available|active|confirmed|checked|admitted/i.test(status) ? "success" : /waiting|leave|pending|scheduled/i.test(status) ? "warning" : /critical|cancel/i.test(status) ? "danger" : "neutral";
  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}