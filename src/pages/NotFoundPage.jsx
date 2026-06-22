import PageLayout from "../components/PageLayout";

export default function NotFoundPage() {
  return (
    <PageLayout>
      <section className="page-hero page-hero--compact">
        <div className="wrap">
          <p className="eyebrow eyebrow--light">Error 404</p>
          <h1>Página no encontrada</h1>
          <p>La dirección solicitada no existe o ya no está disponible.</p>
          <a className="button" href="/">
            Volver al inicio
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
