import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  StoredAuthUser,
} from "../types/auth";

const USERS_KEY = "taskpilot_users";
const SESSION_KEY = "taskpilot_session";
const PENDING_EMAIL_KEY = "taskpilot_pending_email";

/* ==========================================================================
   STORAGE
   ========================================================================== */

const readUsers = (): StoredAuthUser[] => {
  try {
    const value = localStorage.getItem(USERS_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: StoredAuthUser[]): void => {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users),
  );
};

const saveSession = (
  user: AuthUser,
): void => {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user),
  );
};

const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

const readSession = (): AuthUser | null => {
  try {
    const value =
      localStorage.getItem(SESSION_KEY);

    return value
      ? JSON.parse(value)
      : null;
  } catch {
    return null;
  }
};

/* ==========================================================================
   HELPERS
   ========================================================================== */

const createId = (): string => {
  return crypto.randomUUID();
};

const normalizeEmail = (
  email: string,
): string => email.trim().toLowerCase();

const normalizeName = (
  name: string,
): string => name.trim();

const createWorkspaceName = (
  fullName: string,
  workspace?: string,
): string =>
  workspace?.trim() ||
  `${normalizeName(fullName)}'s Workspace`;

const hashPassword = async (
  password: string,
): Promise<string> => {
  const bytes =
    new TextEncoder().encode(password);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      bytes,
    );

  return Array.from(
    new Uint8Array(hash),
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
};

const toAuthUser = (
  user: StoredAuthUser,
): AuthUser => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  workspaceName: user.workspaceName,
});

/* ==========================================================================
   AUTH SERVICE
   ========================================================================== */

export const authService = {
  getCurrentUser(): AuthUser | null {
    return readSession();
  },

  async login({
    email,
    password,
  }: LoginCredentials): Promise<AuthUser> {
    const normalizedEmail =
      normalizeEmail(email);

    const passwordHash =
      await hashPassword(password);

    const user =
      readUsers().find(
        (storedUser) =>
          storedUser.email ===
            normalizedEmail &&
          storedUser.passwordHash ===
            passwordHash,
      );

    if (!user) {
      throw new Error(
        "Invalid email or password.",
      );
    }

    const authUser =
      toAuthUser(user);

    saveSession(authUser);

    return authUser;
  },

  async register({
    email,
    fullName,
    password,
    workspaceName,
  }: RegisterCredentials): Promise<AuthUser> {
    const users = readUsers();

    const normalizedEmail =
      normalizeEmail(email);

    if (
      users.some(
        (user) =>
          user.email ===
          normalizedEmail,
      )
    ) {
      throw new Error(
        "An account with this email already exists.",
      );
    }

    if (password.length < 8) {
      throw new Error(
        "Password must contain at least 8 characters.",
      );
    }

    const newUser: StoredAuthUser = {
      id: createId(),
      email: normalizedEmail,
      fullName: normalizeName(fullName),
      workspaceName:
        createWorkspaceName(
          fullName,
          workspaceName,
        ),
      passwordHash:
        await hashPassword(password),
    };

    writeUsers([
      ...users,
      newUser,
    ]);

    const authUser =
      toAuthUser(newUser);

    saveSession(authUser);

    sessionStorage.removeItem(
      PENDING_EMAIL_KEY,
    );

    return authUser;
  },

  logout(): void {
    clearSession();
  },

  setPendingEmail(
    email: string,
  ): void {
    sessionStorage.setItem(
      PENDING_EMAIL_KEY,
      normalizeEmail(email),
    );
  },

  getPendingEmail(): string {
    return (
      sessionStorage.getItem(
        PENDING_EMAIL_KEY,
      ) ?? ""
    );
  },

  clearPendingEmail(): void {
    sessionStorage.removeItem(
      PENDING_EMAIL_KEY,
    );
  },
};