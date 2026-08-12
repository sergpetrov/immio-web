import type { Breadcrumb } from "../breadcrumbs";

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav className="content-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href}>
              {isLast ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
