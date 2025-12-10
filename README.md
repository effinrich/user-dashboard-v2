# User Dashboard

A React.js dashboard application for managing users with an automated data quality scoring system and manual scoring capabilities.

![Dashboard Preview](./docs/preview.png)

## Features

- **User Management**: Full CRUD operations for user records
- **Automated Data Quality Scoring**: Based on data completeness, zip code validation, and geo-lookup success
- **Manual Scoring System**: Inline editable scores for each user (0-100)
- **Geo-Location Integration**: Automatic lat/lng/timezone lookup via OpenWeatherMap API
- **Visual Dashboard**: Score distribution charts and statistics
- **Color-Coded Rows**: Visual indicators based on combined score averages
- **Pagination**: Efficient handling of large user datasets
- **Real-time Updates**: Optimistic UI updates for better UX

## Tech Stack

- **React 18** with TypeScript
- **Chakra UI V3** for components and styling
- **@tanstack/react-query** for data fetching and caching
- **Supabase** for database and real-time features
- **Recharts** for data visualization
- **Storybook** for component development
- **Vite** for build tooling

## Data Quality Rubric

Each user's data quality score is automatically calculated:

| Criterion | Points |
|-----------|--------|
| Complete data (name + zip code present) | 40 |
| Valid zip code format (5 digits) | 30 |
| Successful geo-lookup (lat/lng/timezone) | 30 |
| **Total** | **100** |

## Color Coding

Rows are color-coded based on the combined average of manual score and data quality score:

- 🔴 **Red (0-30)**: Critical - needs immediate attention
- 🟡 **Yellow (31-70)**: Warning - needs improvement
- 🟢 **Green (71-100)**: Good - meets quality standards

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (optional - app works with mock data)
- OpenWeatherMap API key (optional - app works with mock data)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd user-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_OPENWEATHERMAP_API_KEY=your_api_key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Running Without External Services

The app includes mock data and will work without Supabase or OpenWeatherMap configuration. You'll see status indicators in the header showing which services are connected.

## Supabase Setup

### Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  time_zone TEXT,
  manual_score INTEGER DEFAULT 0 CHECK (manual_score >= 0 AND manual_score <= 100),
  data_quality_score INTEGER DEFAULT 0 CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Enable Row Level Security (optional)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust based on your needs)
CREATE POLICY "Allow public access" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook |
| `npm run lint` | Run ESLint |

## Project Structure

```
user-dashboard/
├── .storybook/           # Storybook configuration
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── AddUserModal/
│   │   ├── ConfirmationModal/
│   │   ├── DataQualityBadge/
│   │   ├── EditUserModal/
│   │   ├── Layout/
│   │   ├── RubricDashboard/
│   │   ├── ScoreDistributionChart/
│   │   ├── ScoreInput/
│   │   ├── UserForm/
│   │   └── UserTable/
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── styles/           # Global styles and theme
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── .env.example          # Environment variables template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Components

### Core Components

- **UserTable**: Main data table with pagination and inline editing
- **UserForm**: Reusable form for add/edit operations
- **DataQualityBadge**: Color-coded score display
- **ScoreInput**: Inline editable score field
- **RubricDashboard**: Statistics and charts overview
- **ScoreDistributionChart**: Bar chart for score distribution

### Modals

- **AddUserModal**: Modal for creating new users
- **EditUserModal**: Modal for updating existing users
- **ConfirmationModal**: Reusable confirmation dialog

## API Integration

### OpenWeatherMap

The app uses the OpenWeatherMap API to fetch geo-location data:

```
GET https://api.openweathermap.org/data/2.5/weather?zip={ZIP},US&appid={API_KEY}
```

Response fields used:
- `coord.lat`: Latitude
- `coord.lon`: Longitude
- `timezone`: UTC offset in seconds (converted to readable format)

### Supabase

CRUD operations are performed via the Supabase client:
- `fetchUsers()`: Get paginated users
- `fetchAllUsers()`: Get all users for statistics
- `createUser()`: Create a new user
- `updateUser()`: Update user details
- `updateManualScore()`: Update only the manual score
- `deleteUser()`: Delete a user

## Storybook

View and develop components in isolation:

```bash
npm run storybook
```

Available stories:
- DataQualityBadge (all score ranges, sizes)
- ScoreInput (interactive editing)
- ConfirmationModal (delete, warning, info variants)
- ScoreDistributionChart (various data distributions)

## Error Handling

The app handles various error scenarios:
- Network failures with retry logic
- Invalid zip codes with validation messages
- API rate limiting with user feedback
- Missing geo-data with graceful degradation

## Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management in modals
- Color-coded elements include icons for non-color indicators

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and feature requests, please open an issue on GitHub.
