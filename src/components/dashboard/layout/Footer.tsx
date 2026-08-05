import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerContainer">
        <div className="footerTop">
          <div className="footerBrand">
            <Link
              to="/"
              className="footerLogo"
              aria-label="TaskPilot home"
              title="TaskPilot"
            >
              TP
            </Link>

            <div className="footerBrand__content">
              <h3>TaskPilot</h3>

              <p>
                Plan smarter.
                <br />
                Track progress.
                <br />
                Deliver better.
              </p>
            </div>
          </div>

          <nav
            className="footerLinks"
            aria-label="Footer navigation"
          >
            <div className="footerColumn">
              <h4>Product</h4>

              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/dashboard/projects">
                Projects
              </Link>

              <Link to="/dashboard/calendar">
                Calendar
              </Link>

              <Link to="/dashboard/analytics">
                Analytics
              </Link>
            </div>

            <div className="footerColumn">
              <h4>Resources</h4>

              <Link to="/documentation">
                Documentation
              </Link>

              <Link to="/help">
                Help Center
              </Link>

              <Link to="/roadmap">
                Roadmap
              </Link>

              <Link to="/faq">
                FAQ
              </Link>
            </div>

            <div className="footerColumn">
              <h4>Company</h4>

              <Link to="/about">
                About
              </Link>

              <Link to="/contact">
                Contact
              </Link>

              <Link to="/privacy">
                Privacy
              </Link>

              <Link to="/terms">
                Terms
              </Link>
            </div>
          </nav>
        </div>

        <div className="footerBottom">
          <p>
            © 2026 TaskPilot. All rights reserved.
          </p>

          <span>
            Made for modern teams.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;