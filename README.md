> [!IMPORTANT]
> This project was vibe coded with [Cursor](https://www.cursor.so/) 🚀

# Curstor Trail - Personal Trail Running Website

A personal website built with Next.js, Shadcn/UI, and Juno for sharing trail running adventures with detailed routes, photos, and experiences.

## Features

- **Trail Management**: Add and manage your trail running adventures
- **GPX Integration**: Upload GPX files to automatically extract route data
- **Photo Gallery**: Upload and display photos from your trail runs
- **Interactive Maps**: View trail routes on interactive maps
- **Admin Panel**: Easy-to-use interface for adding new trails
- **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI**: Shadcn/UI components with Tailwind CSS
- **Backend**: Juno (Internet Computer) with Rust serverless functions
- **Maps**: Leaflet with React-Leaflet
- **GPX Parsing**: gpxparser library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Juno CLI (for deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd curstortrail
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Juno**

   First, install the Juno CLI:

   ```bash
   npm i -g @junobuild/cli
   ```

   Start the local emulator:

   ```bash
   juno dev start
   ```

   Open the Console UI at [http://localhost:5866/](http://localhost:5866/)

4. **Create a Satellite and Collections**
   - Sign in to the Juno Console
   - Create a new Satellite
   - Navigate to the **Datastore** section
   - Create the following collections:
     - **trails** (for trail documents)
     - **files** (for uploaded files/photos)
     - **stats** (for aggregated statistics)

5. **Configure the Satellite ID**

   Update the `juno.config.mjs` file with your Satellite ID:

   ```javascript
   export default defineConfig({
     satellite: {
       ids: {
         development: "YOUR_DEV_SATELLITE_ID",
         production: "YOUR_PROD_SATELLITE_ID",
       },
       source: "out",
       predeploy: ["npm run build"],
     },
   });
   ```

6. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the website.

## Usage

### Adding a New Trail

1. Navigate to the **Admin** section
2. Fill in the trail information:
   - **Trail Name**: The name of your trail run
   - **Location**: Where the trail is located
   - **Description**: Your experience and notes
   - **Distance**: Total distance in kilometers
   - **Elevation**: Total elevation gain in meters
   - **Duration**: How long the run took
   - **Difficulty**: Easy, Moderate, Hard, or Expert
   - **Date**: When you ran the trail

3. **Upload GPX File** (Optional):
   - Upload a GPX file to automatically extract distance, elevation, and duration
   - The route will be displayed on an interactive map

4. **Add Photos**:
   - Upload photos from your trail run
   - Photos will be displayed in a gallery

5. Click **Add Trail** to save

### Viewing Trails

- **Home Page**: Overview of your trail running adventures
- **Trails Page**: Browse all your trail runs with details
- **Individual Trail Pages**: Detailed view with maps and photos

## Project Structure

```
curstortrail/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin interface
│   │   ├── trails/         # Trail listing and details
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn/UI components
│   │   └── navigation.tsx # Navigation component
│   ├── lib/               # Utility functions
│   │   ├── juno.ts        # Juno integration
│   │   └── gpx-parser.ts  # GPX file parsing
│   └── types/             # TypeScript type definitions
│       └── trail.ts       # Trail data types
│   └── satellite/         # Rust serverless functions (see below)
├── juno.config.mjs        # Juno configuration
└── package.json           # Dependencies and scripts
```

## Collections

- **trails**: Stores individual trail documents
- **files**: Stores uploaded files and photos
- **stats**: Stores aggregated statistics (auto-updated by serverless functions)

## Serverless Functions (Rust Satellite)

All backend/serverless logic is implemented in Rust in `src/satellite/`.

### How to Build the Serverless Functions

1. **Local Build (for development):**

   ```bash
   juno dev build
   ```

   This will compile your Rust satellite and make it available to the local emulator.

2. **Production Build & Deploy:**
   ```bash
   juno deploy
   ```
   This will build and deploy your Rust serverless functions and frontend to your Juno Satellite on mainnet.

- You do **not** need to set up `.env.local` or `NEXT_PUBLIC_SATELLITE_ID`—the Juno plugins handle configuration automatically.
- To update serverless logic, edit the Rust code in `src/satellite/src/lib.rs` and rebuild as above.

## Deployment

### Local Development

The app is configured to work with Juno's local emulator for development.

### Production Deployment

1. **Deploy to Juno**:

   ```bash
   juno deploy
   ```

2. **Set up production Satellite ID**:
   Update the `juno.config.mjs` with your production Satellite ID

## Customization

### Styling

The app uses Tailwind CSS with Shadcn/UI components. You can customize:

- **Colors**: Update the CSS variables in `src/app/globals.css`
- **Components**: Modify Shadcn/UI components in `src/components/ui/`
- **Layout**: Update the navigation and page layouts

### Adding Features

- **Authentication**: Integrate Juno's authentication system
- **Comments**: Add commenting system for trails
- **Social Sharing**: Add social media sharing buttons
- **Advanced Analytics**: Track trail statistics and achievements

## Troubleshooting

### Common Issues

1. **Juno not connecting**: Make sure the emulator is running and Satellite ID is correct
2. **GPX parsing errors**: Ensure the GPX file is valid and contains track data
3. **Photo upload issues**: Check file size limits and supported formats

### Getting Help

- Check the [Juno documentation](https://juno.build/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Explore [Shadcn/UI components](https://ui.shadcn.com)

## License

This project is open source and available under the MIT License.
