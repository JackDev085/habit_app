import { useState } from "react";
import ModalAvaliacao from "./ModalAvaliacao";
import InstallPWAButton from "./InstallPWAButton";

export default function Home() {
  const hoje = new Date();
  const dia = `${hoje.getDate()}/${hoje.getMonth() + 1}/${hoje.getFullYear()}`;

  const [modalPreOpen, setModalPreOpen] = useState(false);
  const [modalPosOpen, setModalPosOpen] = useState(false);

  return (
    <div className="min-h-[90dvh] bg-black text-white flex flex-col justify-center items-center px-6">
      <InstallPWAButton />

      <h2 className="font-bold text-2xl md:text-3xl mb-10 text-neutral-300">
        Hoje é dia <span className="text-green-400">{dia}</span>
      </h2>

      <div
        className="w-full max-w-md p-6 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer 
        hover:border-green-400 hover:scale-[1.02] transition-all text-center"
        onClick={() => setModalPreOpen(true)}
      >
        <h3 className="text-lg uppercase font-semibold text-green-400">
          Avaliação Pré-Treino
        </h3>
      </div>

      <div
        className="w-full max-w-md mt-4 p-6 rounded-xl bg-neutral-900 border border-neutral-800 cursor-pointer 
        hover:border-green-400 hover:scale-[1.02] transition-all text-center"
        onClick={() => setModalPosOpen(true)}
      >
        <h3 className="text-lg uppercase font-semibold text-green-400">
          Avaliação Pós-Treino
        </h3>
      </div>

      {/* Modais */}
      <ModalAvaliacao
        isOpen={modalPreOpen}
        onClose={() => setModalPreOpen(false)}
        pos={false}
      />
      <ModalAvaliacao
        isOpen={modalPosOpen}
        onClose={() => setModalPosOpen(false)}
        pos={true}
      />
    </div>
  );
}
