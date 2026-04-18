export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs(_: { items: BreadcrumbItem[] }) {
  return null;
}
