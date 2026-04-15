import axios from "axios";

// ================================
// CONFIG
// ================================
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================================
// TOKEN AUTOMATIQUE
// ================================
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ================================
// AUTH
// ================================
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getProfile = () => API.get("/auth/profile");
export const changePassword = (data) =>
  API.put("/auth/change-password", data);

// ================================
// VISITEURS
// ================================
export const getVisiteurs = () => API.get("/visiteurs");
export const getVisiteur = (id) => API.get(`/visiteurs/${id}`);
export const updateVisiteur = (id, data) =>
  API.put(`/visiteurs/${id}`, data);
export const deleteVisiteur = (id) =>
  API.delete(`/visiteurs/${id}`);

// ================================
// COURS
// ================================
export const getCourses = () => API.get("/cours");
export const getCourse = (id) => API.get(`/cours/${id}`);

// ❌ REMOVED: getCoursesByUser        → /cours/utilisateur/:userId n'existe pas
// ❌ REMOVED: toggleCourseVisibility  → PATCH /cours/:id/visibility n'existe pas

export const createCourse = (data) => API.post("/cours", data);
export const updateCourse = (id, data) => API.put(`/cours/${id}`, data);
export const deleteCourse = (id) => API.delete(`/cours/${id}`);
export const getCourseStats = () => API.get("/cours/stats");

// ================================
// RESSOURCES COURS
// ================================
export const getResourcesByCourse = (courseId) =>
  API.get(`/ressources-cours/course/${courseId}`);

export const uploadResource = (courseId, formData) =>
  API.post(`/ressources-cours/course/${courseId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const downloadResource = (id) =>
  window.open(
    `http://localhost:5000/api/ressources-cours/${id}/download`
  );

// ✅ ADDED: manquait dans l'original → PUT /ressources-cours/:id/visibility
export const updateResourceVisibility = (id, data) =>
  API.put(`/ressources-cours/${id}/visibility`, data);

export const deleteResource = (id) =>
  API.delete(`/ressources-cours/${id}`);

// ================================
// PUBLICATIONS
// ================================
export const getPublications = () => API.get("/publications");
export const getPublication = (id) => API.get(`/publications/${id}`);
export const createPublication = (data) => API.post("/publications", data);
export const updatePublication = (id, data) =>
  API.put(`/publications/${id}`, data);
export const deletePublication = (id) =>
  API.delete(`/publications/${id}`);

// ================================
// PROJETS RECHERCHE
// ================================
export const getProjects = () => API.get("/projets-recherche");
export const getProject = (id) => API.get(`/projets-recherche/${id}`);
export const createProject = (data) => API.post("/projets-recherche", data);
export const updateProject = (id, data) =>
  API.put(`/projets-recherche/${id}`, data);
export const deleteProject = (id) =>
  API.delete(`/projets-recherche/${id}`);

// ================================
// BLOG
// ================================
export const getBlogPosts = () => API.get("/articles-blog");
export const getBlogPost = (id) => API.get(`/articles-blog/${id}`);
export const createBlogPost = (data) => API.post("/articles-blog", data);
export const updateBlogPost = (id, data) =>
  API.put(`/articles-blog/${id}`, data);
export const deleteBlogPost = (id) =>
  API.delete(`/articles-blog/${id}`);

// ================================
// LIENS EXTERNES
// ================================
export const getLinks = () => API.get("/liens-externes");
export const addLink = (data) => API.post("/liens-externes", data);
export const updateLink = (id, data) =>
  API.put(`/liens-externes/${id}`, data);
export const deleteLink = (id) =>
  API.delete(`/liens-externes/${id}`);

// ================================
// PARAMETRES
// ================================
export const getUserParams = (userId) =>
  API.get(`/parametres/visiteur/${userId}`);
export const updateUserParams = (userId, data) =>
  API.put(`/parametres/visiteur/${userId}`, data);

// ================================
// STATISTIQUES
// ================================
export const getStatistics = () => API.get("/statistiques");
export const refreshStatistics = () => API.post("/statistiques/refresh");