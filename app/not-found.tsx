import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found-panel">
      <h1>Página no encontrada</h1>
      <p>La ruta solicitada no existe o todavía no forma parte de la nueva arquitectura pública.</p>
      <Link href="/" className="cta-link">
        Volver al inicio
      </Link>
    </section>
  );
}
