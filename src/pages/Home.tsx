import { Link } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  FolderKanban,
  ListChecks,
  Users,
  Zap,
} from "lucide-react";
import "../styles/Home.css";

const Home = () => {
  return (
    <main className="home">
      <header className="homeHeader">
        <div className="homeContainer homeHeader__inner">
          <Link to="/" className="homeLogo" aria-label="TaskPilot home">
            <span className="homeLogo__icon">TP</span>
            <span className="homeLogo__text">
              <strong>TaskPilot</strong>
              <small>Project Management Platform</small>
            </span>
          </Link>
          <nav className="homeNavigation" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#workspace">Workspace</a>
            <a href="#workflow">Workflow</a>
            <Link to="/login" className="homeLogin">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="homeContainer heroLayout">
          <div className="heroContent">
            <span className="heroBadge">
              <Zap aria-hidden="true" />
              Modern project management
            </span>
            <h1>
              Stay focused.
              <br />
              Deliver faster.
            </h1>
            <p>
              Organize projects, manage priorities and keep every deadline
              under control inside one clean productivity workspace.
            </p>
            <div className="heroButtons">
              <Link to="/register" className="button buttonPrimary">
                Start Free
              </Link>
              <Link to="/login" className="button buttonSecondary">
                Open Workspace
              </Link>
            </div>
            <div className="heroTrust">
              <span>
                <CheckCircle2 aria-hidden="true" />
                No credit card
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" />
                Free workspace
              </span>
              <span>
                <CheckCircle2 aria-hidden="true" />
                Setup in minutes
              </span>
            </div>
          </div>

          <div className="heroPreview" aria-label="TaskPilot dashboard preview">
            <div className="heroGlow" />
            <div className="heroWindow">
              <div className="heroWindow__top">
                <div className="heroWindow__dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="heroWindow__label">TaskPilot Workspace</span>
              </div>
              <div className="heroWindow__layout">
                <aside className="heroWindow__sidebar" aria-hidden="true">
                  <span className="heroWindow__miniLogo">TP</span>
                  <div className="heroWindow__sideLinks">
                    <span className="heroWindow__sideLink heroWindow__sideLink--active" />
                    <span className="heroWindow__sideLink" />
                    <span className="heroWindow__sideLink" />
                    <span className="heroWindow__sideLink" />
                  </div>
                </aside>
                <div className="heroWindow__body">
                  <div className="windowHeader">
                    <div>
                      <small>Current workspace</small>
                      <h3>Product Launch</h3>
                    </div>
                    <span className="windowLive">
                      <i />
                      Live
                    </span>
                  </div>
                  <div className="windowStats">
                    <article>
                      <small>Active tasks</small>
                      <strong>24</strong>
                      <span>6 due today</span>
                    </article>
                    <article>
                      <small>Completed</small>
                      <strong>82%</strong>
                      <span>+12% this week</span>
                    </article>
                    <article>
                      <small>Projects</small>
                      <strong>8</strong>
                      <span>3 in progress</span>
                    </article>
                  </div>
                  <div className="windowProgress">
                    <div className="windowProgress__head">
                      <div>
                        <strong>Website redesign</strong>
                        <small>Project progress</small>
                      </div>
                      <span>82%</span>
                    </div>
                    <div className="windowProgress__bar">
                      <span />
                    </div>
                  </div>
                  <div className="windowTasks">
                    <article className="windowTask">
                      <span className="windowTask__check windowTask__check--done">
                        <CheckCircle2 aria-hidden="true" />
                      </span>
                      <div>
                        <strong>Build dashboard layout</strong>
                        <small>Completed today</small>
                      </div>
                      <span className="windowTask__status windowTask__status--done">
                        Done
                      </span>
                    </article>
                    <article className="windowTask">
                      <span className="windowTask__check">
                        <ListChecks aria-hidden="true" />
                      </span>
                      <div>
                        <strong>Connect analytics module</strong>
                        <small>Due tomorrow</small>
                      </div>
                      <span className="windowTask__status">Active</span>
                    </article>
                    <article className="windowTask">
                      <span className="windowTask__check">
                        <CalendarDays aria-hidden="true" />
                      </span>
                      <div>
                        <strong>Prepare launch presentation</strong>
                        <small>Friday, 10:00 AM</small>
                      </div>
                      <span className="windowTask__status windowTask__status--high">
                        High
                      </span>
                    </article>
                  </div>
                </div>
              </div>
            </div>
            <div className="heroFloatingCard heroFloatingCard--tasks">
              <span>Tasks completed</span>
              <strong>18 / 24</strong>
            </div>
            <div className="heroFloatingCard heroFloatingCard--team">
              <span>Team activity</span>
              <strong>12 online</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="homeOverlap homeOverlap--features">
        <div className="homeContainer">
          <div className="featuresPanel homeReveal">
            <div className="sectionTitle">
              <span>Everything in one place</span>
              <h2>Built for focused, productive work.</h2>
              <p>
                TaskPilot gives you the tools to plan, prioritize and deliver
                without unnecessary complexity.
              </p>
            </div>
            <div className="featuresGrid">
              <article className="featureCard">
                <span className="featureIcon">
                  <FolderKanban aria-hidden="true" />
                </span>
                <h3>Projects</h3>
                <p>
                  Organize every initiative inside clear, dedicated workspaces.
                </p>
                <span className="featureCard__number">01</span>
              </article>
              <article className="featureCard">
                <span className="featureIcon">
                  <ListChecks aria-hidden="true" />
                </span>
                <h3>Task tracking</h3>
                <p>
                  Manage priorities, due dates, statuses and daily progress.
                </p>
                <span className="featureCard__number">02</span>
              </article>
              <article className="featureCard">
                <span className="featureIcon">
                  <BarChart3 aria-hidden="true" />
                </span>
                <h3>Analytics</h3>
                <p>
                  Understand productivity through focused, useful insights.
                </p>
                <span className="featureCard__number">03</span>
              </article>
              <article className="featureCard">
                <span className="featureIcon">
                  <Users aria-hidden="true" />
                </span>
                <h3>Collaboration</h3>
                <p>
                  Keep work, responsibilities and progress visible to everyone.
                </p>
                <span className="featureCard__number">04</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="workspace" className="homeOverlap homeOverlap--workspace">
        <div className="homeContainer">
          <div className="workspaceShowcase homeReveal">
            <div className="workspaceShowcase__content">
              <span className="sectionEyebrow">One clear workspace</span>
              <h2>See what matters without losing your focus.</h2>
              <p>
                Tasks, deadlines, projects and progress stay connected inside
                one responsive dashboard designed for everyday work.
              </p>
              <ul className="workspaceBenefits">
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Drag-and-drop task organization
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Priority and deadline management
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Calendar planning and project views
                </li>
                <li>
                  <CheckCircle2 aria-hidden="true" />
                  Live productivity statistics
                </li>
              </ul>
            </div>
            <div className="workspaceMetrics">
              <article className="workspaceMetric">
                <span>Active tasks</span>
                <strong>24</strong>
                <small>Across 8 projects</small>
              </article>
              <article className="workspaceMetric workspaceMetric--featured">
                <span>Completion rate</span>
                <strong>82%</strong>
                <div className="workspaceMetric__bar">
                  <i />
                </div>
              </article>
              <article className="workspaceMetric">
                <span>Upcoming</span>
                <strong>06</strong>
                <small>Deadlines this week</small>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="homeOverlap homeOverlap--workflow">
        <div className="homeContainer">
          <div className="workflowPanel homeReveal">
            <div className="workflowPanel__header">
              <div>
                <span className="sectionEyebrow">A smarter workflow</span>
                <h2>Plan. Prioritize. Complete.</h2>
              </div>
              <p>
                Move from ideas to finished work through a simple process that
                keeps every step visible.
              </p>
            </div>
            <div className="workflowSteps">
              <article>
                <span>01</span>
                <h3>Create your workspace</h3>
                <p>Separate personal tasks, team projects and client work.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Set clear priorities</h3>
                <p>Add deadlines, categories and priority levels to each task.</p>
              </article>
              <article>
                <span>03</span>
                <h3>Track real progress</h3>
                <p>Complete work and see productivity update automatically.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="homeOverlap homeOverlap--cta">
        <div className="homeContainer">
          <div className="ctaCard homeReveal">
            <span className="ctaCard__eyebrow">Ready to get organized?</span>
            <h2>Build a calmer, more productive workflow.</h2>
            <p>
              Create your TaskPilot workspace and start managing your work with
              clarity.
            </p>
            <div className="ctaCard__actions">
              <Link to="/register" className="button ctaPrimaryButton">
                Create Free Account
              </Link>
              <Link to="/login" className="button ctaSecondaryButton">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;