import MainNav from "./MainNav";

export default function AppLayout({
  title,
  links,
  children
}) {
  return (
    <>
      <header className="header">
        <h1>{title}</h1>

        <MainNav links={links} />
      </header>

      <main>
        {children}
      </main>

      <footer>
        <p>© 2026 Barbershop</p>
      </footer>
    </>
  );
}