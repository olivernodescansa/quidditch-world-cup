// Equipos y posiciones del Mundial. Datos basados en "Quidditch a traves de los tiempos".

export const TEAMS = [
  {
    slug: "puddlemere",
    name: "Puddlemere United",
    short: "Puddlemere",
    colors: ["#1b3a8c", "#f1c453"],
    colorsText: "Azul y dorado",
    founded: 1163,
    home: "Puddlemere",
    motto: "El equipo mas antiguo de la liga",
    bio: "Fundado en 1163, es el club profesional de quidditch mas antiguo de Gran Bretana e Irlanda. Sus tunicas azules llevan dos juncos dorados cruzados. Es el equipo favorito de Albus Dumbledore y el club donde jugo Oliver Wood.",
  },
  {
    slug: "wimbourne",
    name: "Avispas de Wimbourne",
    short: "Avispas",
    colors: ["#f2c40d", "#16130a"],
    colorsText: "Amarillo y negro",
    founded: 1312,
    home: "Wimbourne, Dorset",
    motto: "Pican fuerte y ganan en racha",
    bio: "Club ingles de Dorset fundado en 1312. Sus tunicas llevan franjas horizontales amarillas y negras con una avispa en el pecho. Con el legendario golpeador Ludo Bagman, las Avispas ganaron la liga tres veces seguidas.",
  },
  {
    slug: "chudley",
    name: "Chudley Cannons",
    short: "Cannons",
    colors: ["#ff7a00", "#111111"],
    colorsText: "Naranja brillante y negro",
    founded: 1753,
    home: "Chudley",
    motto: "Mantengamos los dedos cruzados y esperemos lo mejor",
    bio: "Fundados en 1753, visten naranja brillante y su escudo lleva dos C negras y una bala de canon. Ganaron la liga 21 veces, la ultima en 1892, pero tienen una hinchada fiel y un lema que habla por si solo.",
  },
  {
    slug: "caerphilly",
    name: "Caerphilly Catapults",
    short: "Catapults",
    colors: ["#7fd35b", "#d1202f"],
    colorsText: "Verde claro y escarlata",
    founded: 1402,
    home: "Caerphilly, Gales",
    motto: "Dieciocho ligas y cero miedo",
    bio: "Club galés fundado en 1402, con tunicas de rayas verticales verde claro y escarlata. Acumula 18 ligas y gano la Copa Europea de 1956. Su estrella mas temeraria fue Dai Llewellyn, famoso por su estilo de vuelo kamikaze.",
  },
];

export const POSITIONS = [
  { id: "cazador", label: "Cazador", plural: "Cazadores", slots: 3, blurb: "Anota goles con la Quaffle" },
  { id: "golpeador", label: "Golpeador", plural: "Golpeadores", slots: 2, blurb: "Domina las Bludgers" },
  { id: "buscador", label: "Buscador", plural: "Buscadores", slots: 1, blurb: "Persigue la Snitch dorada" },
  { id: "guardian", label: "Guardian", plural: "Guardianes", slots: 1, blurb: "Defiende los aros" },
  { id: "entrenador", label: "Entrenador", plural: "Entrenadores", slots: 1, blurb: "Dirige la estrategia" },
];

export const teamBySlug = (slug) => TEAMS.find((t) => t.slug === slug);
export const roleById = (id) => POSITIONS.find((p) => p.id === id);

/** Todos contra todos, solo ida: 6 cruces para 4 equipos. */
export function fixtures() {
  const out = [];
  for (let i = 0; i < TEAMS.length; i++)
    for (let j = i + 1; j < TEAMS.length; j++) out.push([TEAMS[i], TEAMS[j]]);
  return out;
}
