// src/routes/_authenticated/profile.tsx

import { createFileRoute } from '@tanstack/react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useState } from 'react';

import { apiFetch } from '../../lib/api';

import {
  Github,
  Linkedin,
  Building,
  GraduationCap,
  Briefcase,
  Edit3,
  Save,
  X,
  Sparkles,
  Globe,
} from 'lucide-react';

export const Route =
  createFileRoute('/_authenticated/profile')({
    component: ProfileComponent,
  });

/* =========================
   TYPES
========================= */

interface Profile {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  college?: string;
  country?: string;
  state?: string;
  city?: string;
  github?: string;
  linkedin?: string;
}

/* =========================
   COMPONENT
========================= */

function ProfileComponent() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  /* =========================
     FORM STATE
  ========================= */
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [college, setCollege] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  /* =========================
     FETCH PROFILE
  ========================= */
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<Profile>({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const data = await apiFetch<Profile>('profile/profile');

      setName(data.name || '');
      setRole(data.role || '');
      setCompany(data.company || '');
      setCollege(data.college || '');
      setCountry(data.country || '');
      setState(data.state || '');
      setCity(data.city || '');
      setGithub(data.github || '');
      setLinkedin(data.linkedin || '');

      return data;
    },
  });

  /* =========================
     UPDATE PROFILE
  ========================= */
  const updateMutation = useMutation({
    mutationFn: (updated: Partial<Profile>) =>
      apiFetch<Profile>('profile/profile', {
        method: 'POST',
        body: JSON.stringify(updated),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'profile'], data);
      setIsEditing(false);
    },
  });

  /* =========================
     SAVE / CANCEL
  ========================= */
  const handleSave = () => {
    updateMutation.mutate({
      name,
      role,
      company,
      college,
      country,
      state,
      city,
      github,
      linkedin,
    });
  };

  const handleCancel = () => {
    if (!profile) return;

    setName(profile.name || '');
    setRole(profile.role || '');
    setCompany(profile.company || '');
    setCollege(profile.college || '');
    setCountry(profile.country || '');
    setState(profile.state || '');
    setCity(profile.city || '');
    setGithub(profile.github || '');
    setLinkedin(profile.linkedin || '');
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="page-container flex-center" style={{ minHeight: '80vh' }}>
        <div className="editorial-label structural-pulse">
          Loading Identity Matrix...
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div
        className="page-container flex-center"
        style={{ minHeight: '70vh', flexDirection: 'column', gap: '1rem' }}
      >
        <h2 style={{ letterSpacing: '-0.02em', fontWeight: 700 }}>Profile Unavailable</h2>
        <p style={{ color: 'var(--text-muted)' }}>Failed to load contender profile.</p>
      </div>
    );
  }

  const displayName = profile.name || profile.email || 'Talent Grind';
  const initial = displayName.substring(0, 2).toUpperCase();
  const locationText = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');

  return (
    <div className="page-container flex-center" style={{ minHeight: '100vh', padding: '2.5rem 1.5rem' }}>
      <div className="profile-card fade-in">
        <div className="card-corner-geometry" />
        
        {/* =========================
            HEADER
        ========================= */}
        <div className="profile-header">
          <div className="avatar-large">
            <span className="avatar-inner-text">{initial}</span>
            <div className="avatar-pulse-ring" />
          </div>

          <div className="profile-info">
            <div className="badge-row">
              <span className="editorial-label">TALENTGRIND CONTESTANT</span>
              <div className="grinder-badge">
                <Sparkles size={11} className="spin-icon" />
                VERIFIED GRINDER
              </div>
            </div>

            <h1 className="profile-main-title">{displayName}</h1>
            <p className="email-text">{profile.email}</p>
          </div>

          {!isEditing && (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <Edit3 size={14} />
              EDIT PROFILE
            </button>
          )}
        </div>

        {/* =========================
            BODY MODE RENDERING
        ========================= */}
        {isEditing ? (
          <div className="edit-section">
            <div className="edit-grid">
              <InputField label="Name" value={name} setValue={setName} />
              <InputField label="Role" value={role} setValue={setRole} />
              <InputField label="Company" value={company} setValue={setCompany} />
              <InputField label="College" value={college} setValue={setCollege} />
              <InputField label="Country" value={country} setValue={setCountry} />
              <InputField label="State" value={state} setValue={setState} />
              <InputField label="City" value={city} setValue={setCity} />
              <InputField label="GitHub Username" value={github} setValue={setGithub} />
              <InputField label="LinkedIn Username" value={linkedin} setValue={setLinkedin} />
            </div>

            <div className="action-row">
              <button className="btn-outline" onClick={handleCancel}>
                <X size={14} />
                Cancel
              </button>

              <button 
                className="btn-primary" 
                onClick={handleSave} 
                disabled={updateMutation.isPending}
              >
                <Save size={14} />
                {updateMutation.isPending ? 'Saving Vector...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-body">
            <div className="meta-grid">
              <MetaCard
                icon={<Briefcase size={15} />}
                label="ROLE"
                value={profile.role || 'Not Specified'}
              />
              <MetaCard
                icon={<Building size={15} />}
                label="COMPANY"
                value={profile.company || 'Independent'}
              />
              <MetaCard
                icon={<GraduationCap size={15} />}
                label="COLLEGE"
                value={profile.college || 'Unknown Node'}
              />
              <MetaCard
                icon={<Globe size={15} />}
                label="LOCATION"
                value={locationText || 'Remote Node'}
              />
            </div>

            <div className="social-row">
              {profile.github && (
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn"
                >
                  <div className="social-btn-bg" />
                  <Github size={15} />
                  <span>{profile.github}</span>
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn"
                >
                  <div className="social-btn-bg" />
                  <Linkedin size={15} />
                  <span>{profile.linkedin}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================
          THEMATIC PRESENTATION ENGINE
      ========================= */}
      <style dangerouslySetInnerHTML={{ __html: `
        .profile-card {
          position: relative;
          width: 100%;
          max-width: 840px;
          background: linear-gradient(145deg, rgba(20, 24, 33, 0.6) 0%, rgba(10, 12, 16, 0.4) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 24px;
          padding: 3.5rem;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .card-corner-geometry {
          position: absolute;
          top: 0;
          left: 0;
          width: 12px;
          height: 12px;
          border-left: 2px solid var(--accent, #2dd4a8);
          border-top: 2px solid var(--accent, #2dd4a8);
          opacity: 0.6;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex-wrap: wrap;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
          padding-bottom: 2.5rem;
        }

        .avatar-large {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(45, 212, 168, 0.15) 0%, rgba(45, 212, 168, 0.02) 100%);
          border: 1px solid rgba(45, 212, 168, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .avatar-large:hover {
          transform: scale(1.04);
        }

        .avatar-inner-text {
          font-size: 2.25rem;
          font-weight: 800;
          font-family: monospace;
          letter-spacing: -0.05em;
          color: var(--accent, #2dd4a8);
          text-shadow: 0 0 15px rgba(45, 212, 168, 0.4);
        }

        .avatar-pulse-ring {
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(45, 212, 168, 0.15);
          border-radius: 24px;
          pointer-events: none;
        }

        .profile-info {
          flex: 1;
          min-width: 260px;
        }

        .badge-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .profile-main-title {
          margin-top: 0.6rem;
          font-size: 2.6rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          color: var(--text-primary, #ffffff);
        }

        .email-text {
          margin-top: 0.4rem;
          color: var(--text-muted, #8892b0);
          font-family: monospace;
          font-size: 0.9rem;
        }

        .grinder-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          border-radius: 6px;
          border: 1px solid rgba(45, 212, 168, 0.2);
          background: rgba(45, 212, 168, 0.05);
          color: var(--accent, #2dd4a8);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .btn-edit {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          color: var(--text-primary, #ffffff);
          padding: 0.75rem 1.35rem;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.2s ease;
        }

        .btn-edit:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .profile-body, .edit-section {
          margin-top: 2.5rem;
        }

        .meta-grid, .edit-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .meta-card {
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          background: rgba(255, 255, 255, 0.01);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .meta-card:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .meta-top {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.85rem;
          color: var(--text-muted, #8892b0);
        }

        .meta-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .meta-value {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary, #ffffff);
        }

        .social-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 2.5rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.06);
          padding-top: 2.5rem;
        }

        .social-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(0, 0, 0, 0.15);
          text-decoration: none;
          color: var(--text-secondary, #ccd6f6);
          font-size: 0.9rem;
          font-family: monospace;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          color: var(--accent, #2dd4a8);
          border-color: rgba(45, 212, 168, 0.3);
          transform: translateY(-1px);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--text-muted, #8892b0);
          padding-left: 0.25rem;
        }

        .input-field {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.95rem 1.2rem;
          color: var(--text-primary, #ffffff);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--accent, #2dd4a8);
          background: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 3px rgba(45, 212, 168, 0.15);
        }

        .action-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2.5rem;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary, #ccd6f6);
          padding: 0.85rem 1.6rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.15s ease;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-primary, #ffffff);
        }

        .btn-primary {
          background: var(--accent, #2dd4a8);
          border: 1px solid var(--accent, #2dd4a8);
          color: #0a0c10;
          padding: 0.85rem 1.8rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 20px rgba(45, 212, 168, 0.25);
          transition: all 0.2s ease;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(45, 212, 168, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin-icon {
          animation: spin 4s linear infinite;
        }

        .structural-pulse {
          animation: pulseAlpha 2s ease-in-out infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulseAlpha {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .profile-card { padding: 2rem; border-radius: 16px; }
          .profile-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .profile-main-title { font-size: 2.1rem; }
          .avatar-large { width: 80px; height: 80px; }
          .avatar-inner-text { font-size: 1.8rem; }
        }
      `}} />
    </div>
  );
}

/* =========================
   UI EXTENSION COMPONENTS
========================= */

function InputField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        className="input-field"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="meta-card">
      <div className="meta-top">
        {icon}
        <span className="meta-label">{label}</span>
      </div>
      <div className="meta-value">{value}</div>
    </div>
  );
}