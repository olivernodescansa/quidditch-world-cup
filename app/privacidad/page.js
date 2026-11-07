export const metadata = { title: "Privacidad · Mundial de Quidditch" };

export default function Privacidad() {
  return (
    <div className="wrap page prose">
      <p className="eyebrow">Legal</p>
      <h1>Privacidad y cookies</h1>

      <h2>Qué datos guardamos</h2>
      <ul>
        <li>Tu nombre y email de Google, solo para identificar tu cuenta.</li>
        <li>El @ de Instagram, ícono, equipo y posición que elegís al registrarte (el @ es público en la tabla).</li>
        <li>Tus puntajes y estadísticas de juego.</li>
        <li>Una huella irreversible (hash) de tu IP, únicamente para impedir cuentas duplicadas. No guardamos tu IP real.</li>
      </ul>

      <h2>Publicidad</h2>
      <p>
        Este sitio puede mostrar anuncios de Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios
        basados en tus visitas. Podés administrar tu configuración de anuncios en la página de Ayuda de anuncios de Google.
      </p>

      <h2>Contacto y baja</h2>
      <p>
        Para pedir que borremos tu cuenta o tus datos, escribile al host por Instagram: @Wood_no_descansa.
      </p>

      <h2>Aviso</h2>
      <p>
        Proyecto de fans sin fines oficiales. Harry Potter y sus marcas pertenecen a sus respectivos titulares.
        Los escudos y gráficos de este sitio son ilustraciones originales.
      </p>
    </div>
  );
}
