"use client";

import React, { useState, useEffect } from 'react';
import { Camera, Upload, Plus, X, FileText, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('resume');
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: '' });
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const profileRes = await fetch('/api/admin/profile', {
        headers: {
          'x-user-id': 'current-user-id' // Replace with actual auth
        }
      });
      const profileData = await profileRes.json();
      setProfile(profileData);
      setEditedProfile(profileData);

      // Fetch skills and certifications
      const skillsRes = await fetch('/api/admin/skills', {
        headers: {
          'x-user-id': 'current-user-id' // Replace with actual auth
        }
      });
      const skillsData = await skillsRes.json();
      setSkills(skillsData.skills || []);
      setCertifications(skillsData.certifications || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'current-user-id'
        },
        body: JSON.stringify(editedProfile)
      });

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.type) return;

    try {
      const response = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'current-user-id'
        },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        await fetchData();
        setNewItem({ name: '', type: '' });
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`/api/admin/skills?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'current-user-id'
        }
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#b8860b] text-xl font-light tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8] font-serif">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-sm font-light tracking-[0.3em] uppercase text-[#b8860b]">
                Dayflow HRMS
              </h1>
              <nav className="flex gap-8">
                <button className="text-sm tracking-wider hover:text-[#b8860b] transition-colors duration-300">
                  Company Logo
                </button>
                <button className="text-sm tracking-wider hover:text-[#b8860b] transition-colors duration-300">
                  Employees
                </button>
                <button className="text-sm tracking-wider hover:text-[#b8860b] transition-colors duration-300">
                  Attendance
                </button>
                <button className="text-sm tracking-wider hover:text-[#b8860b] transition-colors duration-300">
                  Time Off
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b8860b] to-[#8b6914] flex items-center justify-center">
                <span className="text-sm font-light">
                  {profile?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                <span className="text-xs">🔔</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-light tracking-wide mb-2">Administrator Profile</h2>
          <p className="text-[#888] text-sm tracking-wider">Manage your professional information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-none mb-8">
          <div className="p-8">
            <div className="flex gap-12">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#4a2c2a] via-[#6b4e4e] to-[#3a1f1f] border-2 border-[#b8860b] flex items-center justify-center overflow-hidden">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-[#b8860b]" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#b8860b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Upload className="w-4 h-4 text-[#0a0a0a]" />
                </button>
              </div>

              {/* Profile Details */}
              <div className="flex-1 grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] focus:border-[#b8860b] outline-none transition-colors"
                      />
                    ) : (
                      <div className="text-lg tracking-wide border-b border-[#2a2a2a] pb-2">
                        {profile?.name || '—'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Login ID</label>
                    <div className="text-sm font-mono text-[#b8860b] border-b border-[#2a2a2a] pb-2">
                      {profile?.loginId || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] focus:border-[#b8860b] outline-none transition-colors"
                      />
                    ) : (
                      <div className="text-sm border-b border-[#2a2a2a] pb-2">
                        {profile?.email || '—'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Mobile Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.mobile || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, mobile: e.target.value })}
                        className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] focus:border-[#b8860b] outline-none transition-colors"
                      />
                    ) : (
                      <div className="text-sm border-b border-[#2a2a2a] pb-2">
                        {profile?.mobile || '—'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Company</label>
                    <div className="text-sm border-b border-[#2a2a2a] pb-2">
                      {profile?.company || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.department || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                        className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] focus:border-[#b8860b] outline-none transition-colors"
                      />
                    ) : (
                      <div className="text-sm border-b border-[#2a2a2a] pb-2">
                        {profile?.department || '—'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Position</label>
                    <div className="text-sm border-b border-[#2a2a2a] pb-2">
                      {profile?.role || '—'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.location || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] focus:border-[#b8860b] outline-none transition-colors"
                      />
                    ) : (
                      <div className="text-sm border-b border-[#2a2a2a] pb-2">
                        {profile?.location || '—'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#2a2a2a] flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="px-8 py-2.5 bg-[#b8860b] text-[#0a0a0a] text-sm tracking-wider uppercase hover:bg-[#d4a824] transition-all duration-300"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}
                    className="px-8 py-2.5 border border-[#2a2a2a] text-sm tracking-wider uppercase hover:border-[#b8860b] transition-all duration-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-2.5 border border-[#b8860b] text-[#b8860b] text-sm tracking-wider uppercase hover:bg-[#b8860b] hover:text-[#0a0a0a] transition-all duration-300"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-[#2a2a2a]">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-3 text-sm tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'resume'
                ? 'bg-[#0f0f0f] text-[#b8860b] border-b-2 border-[#b8860b]'
                : 'text-[#888] hover:text-[#e8e8e8]'
            }`}
          >
            Resume
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`px-6 py-3 text-sm tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'private'
                ? 'bg-[#0f0f0f] text-[#b8860b] border-b-2 border-[#b8860b]'
                : 'text-[#888] hover:text-[#e8e8e8]'
            }`}
          >
            Private Info
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-6 py-3 text-sm tracking-wider uppercase transition-all duration-300 ${
              activeTab === 'salary'
                ? 'bg-[#0f0f0f] text-[#b8860b] border-b-2 border-[#b8860b]'
                : 'text-[#888] hover:text-[#e8e8e8]'
            }`}
          >
            Salary Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-2 gap-8">
          {activeTab === 'resume' && (
            <>
              {/* About Section */}
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-8">
                <h3 className="text-sm tracking-widest uppercase text-[#b8860b] mb-6">About</h3>
                <p className="text-sm leading-relaxed text-[#b8b8b8] mb-6">
                  Experienced administrator with expertise in human resources management systems. 
                  Proficient in handling employee data, attendance tracking, and leave management.
                  Committed to streamlining HR processes and improving organizational efficiency.
                </p>
                <h4 className="text-sm tracking-wider uppercase text-[#e8e8e8] mb-4 mt-8">
                  What I love about my job
                </h4>
                <p className="text-sm leading-relaxed text-[#b8b8b8] mb-6">
                  Creating efficient systems that help teams focus on what matters most. 
                  Building connections across departments and fostering a positive workplace culture.
                </p>
                <h4 className="text-sm tracking-wider uppercase text-[#e8e8e8] mb-4">
                  My interests and hobbies
                </h4>
                <p className="text-sm leading-relaxed text-[#b8b8b8]">
                  Process optimization, data analytics, team building activities, 
                  continuous learning in HR technology and best practices.
                </p>
              </div>

              {/* Skills Section */}
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm tracking-widest uppercase text-[#b8860b]">
                    <FileText className="inline-block w-4 h-4 mr-2" />
                    Skills
                  </h3>
                  <button
                    onClick={() => setNewItem({ name: '', type: 'skill' })}
                    className="w-8 h-8 border border-[#2a2a2a] flex items-center justify-center hover:border-[#b8860b] hover:text-[#b8860b] transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between py-3 border-b border-[#1a1a1a] group"
                      >
                        <span className="text-sm tracking-wide">{skill.name}</span>
                        <button
                          onClick={() => handleDeleteItem(skill.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-[#b8860b] transition-all duration-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#555] text-sm italic">
                      No skills added yet
                    </div>
                  )}
                </div>

                {newItem.type === 'skill' && (
                  <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                    <input
                      type="text"
                      placeholder="Enter skill name..."
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] placeholder-[#555] focus:border-[#b8860b] outline-none transition-colors mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddItem}
                        className="px-6 py-2 bg-[#b8860b] text-[#0a0a0a] text-xs tracking-wider uppercase hover:bg-[#d4a824] transition-all duration-300"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setNewItem({ name: '', type: '' })}
                        className="px-6 py-2 border border-[#2a2a2a] text-xs tracking-wider uppercase hover:border-[#b8860b] transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Certifications Section */}
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-8 col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm tracking-widest uppercase text-[#b8860b]">
                    <Award className="inline-block w-4 h-4 mr-2" />
                    Certifications
                  </h3>
                  <button
                    onClick={() => setNewItem({ name: '', type: 'certification' })}
                    className="w-8 h-8 border border-[#2a2a2a] flex items-center justify-center hover:border-[#b8860b] hover:text-[#b8860b] transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 min-h-[150px]">
                  {certifications.length > 0 ? (
                    certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="border border-[#2a2a2a] p-4 group hover:border-[#b8860b] transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Award className="w-5 h-5 text-[#b8860b]" />
                          <button
                            onClick={() => handleDeleteItem(cert.id)}
                            className="opacity-0 group-hover:opacity-100 text-[#888] hover:text-[#b8860b] transition-all duration-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm tracking-wide">{cert.name}</p>
                        <p className="text-xs text-[#888] mt-2">
                          {new Date(cert.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 flex items-center justify-center h-full text-[#555] text-sm italic">
                      No certifications added yet
                    </div>
                  )}
                </div>

                {newItem.type === 'certification' && (
                  <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                    <input
                      type="text"
                      placeholder="Enter certification name..."
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full bg-[#1a1a1a] border-b border-[#2a2a2a] py-2 text-[#e8e8e8] placeholder-[#555] focus:border-[#b8860b] outline-none transition-colors mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddItem}
                        className="px-6 py-2 bg-[#b8860b] text-[#0a0a0a] text-xs tracking-wider uppercase hover:bg-[#d4a824] transition-all duration-300"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setNewItem({ name: '', type: '' })}
                        className="px-6 py-2 border border-[#2a2a2a] text-xs tracking-wider uppercase hover:border-[#b8860b] transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'private' && (
            <div className="col-span-2 bg-[#0f0f0f] border border-[#2a2a2a] p-8">
              <h3 className="text-sm tracking-widest uppercase text-[#b8860b] mb-6">Private Information</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Employee ID</label>
                  <div className="text-sm font-mono border-b border-[#2a2a2a] pb-2">{profile?.loginId}</div>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Joining Date</label>
                  <div className="text-sm border-b border-[#2a2a2a] pb-2">
                    {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : '—'}
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Employment Status</label>
                  <div className="text-sm border-b border-[#2a2a2a] pb-2">
                    {profile?.employmentStatus || '—'}
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Full Address</label>
                  <div className="text-sm border-b border-[#2a2a2a] pb-2">
                    {profile?.location || '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'salary' && (
            <div className="col-span-2 bg-[#0f0f0f] border border-[#2a2a2a] p-8">
              <h3 className="text-sm tracking-widest uppercase text-[#b8860b] mb-6">Compensation Details</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Base Salary</label>
                  <div className="text-lg font-light border-b border-[#2a2a2a] pb-2">
                    ${profile?.baseSalary || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Allowances</label>
                  <div className="text-lg font-light border-b border-[#2a2a2a] pb-2">
                    ${profile?.allowances || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Deductions</label>
                  <div className="text-lg font-light border-b border-[#2a2a2a] pb-2 text-[#d47474]">
                    -${profile?.deductions || '0.00'}
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-widest uppercase text-[#888] mb-2 block">Net Salary</label>
                  <div className="text-xl font-light border-b-2 border-[#b8860b] pb-2 text-[#b8860b]">
                    ${profile?.netSalary || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;