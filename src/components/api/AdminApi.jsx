import api from "../../../api/api";
export const AdminApi = {
  async fetchUsersStats() {
    // GET /users -> { usuarios: number, usuarios_info: [...] }
    const { data } = await api.get("/users");
    return data;
  },

  async fetchAllUsers() {
    // GET /users -> { usuarios, usuarios_info }
    const { data } = await api.get("/users");
    console.log("data", data);
    return data ?? [];
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

  async sendEmailGroup(groupId) {
    const { data } = await api.post(`/email/send-reminder-async/${groupId}`);
    return data;
  },
};
