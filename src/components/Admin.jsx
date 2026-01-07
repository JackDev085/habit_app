import { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const AdminApi = {
  async fetchUsersStats() {
    // GET /users -> { usuarios: number, usuarios_info: [...] }
    const { data } = await api.get("/users");
    return data;
  },

  async fetchAllUsers() {
    // GET /users -> { usuarios, usuarios_info }
    const { data } = await api.get("/users");
    return data?.usuarios_info ?? [];
  },

  async fetchGroups() {
    // GET /groups -> [{ id, name }]
    const { data } = await api.get("/groups");
    return data ?? [];
  },

  async createGroup(payload) {
    // POST /groups/create
    const { data } = await api.post("/groups/create", payload);
    return data;
  },

  async updateGroup(groupId, payload) {
    // PUT /groups/update/:id
    const { data } = await api.put(`/groups/update/${groupId}`, payload);
    return data;
  },

  async deleteGroup(groupId) {
    // NO SEU BACKEND: DELETE /groups/{group_id}
    const { data } = await api.delete(`/groups/${groupId}`);
    return data;
  },

  async fetchGroupUsers(groupId) {
    // GET /groups/:id/users -> [{ id, username, name, sex }]
    const { data } = await api.get(`/groups/${groupId}/users`);
    return data ?? [];
  },

  async fetchGroupEvaluations(groupId) {
    // GET /groups/:id/evaluations -> [{ usuario, pre:{}, pos:{} }, ...]
    const { data } = await api.get(`/groups/${groupId}/evaluations`);
    return data ?? [];
  },

  async addUserToGroup(groupId, userId) {
    const { data } = await api.post(`/groups/${groupId}/members/add`, {
      user_id: userId,
    });
    return data;
  },

  async removeUserFromGroup(groupId, userId) {
    const { data } = await api.post(`/groups/${groupId}/members/remove`, {
      user_id: userId,
    });
    return data;
  },
};

/**
 * =========================
 *  UI Components (internos)
 * =========================
 */

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 w-full">
      <div className="flex items-center justify-between">
        <p className="text-neutral-400 text-sm uppercase tracking-wide">{label}</p>
        <span className="text-neutral-400">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-neutral-100 mt-2">{value}</p>
    </div>
  );
}

function MetricChips({ obj, threshold = 2.5 }) {
  const entries = useMemo(() => Object.entries(obj ?? {}), [obj]);

  if (!entries.length) return <p className="text-neutral-500 text-sm">Sem dados</p>;

  return (
    <ul className="flex flex-wrap gap-3">
  {entries.map(([key, val]) => {
    const n = Number(val);
    const inverted = ["pain", "pain_pos", "fadigue"].includes(key);

    let color = "text-gray-400"; // fallback

    if (!Number.isFinite(n)) {
      color = "text-gray-400";
    }
    // 1 até 2 (2 é BOM)
    else if (n >= 1 && n <= 2) {
      color = inverted ? "text-green-400" : "text-red-400";
    }
    // maior que 2 até 3 (3 é MÉDIO)
    else if (n > 2 && n <= 3) {
      color = "text-yellow-400";
    }
    // maior que 3 até 5
    else if (n > 3 && n <= 5) {
      color = inverted ? "text-red-400" : "text-green-400";
    }

    return (
          <li
            key={key}
            className={`bg-neutral-800 px-4 py-2 rounded-lg text-center ${color}`}
          >
            <span className="uppercase text-xs tracking-wide block text-neutral-400">
              {key}
            </span>
            <span className="font-bold text-lg">{val}</span>
          </li>
        );
  })}
</ul>

  );
}



function EvaluationSummary({ evaluation }) {
  const pre = evaluation?.pre ?? null;
  const pos = evaluation?.pos ?? null;

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
          Pré-treino
        </h4>
        <MetricChips obj={pre} />
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
          Pós-treino
        </h4>
        <MetricChips obj={pos} />
      </div>
    </div>
  );
}

