# Notes-UI
### 1. Introduction
This project is a React application that uses Redux Toolkit and RTK Query for state management, with an architecture designed for efficient API integration, lazy-loaded routes, and secure authentication features.

### 2. Getting Started

- **Installation**: Install dependencies to set up the project.
  ```bash
  npm install
  ```
- **Running the Application**: Start the development server.
  ```bash
  npm run dev
  ```
- **Building for Production**: Compile the app for deployment.
  ```bash
  npm run build
  ```

### 3. Project Structure

- **Directory Layout**: The application is organized into main directories for better maintainability and scalability.
    - `src/components`: Houses reusable UI components, such as buttons, forms, and modals.
    - `src/features`: Contains code organized by feature, including slices, services, and utilities.
    - `src/store`: Configures the Redux store, defining slices and middleware.
    - `src/services`: Manages API service definitions and configuration, primarily using RTK Query.

### 4. Architecture

#### State Management
The application leverages Redux Toolkit to simplify state management:
- **Slices**: Define state slices for various features, like `authSlice` for authentication and `audioSlice` for audio management. Each slice includes actions and reducers.
- **Middleware**: Custom middleware, such as `rtkQueryErrorMiddleware` and `unauthenticatedMiddleware`, handle side effects like authentication status and API error handling.

#### Routing
React Router is used for client-side navigation:
- **Protected Routes**: The `ProtectedLayout` component restricts access to certain routes, redirecting unauthenticated users to the login page.
- **Lazy Loading**: Components are loaded dynamically using the `lazyWrap` utility to improve performance, with routes like `NotesPage` and `Profile` being lazy-loaded.

#### API Integration
RTK Query manages all API calls:
- **Endpoint Definitions**: Use `createApi` to define endpoints in files such as `authEndpoints.tsx` and `noteEndpoints.tsx`. Endpoints handle queries and mutations, streamlining data fetching and caching.
- **Hooks**: RTK Query automatically generates hooks like `useLoginUserMutation` and `useNotesListQuery`. These hooks simplify API interactions, managing loading and error states effectively.

### 5. Features

#### Authentication
A secure authentication flow using JWT includes:
- **Login**: Users can log in with email and password. The `useLoginUserMutation` hook handles login requests. If 2FA is required, users are redirected to `Verify2FA`.
- **Registration**: New users register using the `useRegisterUserMutation` hook, sending credentials to the `/api/register/` endpoint.
- **2FA Verification**: If required, a 2FA code is sent to the user's email. Verification is handled by the `useVerify2FACodeMutation` hook.

#### Notes Management
Users can efficiently manage their notes:
- **Create**: Add new notes using the `useNotesCreateMutation` hook.
- **Update**: Edit existing notes via the `useNotesUpdateMutation` hook. The `NoteEditor` component facilitates editing.
- **Delete**: Remove notes with the `useNotesDestroyMutation` hook. A confirmation dialog prevents accidental deletions.
- **View**: List and view note details using `useNotesListQuery` and `useNotesRetrieveQuery`.

#### Profile Management
Manage user profile data:
- **View Profile**: Display profile details with the `useGetUserProfileQuery` hook in the `ProfilePage` component.



