// utils/cvMapper.js
export const mapToCVData = (raw) => {
  return {
    fullName: `${raw.prenom || ''} ${raw.nom || ''}`.trim(),
    title: raw.grade || raw.titre || "Enseignant-Chercheur",
    email: raw.email || "",
    phone: raw.phone || "",
    address: raw.address || "",
    photo: raw.photo || raw.photo_url,
    linkedin: raw.linkedin,
    github: raw.github,
    portfolio: raw.portfolio,
    summary: raw.bio || raw.description,
    techSkills: raw.skillsTech || raw.competences || [],
    softSkills: raw.skillsSoft || [],
    cours: raw.cours || [],
    publications: raw.publications || [],
    projets: raw.projets || [],
    education: raw.diplomes || [],
    certifications: raw.certifications || [],
    experience: raw.experience || []
  };
};