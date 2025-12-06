export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-gray-800 py-10 px-6 md:px-16 text-gray-400 text-center">
      <img className="w-30 mx-auto my-4" src="logo.svg" alt="logo do site" />

      <p className="max-w-xl mx-auto mb-4 text-sm">
        Website para "trackear" avaliações de treinos e mostrar de forma simplificada evoluções e medidas de preocauções.
        <a className="text-blue-500" target="_blank" href={"https://www.instagram.com/jackson.lorran/"}> instagram</a>
      </p>

      <p className="text-xs text-gray-600 mt-6">© {new Date().getFullYear()} Load Basketball</p>
    </footer>
  );
}