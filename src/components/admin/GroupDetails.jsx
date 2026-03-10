import UserCard from "./UserCard";
export default function GroupDetails({
  group,
  users,
  evalMap,
  isLoading,
  onOpenUserDash,
  onOpenMembers,
}) {
  if (!group) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
        <p className="text-neutral-400">
          Selecione um grupo para ver os usuários e avaliações.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-100">
            {group.name}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">Grupo ID: {group.id}</p>
        </div>

        <button
          type="button"
          onClick={onOpenMembers}
          className="px-3 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition text-sm"
        >
          Gerenciar membros
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-10">
          <img src="/spin.svg" className="w-12 invert" alt="loading" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {(users ?? []).map((u) => {
            const evaluation =
              evalMap.get(u.username) ||
              evalMap.get(u.id) ||
              evalMap.get(u.usuario) ||
              null;

            return (
              <UserCard
                key={u.id ?? u.username}
                user={u}
                evaluation={evaluation}
                onOpenDash={() => onOpenUserDash(u)}
              />
            );
          })}

          {(users ?? []).length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-10 lg:col-span-2">
              Nenhum usuário neste grupo.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
