"use client";

import { FreelancerProfile } from "../types";
import { useState } from "react";

interface ProfileFormProps {
  initialProfile: FreelancerProfile;
  onUpdate: (profile: FreelancerProfile) => void;
}

export default function ProfileForm({ initialProfile, onUpdate }: ProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [skillInput, setSkillInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(profile);
  };

  const addSkill = () => {
    if (skillInput && !profile.skills.includes(skillInput)) {
      const newProfile = { ...profile, skills: [...profile.skills, skillInput] };
      setProfile(newProfile);
      setSkillInput("");
      onUpdate(newProfile);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newProfile = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    setProfile(newProfile);
    onUpdate(newProfile);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4">Freelancer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            value={profile.hourlyRate}
            onChange={(e) => setProfile({ ...profile, hourlyRate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Bio</label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
            rows={3}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Skills</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. React"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 text-indigo-500 hover:text-indigo-700"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
