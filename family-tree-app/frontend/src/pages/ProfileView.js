import React from "react";
import { supabase } from "../supabase";

export default function ProfileView({
  session
}) {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">
          {session?.user?.email
            ?.charAt(0)
            .toUpperCase()}
        </div>

        <h2>FamilyRoots User</h2>

        <p>{session?.user?.email}</p>

        <button
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          <i className="ti ti-logout" />
          Logout
        </button>

      </div>

    </div>
  );
}
<div className="profile-actions">

  <button className="profile-btn">
    <i className="ti ti-user" />
    Edit Profile
  </button>

  <button className="profile-btn">
    <i className="ti ti-settings" />
    Settings
  </button>

  <button className="profile-btn">
    <i className="ti ti-help-circle" />
    Help Center
  </button>

  <button
    className="profile-btn logout-btn"
    onClick={handleLogout}
  >
    <i className="ti ti-logout" />
    Logout
  </button>

</div>