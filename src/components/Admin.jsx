import { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminApi } from "./api/AdminApi";
import StatCard from "./admin/StatCard";
import GroupsPanel from "./admin/GroupsPanel";
import GroupDetails from "./admin/GroupDetails";
import GroupFormModal from "./admin/GroupFormModal";
import ConfirmDialog from "./admin/ConfirmDialog";
import ManageMembersModal from "./admin/ManageMembersModal";
import SendNotificationModal from "./admin/SendNotificationModal";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalUsers: 0, totalGroups: 0 });
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupEvals, setGroupEvals] = useState([]);
  const [filterMonths, setFilterMonths] = useState(1);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  const evalMap = useMemo(() => {
    const map = new Map();
    for (const item of groupEvals ?? []) {
      if (item.username) {
        map.set(item.username.toLowerCase(), item);
      }
    }
    return map;
  }, [groupEvals]);

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId],
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
  const [groupSendEmail, setGroupSendEmail] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [confirmEmailOpen, setConfirmEmailOpen] = useState(false);

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

      const totalUsers = Array.isArray(usersStats) ? usersStats.length : (usersStats?.usuarios ?? 0);
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

  const loadGroupDetails = useCallback(async (groupId, months) => {
    if (!groupId) return;
    setError("");
    try {
      setLoadingDetails(true);

      const [users, evals] = await Promise.all([
        AdminApi.fetchGroupUsers(groupId),
        AdminApi.fetchGroupEvaluations(groupId, months),
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

  useEffect(() => {
    loadHeaderAndGroups();
  }, []);

  // Carrega detalhes do grupo quando muda ou o filtro de data muda
  useEffect(() => {
    loadGroupDetails(selectedGroupId, filterMonths);
  }, [selectedGroupId, filterMonths, loadGroupDetails]);

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

  const sendEmailGroup = useCallback((group) => {
    setGroupSendEmail(group);
    setConfirmEmailOpen(true);
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
    [groupModalMode, groupEditing, loadHeaderAndGroups],
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

  const handleConfirmSendEmail = useCallback(async () => {
    if (!groupSendEmail) return;
    setError("");
    setSendingEmail(true);
    try {
      await AdminApi.sendEmailGroup(groupSendEmail.id);
      setConfirmEmailOpen(false);
      await loadHeaderAndGroups();
    } catch (e) {
      console.error(e);
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setSendingEmail(false);
    }
  }, [groupSendEmail, loadHeaderAndGroups]);

  // Membros
  const addMember = useCallback(
    async (userId) => {
      if (!selectedGroupId) return;
      setError("");
      setBusyUserId(userId);
      try {
        await AdminApi.addUserToGroup(selectedGroupId, userId);
        await loadGroupDetails(selectedGroupId, filterMonths);
      } catch (e) {
        console.error(e);
        setError(
          e?.response?.data?.detail || "Erro ao adicionar atleta ao grupo.",
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [selectedGroupId, loadGroupDetails, filterMonths],
  );

  const removeMember = useCallback(
    async (userId) => {
      if (!selectedGroupId) return;
      setError("");
      setBusyUserId(userId);
      try {
        await AdminApi.removeUserFromGroup(selectedGroupId, userId);
        await loadGroupDetails(selectedGroupId, filterMonths);
      } catch (e) {
        console.error(e);
        setError(
          e?.response?.data?.detail || "Erro ao remover atleta do grupo.",
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [selectedGroupId, loadGroupDetails, filterMonths],
  );

  const onOpenUserDash = useCallback(
    (user) => {
      navigate(`/dash?user=${encodeURIComponent(user.username)}`);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-[#050505] bg-tactical text-white px-6 py-8 selection:bg-emerald-500 selection:text-black">
      
      {/* Voltar button */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800 transition text-xs font-bold uppercase tracking-wider"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar ao Início
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">Comissão Técnica</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-1 uppercase tracking-tight">
            Painel de Controle
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-sm mx-auto">
            Monitore a carga interna dos atletas e gerencie equipes de treino.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            label="Total de Atletas"
            value={loadingHeader ? "..." : stats.totalUsers}
            icon="👤"
          />
          <StatCard
            label="Grupos Ativos"
            value={loadingGroups ? "..." : stats.totalGroups}
            icon="👥"
          />
          <div 
            onClick={() => setNotificationModalOpen(true)}
            className="glass-panel border border-zinc-800 hover:border-emerald-500/40 hover:bg-emerald-950/5 transition duration-300 p-6 rounded-2xl flex items-center justify-between cursor-pointer group shadow-lg"
          >
            <div>
              <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Ferramentas</span>
              <h3 className="text-lg font-black text-white mt-1 group-hover:text-emerald-400 transition">
                Enviar Notificação
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Dispare alertas push para o app dos atletas.</p>
            </div>
            <div className="text-2xl p-3 bg-zinc-950 border border-zinc-800 rounded-xl group-hover:border-emerald-500/20 group-hover:bg-emerald-950/20 transition">
              🔔
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-300 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Main Panels Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <GroupsPanel
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelect={setSelectedGroupId}
              onCreate={openCreateGroup}
              onEdit={openEditGroup}
              onDelete={openDeleteGroup}
              onSendEmail={sendEmailGroup}
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
              filterMonths={filterMonths}
              onFilterChange={setFilterMonths}
            />
          </div>
        </div>
      </div>

      {/* Modals & Dialogs */}
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
        title="Excluir Grupo de Treino"
        description={`Tem certeza absoluta que deseja excluir o grupo "${groupDeleting?.name}"? Esta ação removerá todos os vínculos atuais dos atletas.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deletingGroup}
        confirmText="Excluir"
        confirmLoadingText="Excluindo..."
        confirmColor="red"
      />

      <ConfirmDialog
        open={confirmEmailOpen}
        title="Enviar E-mail de Alerta"
        description={`Tem certeza que deseja enviar o e-mail de lembrete de carga para todos os usuários ativos do grupo "${groupSendEmail?.name}"?`}
        onCancel={() => setConfirmEmailOpen(false)}
        onConfirm={handleConfirmSendEmail}
        loading={sendingEmail}
        confirmText="Enviar Alerta"
        confirmLoadingText="Enviando..."
        confirmColor="blue"
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

      <SendNotificationModal
        open={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
      
    </div>
  );
}
