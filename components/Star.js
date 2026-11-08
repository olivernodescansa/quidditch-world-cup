/** Estrellita dorada de titular. */
export default function Star({ size = 14, title = "Titular" }) {
  return (
    <svg className="star" width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title}>
      <title>{title}</title>
      <path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z" fill="#f5c451" stroke="#b8841c" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
