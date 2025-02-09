
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Updating the Sidebar

The sidebar is organized into several components for better maintainability:

- `DesktopSidebar.tsx`: The main sidebar component for desktop views
- `MobileHeader.tsx`: The mobile version of the sidebar
- Components in `artist-sidebar/components/`:
  - `SidebarHeader.tsx`: Contains the logo and collapse button
  - `SidebarSection.tsx`: A reusable component for each section
  - `ShareButton.tsx`: Handles the share functionality

To add a new section to the sidebar:

1. Open `DesktopSidebar.tsx`
2. Add a new `SidebarSection` component with your desired content:
```tsx
<SidebarSection label="Your Label" icon={YourIcon} isCollapsed={isCollapsed}>
  <div className="space-y-1">
    {/* Your content here */}
  </div>
</SidebarSection>
```
3. Remember to add a border separator:
```tsx
<div className="border-t border-gray-300/50" />
```
4. Update `MobileHeader.tsx` with the same content to maintain consistency across devices

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9b6a2bef-cf2f-43e6-995d-06322e272a45) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