function UserCard({ user, evaluation, onOpenDash }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-neutral-100">
            {user.name}{" "}
            <span className="text-neutral-400 font-normal">({user.username}) </span>
          </p>
          {user.sex && <p className="text-sm text-neutral-500 mt-1">{user.sex}</p>}
        </div>

        <button
          type="button"
          onClick={onOpenDash}
          className="p-2 hover:bg-neutral-800 rounded-xl transition border border-neutral-800"
          title="Abrir dashboard do usuário"
        >
          <img src="/grafico.svg" className="w-6" alt="dash" />
        </button>
      </div>

      <div className="mt-5">
        <EvaluationSummary evaluation={evaluation} />
      </div>
    </div>
  );
}

function GroupFormModal({ open, mode, initialValue, onClose, onSubmit, loading }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialValue?.name ?? "");
  }, [initialValue]);

  if (!open) return null;

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-neutral-100">
            {isEdit ? "Editar grupo" : "Criar grupo"}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            ✕
          </button>
        </div>

        <label className="block mt-5 text-sm text-neutral-300">
          Nome do grupo
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 outline-none focus:border-green-500"
            placeholder="Ex: Sub-17 Masculino"
          />
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSubmit({ name })}
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold"
            disabled={loading || !name.trim()}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, description, onCancel, onConfirm, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-neutral-100">{title}</h3>
        <p className="text-neutral-400 text-sm mt-2">{description}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-900 transition"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition font-semibold"
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupsPanel({ groups, selectedGroupId, onSelect, onCreate, onEdit, onDelete, loading }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm uppercase tracking-wide text-neutral-400">Grupos</h2>
        <button
          type="button"
          onClick={onCreate}
          className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold text-sm"
        >
          + Criar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <img src="/spin.svg" className="w-10 invert" alt="loading" />
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {(groups ?? []).map((g) => {
            const active = g.id === selectedGroupId;
            return (
              <li key={g.id}>
                <span
                  onClick={() => onSelect(g.id)}
                  className={`w-full p-4 rounded-xl border transition flex items-center justify-between gap-3
                    ${
                      active
                        ? "bg-neutral-800 border-green-500/50"
                        : "bg-neutral-950 border-neutral-800 hover:bg-neutral-800"
                    }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-neutral-100">{g.name}</p>
                    <p className="text-xs text-neutral-500">ID: {g.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(g);
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-700 transition"
                      title="Editar"
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(g);
                      }}
                      className="p-2 rounded-lg hover:bg-neutral-700 transition"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </span>
              </li>
            );
          })}

          {(groups ?? []).length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-6">
              Nenhum grupo cadastrado
            </p>
          )}
        </ul>
      )}
    </div>
  );
}

function GroupDetails({ group, users, evalMap, isLoading, onOpenUserDash, onOpenMembers }) {
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
          <h2 className="text-xl font-semibold text-neutral-100">{group.name}</h2>
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
            const evaluation = evalMap.get(u.username) || evalMap.get(u.id) || evalMap.get(u.usuario) || null;

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

function ManageMembersModal({
  open,
  onClose,
  allUsers,
  members,
  onAdd,
  onRemove,
  busyUserId,
}) {
  const [q, setQ] = useState("");

  const memberIds = useMemo(() => new Set((members ?? []).map((m) => m.id)), [members]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return allUsers ?? [];
    return (allUsers ?? []).filter((u) =>
      `${u.name ?? ""} ${u.username ?? ""}`.toLowerCase().includes(qq)
    );
  }, [q, allUsers]);

  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-neutral-100">Gerenciar membros</h3>
            <p className="text-sm text-neutral-500">Adicione ou remova usuários do grupo</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            ✕
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou username..."
          className="mt-4 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 outline-none focus:border-green-500"
        />

        <div className="mt-4 max-h-[420px] overflow-auto space-y-2">
          {filtered.map((u) => {
            const isMember = memberIds.has(u.id);
            const busy = busyUserId === u.id;

            return (
              <div
                key={u.id}
                className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-neutral-100 font-medium truncate">{u.name}</p>
                  <p className="text-neutral-500 text-sm truncate">@{u.username}</p>
                </div>

                {isMember ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onRemove(u.id)}
                    className="px-3 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition text-sm text-red-400 disabled:opacity-60"
                  >
                    {busy ? "..." : "Remover"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => onAdd(u.id)}
                    className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold text-sm disabled:opacity-60"
                  >
                    {busy ? "..." : "Adicionar"}
                  </button>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="text-neutral-500 text-sm text-center py-10">Nenhum usuário encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * =========================
 *  PAGE
 * =========================
 */
export default function AdminDashboard() {
  const navigate = useNavigate();

  // Dados
  const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0 });
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupEvals, setGroupEvals] = useState([]);

  const evalMap = useMemo(() => {
    const map = new Map();
    for (const item of groupEvals ?? []) map.set(item.username, item);
    return map;
  }, [groupEvals]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );

  // Loading/erro
  const [loadingHeader, setLoadingHeader] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  // Modais
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState("create"); // create | edit
  const [groupEditing, setGroupEditing] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [groupDeleting, setGroupDeleting] = useState(null);

  const [savingGroup, setSavingGroup] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);

  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [busyUserId, setBusyUserId] = useState(null);

  const loadHeaderAndGroups = useCallback(async () => {
    setError("");
    try {
      setLoadingHeader(true);
      setLoadingGroups(true);

      const [usersStats, groupsList] = await Promise.all([
        AdminApi.fetchUsersStats(),
        AdminApi.fetchGroups(),
      ]);

      const totalUsers = usersStats?.usuarios ?? 0;
      const list = groupsList ?? [];

      setGroups(list);
      setStats({ totalUsers, totalGroups: list.length });

      if (!selectedGroupId && list.length > 0) {
        setSelectedGroupId(list[0].id);
      }
    } catch (e) {
      console.error(e);
      setError("Erro ao carregar painel. Tente novamente.");
    } finally {
      setLoadingHeader(false);
      setLoadingGroups(false);
    }
  }, [selectedGroupId]);

  const loadGroupDetails = useCallback(async (groupId) => {
    if (!groupId) return;
    setError("");
    try {
      setLoadingDetails(true);

      const [users, evals] = await Promise.all([
        AdminApi.fetchGroupUsers(groupId),
        AdminApi.fetchGroupEvaluations(groupId),
      ]);

      setGroupUsers(users ?? []);
      setGroupEvals(evals ?? []);
    } catch (e) {
      console.error(e);
      setError("Erro ao carregar detalhes do grupo. Tente novamente.");
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  // Carrega tudo no mount
  useEffect(() => {
    loadHeaderAndGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carrega detalhes do grupo quando muda
  useEffect(() => {
    loadGroupDetails(selectedGroupId);
  }, [selectedGroupId, loadGroupDetails]);

  // Carrega todos os usuários (para gerenciar membros)
  useEffect(() => {
    (async () => {
      try {
        const users = await AdminApi.fetchAllUsers();
        setAllUsers(users ?? []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // CRUD grupos
  const openCreateGroup = useCallback(() => {
    setGroupModalMode("create");
    setGroupEditing(null);
    setGroupModalOpen(true);
  }, []);

  const openEditGroup = useCallback((group) => {
    setGroupModalMode("edit");
    setGroupEditing(group);
    setGroupModalOpen(true);
  }, []);

  const openDeleteGroup = useCallback((group) => {
    setGroupDeleting(group);
    setConfirmOpen(true);
  }, []);

  const handleSubmitGroup = useCallback(
    async ({ name }) => {
      setError("");
      setSavingGroup(true);
      try {
        if (groupModalMode === "create") {
          await AdminApi.createGroup({ name });
        } else {
          await AdminApi.updateGroup(groupEditing.id, { name });
        }
        setGroupModalOpen(false);
        await loadHeaderAndGroups();
      } catch (e) {
        console.error(e);
        setError("Erro ao salvar grupo. Tente novamente.");
      } finally {
        setSavingGroup(false);
      }
    },
    [groupModalMode, groupEditing, loadHeaderAndGroups]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!groupDeleting) return;
    setError("");
    setDeletingGroup(true);
    try {
      await AdminApi.deleteGroup(groupDeleting.id);
      setConfirmOpen(false);

      if (selectedGroupId === groupDeleting.id) {
        setSelectedGroupId(null);
        setGroupUsers([]);
        setGroupEvals([]);
      }

      await loadHeaderAndGroups();
    } catch (e) {
      console.error(e);
      setError("Erro ao excluir grupo. Tente novamente.");
    } finally {
      setDeletingGroup(false);
    }
  }, [groupDeleting, selectedGroupId, loadHeaderAndGroups]);

  // Membros
  const addMember = useCallback(
    async (userId) => {
      if (!selectedGroupId) return;
      setError("");
      setBusyUserId(userId);
      try {
        await AdminApi.addUserToGroup(selectedGroupId, userId);
        await loadGroupDetails(selectedGroupId);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.detail || "Erro ao adicionar atleta ao grupo.");
      } finally {
        setBusyUserId(null);
      }
    },
    [selectedGroupId, loadGroupDetails]
  );

  const removeMember = useCallback(
    async (userId) => {
      if (!selectedGroupId) return;
      setError("");
      setBusyUserId(userId);
      try {
        await AdminApi.removeUserFromGroup(selectedGroupId, userId);
        await loadGroupDetails(selectedGroupId);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.detail || "Erro ao remover atleta do grupo.");
      } finally {
        setBusyUserId(null);
      }
    },
    [selectedGroupId, loadGroupDetails]
  );

  const onOpenUserDash = useCallback(
    (user) => {
      navigate(`/dash?user=${encodeURIComponent(user.username)}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <Link to="/" className="text-green-400 hover:text-green-300 transition font-medium">
        ← voltar
      </Link>

      <h1 className="text-4xl font-bold text-center mb-10 mt-4 tracking-wide text-neutral-200">
        Painel Administrativo
      </h1>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <StatCard label="Usuários" value={loadingHeader ? "..." : stats.totalUsers} icon="👤" />
        <StatCard label="Grupos" value={loadingGroups ? "..." : stats.totalGroups} icon="👥" />
      </div>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GroupsPanel
            groups={groups}
            selectedGroupId={selectedGroupId}
            onSelect={setSelectedGroupId}
            onCreate={openCreateGroup}
            onEdit={openEditGroup}
            onDelete={openDeleteGroup}
            loading={loadingGroups}
          />
        </div>

        <div className="lg:col-span-2">
          <GroupDetails
            group={selectedGroup}
            users={groupUsers}
            evalMap={evalMap}
            isLoading={loadingDetails}
            onOpenUserDash={onOpenUserDash}
            onOpenMembers={() => setMembersModalOpen(true)}
          />
        </div>
      </div>

      <GroupFormModal
        open={groupModalOpen}
        mode={groupModalMode}
        initialValue={groupEditing}
        onClose={() => setGroupModalOpen(false)}
        onSubmit={handleSubmitGroup}
        loading={savingGroup}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Excluir grupo"
        description={`Tem certeza que deseja excluir o grupo "${groupDeleting?.name}"?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deletingGroup}
      />

      <ManageMembersModal
        open={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        allUsers={allUsers}
        members={groupUsers}
        onAdd={addMember}
        onRemove={removeMember}
        busyUserId={busyUserId}
      />
    </div>
  );
}
