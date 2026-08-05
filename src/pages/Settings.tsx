import { Link } from "react-router-dom";
import DashboardHeader from "../components/dashboard/layout/Header";
import { useAuth } from "../context/AuthContext";

import "../styles/Settings.css";

const Settings = () => {
  const { logoutUser } = useAuth();


  return (
    <div className="profilePage">
      <DashboardHeader />

      <main className="profileContainer">
        <div className="profileHeader">
          <div>
            <span className="profileEyebrow">
              Preferences
            </span>

            <h1>
              Settings
            </h1>

            <p>
              Manage your workspace preferences and account settings.
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
          <div className="profileContent">
            <div className="profileRow">
              <span className="profileLabel">
                Appearance
              </span>

              <div>
                Light Theme
              </div>
            </div>

            <div className="profileRow">
              <span className="profileLabel">
                Language
              </span>

              <div>
                English
              </div>
            </div>

            <div className="profileRow">
              <span className="profileLabel">
                Notifications
              </span>

              <div>
                Enabled
              </div>
            </div>

            <div className="profileRow">
              <span className="profileLabel">
                Time Zone
              </span>

              <div>
                America/New_York
              </div>
            </div>

            <div className="profileRow">
              <span className="profileLabel">
                Version
              </span>

              <div>
                TaskPilot v1.0
              </div>
            </div>

            <div className="profileDangerZone">
              <h3>
                Danger Zone
              </h3>

              <p>
                Logging out will end your current session.
              </p>

              <button
                type="button"
                className="profileDangerButton"
                onClick={logoutUser}
              >
                Log Out
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;