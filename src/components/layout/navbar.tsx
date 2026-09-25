import { NavbarClient } from "@/components/layout/navbar-client";
import { getContent } from "@/lib/content/store";

/** Server wrapper — pulls the clinic identity from the content store. */
export async function Navbar() {
  const site = (await getContent()).site;

  return (
    <NavbarClient
      siteName={site.name}
      phone={site.phone}
      phoneHref={site.phoneHref}
    />
  );
}
