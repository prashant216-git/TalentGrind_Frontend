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

  const [isEditing, setIsEditing] =
    useState(false);

  /* =========================
     FORM STATE
  ========================= */

  const [name, setName] = useState('');

  const [role, setRole] = useState('');

  const [company, setCompany] =
    useState('');

  const [college, setCollege] =
    useState('');

  const [country, setCountry] =
    useState('');

  const [state, setState] = useState('');

  const [city, setCity] = useState('');

  const [github, setGithub] =
    useState('');

  const [linkedin, setLinkedin] =
    useState('');

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
      const data =
        await apiFetch<Profile>(
          'profile/profile'
        );

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
    mutationFn: (
      updated: Partial<Profile>
    ) =>
      apiFetch<Profile>(
        'profile/profile',
        {
          method: 'POST',

          body: JSON.stringify(updated),
        }
      ),

    onSuccess: (data) => {
      queryClient.setQueryData(
        ['user', 'profile'],
        data
      );

      setIsEditing(false);
    },
  });

  /* =========================
     SAVE
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

  /* =========================
     CANCEL
  ========================= */

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

  /* =========================
     LOADING
  ========================= */

  if (isLoading) {
    return (
      <div
        className="page-container flex-center"
        style={{ minHeight: '80vh' }}
      >
        <div className="editorial-label">
          Loading Identity Matrix...
        </div>
      </div>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (isError || !profile) {
    return (
      <div
        className="page-container flex-center"
        style={{
          minHeight: '70vh',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2>Profile Unavailable</h2>

        <p
          style={{
            color: 'var(--text-muted)',
          }}
        >
          Failed to load contender
          profile.
        </p>
      </div>
    );
  }

  /* =========================
     AVATAR
  ========================= */

  const displayName =
    profile.name ||
    profile.email ||
    'Talent Grind';

  const initial = displayName
    .substring(0, 2)
    .toUpperCase();

  const locationText = [
    profile.city,
    profile.state,
    profile.country,
  ]
    .filter(Boolean)
    .join(', ');

  /* =========================
     UI
  ========================= */

  return (
    <div
      className="page-container flex-center"
      style={{
        minHeight: '100vh',
        padding: '2rem',
      }}
    >
      <div className="profile-card fade-in">
        {/* =========================
            HEADER
        ========================= */}

        <div className="profile-header">
          <div className="avatar-large">
            {initial}
          </div>

          <div className="profile-info">
            <span className="editorial-label">
              TALENTGRIND CONTESTANT
            </span>

            <h1>{displayName}</h1>

            <p className="email-text">
              {profile.email}
            </p>

            <div className="grinder-badge">
              <Sparkles size={12} />

              VERIFIED GRINDER
            </div>
          </div>

          {!isEditing && (
            <button
              className="btn-edit"
              onClick={() =>
                setIsEditing(true)
              }
            >
              <Edit3 size={14} />
              EDIT PROFILE
            </button>
          )}
        </div>

        {/* =========================
            EDIT MODE
        ========================= */}

        {isEditing ? (
          <div className="edit-section">
            <div className="edit-grid">
              <InputField
                label="Name"
                value={name}
                setValue={setName}
              />

              <InputField
                label="Role"
                value={role}
                setValue={setRole}
              />

              <InputField
                label="Company"
                value={company}
                setValue={setCompany}
              />

              <InputField
                label="College"
                value={college}
                setValue={setCollege}
              />

              <InputField
                label="Country"
                value={country}
                setValue={setCountry}
              />

              <InputField
                label="State"
                value={state}
                setValue={setState}
              />

              <InputField
                label="City"
                value={city}
                setValue={setCity}
              />

              <InputField
                label="GitHub"
                value={github}
                setValue={setGithub}
              />

              <InputField
                label="LinkedIn"
                value={linkedin}
                setValue={setLinkedin}
              />
            </div>

            <div className="action-row">
              <button
                className="btn-outline"
                onClick={handleCancel}
              >
                <X size={14} />
                Cancel
              </button>

              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={
                  updateMutation.isPending
                }
              >
                <Save size={14} />

                {updateMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          /* =========================
             VIEW MODE
          ========================= */

          <div className="profile-body">
            <div className="meta-grid">
              <MetaCard
                icon={<Briefcase size={16} />}
                label="ROLE"
                value={
                  profile.role ||
                  'Not Specified'
                }
              />

              <MetaCard
                icon={<Building size={16} />}
                label="COMPANY"
                value={
                  profile.company ||
                  'Independent'
                }
              />

              <MetaCard
                icon={
                  <GraduationCap size={16} />
                }
                label="COLLEGE"
                value={
                  profile.college ||
                  'Unknown'
                }
              />

              <MetaCard
                icon={<Globe size={16} />}
                label="LOCATION"
                value={
                  locationText ||
                  'Unknown'
                }
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
                  <Github size={16} />
                  {profile.github}
                </a>
              )}

              {profile.linkedin && (
                <a
                  href={`https://linkedin.com/in/${profile.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn"
                >
                  <Linkedin size={16} />
                  {profile.linkedin}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================
          STYLES
      ========================= */}

      <style>{`
        .profile-card {
          width: 100%;
          max-width: 850px;

          background: var(--bg-surface);

          border: 1px solid var(--border-default);

          border-radius: 2rem;

          padding: 3rem;

          box-shadow: var(--shadow-soft);
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .avatar-large {
          width: 90px;
          height: 90px;

          border-radius: 50%;

          background: rgba(45,212,168,0.08);

          border: 2px solid var(--text-primary);

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 2rem;

          font-family: var(--font-display);

          color: var(--text-primary);
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          margin-top: 0.35rem;
          font-size: 3rem;
        }

        .email-text {
          margin-top: 0.5rem;
          color: var(--text-muted);
        }

        .grinder-badge {
          margin-top: 1rem;

          display: inline-flex;
          align-items: center;
          gap: 0.5rem;

          padding: 0.45rem 1rem;

          border-radius: 999px;

          border: 1px solid var(--border-active);

          background: rgba(45,212,168,0.08);

          color: var(--accent);

          font-size: 0.75rem;

          letter-spacing: 0.1em;
        }

        .btn-edit {
          border: 1px solid var(--border-default);

          background: transparent;

          color: var(--text-primary);

          padding: 0.85rem 1.2rem;

          border-radius: 999px;

          cursor: pointer;

          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-body {
          margin-top: 3rem;
        }

        .meta-grid {
          display: grid;

          grid-template-columns: repeat(auto-fit,minmax(240px,1fr));

          gap: 1.5rem;
        }

        .meta-card {
          padding: 1.5rem;

          border-radius: 1.5rem;

          border: 1px solid var(--border-default);

          background: rgba(255,255,255,0.02);
        }

        .meta-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          margin-bottom: 1rem;
        }

        .meta-label {
          font-size: 0.7rem;

          letter-spacing: 0.18em;

          color: var(--text-muted);
        }

        .meta-value {
          font-size: 1.1rem;
        }

        .social-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;

          margin-top: 2rem;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;

          padding: 0.85rem 1.2rem;

          border-radius: 1rem;

          border: 1px solid var(--border-default);

          text-decoration: none;

          color: var(--text-secondary);
        }

        .edit-section {
          margin-top: 3rem;
        }

        .edit-grid {
          display: grid;

          grid-template-columns: repeat(auto-fit,minmax(240px,1fr));

          gap: 1.25rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-size: 0.7rem;

          letter-spacing: 0.18em;

          color: var(--text-muted);
        }

        .input-field {
          background: transparent;

          border: 1px solid var(--border-default);

          border-radius: 1rem;

          padding: 1rem;

          color: var(--text-primary);
        }

        .action-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;

          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 2rem;
          }

          .profile-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .profile-info h1 {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================
   INPUT FIELD
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
      <label className="input-label">
        {label}
      </label>

      <input
        className="input-field"
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
      />
    </div>
  );
}

/* =========================
   META CARD
========================= */

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

        <span className="meta-label">
          {label}
        </span>
      </div>

      <div className="meta-value">
        {value}
      </div>
    </div>
  );
}