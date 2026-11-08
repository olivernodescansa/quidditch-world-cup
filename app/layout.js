import Script from "next/script";
import "./globals.css";
import Loader from "@/components/Loader";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { auth } from "@/lib/auth";
import { seasonState } from "@/lib/season";

export const metadata = {
  title: "Mundial de Quidditch",
  description:
    "El Mundial de Quidditch: 4 equipos, una tabla de puntos global y un juego de escoba para ganarte tu lugar. Host: @Wood_no_descansa.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0d1f",
};

export default async function RootLayout({ children }) {
  const session = await auth();
  const { preview } = await seasonState();
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;1,700;1,800;1,900&family=Cinzel:wght@500;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Loader />
        {preview && (
          <div className="preview-bar">
            VISTA PREVIA · así se ve la web después del 29/11 · <a href="/?preview=0">Salir de la vista previa</a>
          </div>
        )}
        <TopBar />
        <main>{children}</main>
        <BottomNav loggedIn={!!session?.user} />
        {adClient && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
