export default function BreadcrumbNav({ paths }) {
  return (
    <nav className="text-sm mb-4">
      {paths.map((p, i) => (
        <span key={p.href}>
          <a href={p.href} className="text-blue-500 hover:underline">{p.label}</a>
          {i < paths.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  )
}
