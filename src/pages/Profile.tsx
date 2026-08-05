import {
  useState,
} from "react";

import { Link } from "react-router-dom";

import DashboardHeader from "../components/dashboard/layout/Header";
import DeleteAccountModal from "../components/DeleteAccountModal";

import { useAuth } from "../context/AuthContext";

import "../styles/Profile.css";

/* =========================================================================
   PROFILE
   ========================================================================= */

const Profile = () => {

  const {
    user,
    updateCurrentUser,
    updateWorkspaceName,
    deleteCurrentAccount,
  } = useAuth();

  /* =========================================================================
     STATE
     ========================================================================= */

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    showDeleteModal,
    setShowDeleteModal,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const activeWorkspace =
    user?.workspaces.find(
      (item) =>
        item.id === user.activeWorkspaceId,
    );

  const [
    fullName,
    setFullName,
  ] = useState(
    user?.fullName ?? "",
  );

  const [
    workspaceName,
    setWorkspaceName,
  ] = useState(
    activeWorkspace?.name ?? "",
  );

  /* =========================================================================
     HELPERS
     ========================================================================= */

  const initials =
    (isEditing
      ? fullName
      : user?.fullName
    )
      ?.split(" ")
      .map(
        (part) =>
          part[0],
      )
      .join("")
      .toUpperCase()
      .slice(0,2) ?? "TP";

  /* =========================================================================
     HANDLERS
     ========================================================================= */

  const handleSave = () => {

    const trimmedName =
      fullName.trim();

    const trimmedWorkspace =
      workspaceName.trim();

    if(!trimmedName){
      setError(
        "Full name cannot be empty.",
      );
      return;
    }

    setError("");

    updateCurrentUser({
      fullName:trimmedName,
    });

    updateWorkspaceName(
      trimmedWorkspace ||
      "Personal Workspace",
    );

    setFullName(trimmedName);
    setWorkspaceName(
      trimmedWorkspace ||
      "Personal Workspace",
    );

    setIsEditing(false);
  };

  const handleCancel = () => {
    setError("");
    setFullName(
      user?.fullName ?? "",
    );
    setWorkspaceName(
      activeWorkspace?.name ?? "",
    );
    setIsEditing(false);
  };
  const handleDeleteAccount = () => {
    deleteCurrentAccount();
  };
  return(
    <div className="profilePage">
      <DashboardHeader />
      <main className="profileContainer">
        <div className="profileHeader">
          <div>
            <span className="profileEyebrow">
              Account
            </span>
            <h1>
              Profile
            </h1>
            <p>
              Manage your personal information and account details.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="profileBackButton"
          >
            Back to Dashboard
          </Link>
        </div>
        <section className="profileCard">
          <div className="profileAvatar">
            {initials}
          </div>
          <div className="profileContent">
            <div className="profileRow">
              <label htmlFor="profile-fullname">
                Full Name
              </label>
              {isEditing ? (
                <input
                  id="profile-fullname"
                  type="text"
                  className="profileInput"
                  value={fullName}
                  onChange={(event)=>
                    setFullName(
                      event.target.value,
                    )
                  }
                />
              ) : (
                <span>
                  {user?.fullName ?? "Guest"}
                </span>
              )}
            </div>
            <div className="profileRow">
              <label htmlFor="profile-workspace">
                Workspace
              </label>
              {isEditing ? (
                <input
                  id="profile-workspace"
                  type="text"
                  className="profileInput"
                  value={workspaceName}
                  onChange={(event)=>
                    setWorkspaceName(
                      event.target.value,
                    )
                  }
                />
              ) : (
                <span>
                  {workspaceName ||
                    "Personal Workspace"}
                </span>
              )}
            </div>
            <div className="profileRow">
              <span className="profileLabel">
                Email Address
              </span>
              <span>
                {user?.email ?? "No email"}
              </span>
            </div>
            <div className="profileRow">
              <span className="profileLabel">
                Role
              </span>
              <span>
                Workspace Owner
              </span>
            </div>
            {error&&(
              <p
                className="profileError"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="profileActions">
              {!isEditing ? (
                <>
                  <button
                    type="button"
                    className="profilePrimaryButton"
                    onClick={() =>
                      setIsEditing(true)
                    }
                  >
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className="profileDeleteButton"
                    onClick={() =>
                      setShowDeleteModal(true)
                    }
                  >
                    Delete Account
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="profilePrimaryButton"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="profileSecondaryButton"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      {showDeleteModal && (

        <DeleteAccountModal
          onClose={() =>
            setShowDeleteModal(false)
          }
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default Profile;