# Setup Wizard Implementation Plan

## Overview
The Setup Wizard is a mandatory first-run process to initialize the system. It handles administrator creation, VRChat API integration, permission verification, and initial data synchronization.

## Architecture
- **Service Layer**: All business logic resides in `src/lib/server/wizard/service.ts`.
- **State Machine**: A state machine pattern managed via **Redis** tracks the user's progress through the wizard.
- **Background Processing**: Heavy data synchronization (logs, roles) is handled by **BullMQ** to prevent HTTP timeouts.
- **Database**: **Drizzle ORM** for persistent storage of users, credentials, and group configurations.

---

## Detailed Workflow

### Step 1: System Administrator Creation
*   **Goal**: Initialize the first user in the system.
*   **Logic**:
    *   Check if any user exists in the `users` table.
    *   If empty, allow creation of a user using the provided **VRChat UUID** and **Password**.
    *   Set the `is_system_admin` flag to `true` for this account.
    *   Authenticate the session for the new admin.
*   **Persistence**: Write to `users` table.

### Step 2: API Account Configuration
*   **Goal**: Configure the VRChat API credentials used by the bot.
*   **Logic**:
    *   User provides: Email, Password, and TOTP Secret.
    *   Options:
        *   **Same Account**: Use the Admin's own credentials.
        *   **Alt Account**: Use a dedicated bot account (recommended for security).
    *   Store credentials securely in the `vrchat_credentials` table.
*   **Persistence**: Write to `vrchat_credentials` table.

### Step 3: API Connection Verification
*   **Goal**: Ensure the provided credentials are valid and identify the API user.
*   **Logic**:
    *   Perform a login request to the VRChat API using the stored credentials.
    *   Retrieve the `username` and `id` of the authenticated API user.
    *   Return these to the UI for the Admin to verify.

### Step 4: Group Selection
*   **Goal**: Define which group the server will monitor.
*   **Logic**:
    *   Fetch all groups the API user belongs to via the VRChat API.
    *   Present a list of these groups to the Admin.
*   **Persistence**: (Temporary) Store selected `groupId` in Redis state.

### Step 5: Permission Verification
*   **Goal**: Ensure the bot has sufficient rights to perform group management.
*   **Logic**:
    *   Check if the API user is the **Owner** of the selected group.
    *   If Owner: Skip permission checks.
    *   If Not Owner: Verify if the API user has required permissions (e.g., `group_admin`, `group_mod`).
    *   If permissions are missing: Inform the Admin exactly which ones are needed.

### Step 6: Finalization & Data Sync
*   **Goal**: Complete the setup and begin data ingestion.
*   **Logic**:
    *   Link the selected Group ID to the system configuration.
    *   Clear the Wizard state in Redis.
    *   Trigger a **BullMQ** job: `initial_data_sync`.
    *   **Worker Task**: Import group roles, member lists, and historical chat logs.

---

## Data Model Requirements

### `users` table
- `id`: Primary Key
- `vrchat_uuid`: Unique VRChat identifier
- `is_system_admin`: Boolean (Set during Step 1)
- `password_hash`: For local admin login

### `vrchat_credentials` table
- `id`: Primary Key
- `user_id`: Reference to the user owning these credentials
- `email`: VRChat login email
- `password_hash`: Encrypted password
- `totp_secret`: For 2FA
- `is_alt_account`: Boolean flag
