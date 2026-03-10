import { useCallback, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminApi } from "./api/AdminApi";
import StatCard from "./admin/StatCard";
import GroupsPanel from "./admin/GroupsPanel";
import GroupDetails from "./admin/GroupDetails";
import GroupFormModal from "./admin/GroupFormModal";
import ConfirmDialog from "./admin/ConfirmDialog";
import ManageMembersModal from "./admin/ManageMembersModal";

export default function AdminDashboard() {
  const navigate = useNavigate();

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

  useEffect(() => {
    loadHeaderAndGroups();
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
        await loadGroupDetails(selectedGroupId);
      } catch (e) {
        console.error(e);
        setError(
          e?.response?.data?.detail || "Erro ao adicionar atleta ao grupo.",
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [selectedGroupId, loadGroupDetails],
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
        setError(
          e?.response?.data?.detail || "Erro ao remover atleta do grupo.",
        );
      } finally {
        setBusyUserId(null);
      }
    },
    [selectedGroupId, loadGroupDetails],
  );

  const onOpenUserDash = useCallback(
    (user) => {
      navigate(`/dash?user=${encodeURIComponent(user.username)}`);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <Link
        to="/"
        className="text-green-400 hover:text-green-300 transition font-medium"
      >
        ← voltar
      </Link>

      <h1 className="text-4xl font-bold text-center mb-10 mt-4 tracking-wide text-neutral-200">
        Painel Administrativo
      </h1>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <StatCard
          label="Usuários"
          value={loadingHeader ? "..." : stats.totalUsers}
          icon="👤"
        />
        <StatCard
          label="Grupos"
          value={loadingGroups ? "..." : stats.totalGroups}
          icon="👥"
        />
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
        confirmText="Excluir"
        confirmLoadingText="Excluindo..."
        confirmColor="red"
      />

      <ConfirmDialog
        open={confirmEmailOpen}
        title="Enviar Email"
        description={`Tem certeza que deseja enviar o e-mail de lembrete para todos os usuários do grupo "${groupSendEmail?.name}"?`}
        onCancel={() => setConfirmEmailOpen(false)}
        onConfirm={handleConfirmSendEmail}
        loading={sendingEmail}
        confirmText="Enviar"
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
    </div>
  );
}
