# About The Project

# 📝 HOLLA Web Admin

<!-- GETTING STARTED -->

### 🚀 Getting Started

Follow these simple example steps below to get the project running locally.

## 🎯 Prerequisites

### 📌 System Requirements
Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18 or later recommended)
- [Yarn](https://yarnpkg.com/) (Preferred) or [npm](https://www.npmjs.com/)
- A modern web browser (Chrome, Firefox, Edge, etc.)

## 📥 Installation & Running the Project

#### 1️⃣ Clone the project from GitHub
```sh
git clone https://github.com/minhvh5504/HOLLA-web-admin.git
cd HOLLA-web-admin
```

### 2️⃣ Install dependencies
```sh
yarn install
```

### 3️⃣ Environment Setup
This project uses environment variables for API connections, Maps, and Authentication.
Create a `.env` file in the root directory and add your configuration keys.

```sh
cp .env.local.example .env
```

Update the `.env` file with your credentials:
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:8080

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Map API Keys
# Mapbox: https://account.mapbox.com/
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
# Goong Maps: https://account.goong.io/
NEXT_PUBLIC_GOONG_API_KEY=your_goong_api_key
NEXT_PUBLIC_GOONG_MAPTILES_KEY=your_goong_maptiles_key
```

### 🖥️ Running Locally

### 1️⃣ Start the development server:
```sh
yarn dev
```

### 2️⃣ Open in browser:
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### 3️⃣ Build for production:
```sh
yarn build
```

### 4️⃣ Start production server:
```sh
yarn start
```

## ✨ Key Features
*   **Dashboard & Analytics:** Visualized statistics for bookings and revenue.
*   **Hotel Management:** CRUD operations for hotels, image uploads, and location management.
*   **Booking System:** Manage booking statuses, view details, and handle reservations.
*   **Amenity Management:** Configure and manage hotel amenities.
*   **User & Authentication:** Secure login using NextAuth with role-based access.
*   **Real-time Updates:** Socket.IO integration for live status changes.
*   **Interactive Maps:** Integration with Mapbox and Goong Maps for location services.
*   **Localization (i18n):** Multi-language support (English, Vietnamese).

## Demo Project
🎨 UI Screenshots

<!-- Add your screenshots here -->
<p align="center">
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-53-09.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-53-18.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-53-47.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-55-16.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-55-37.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-55-48.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-55-58.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-56-24.png" width="800" />
<br/>
<img src="public/assets/screenshots/Screenshot%20from%202026-02-03%2016-56-31.png" width="800" />
</p>

## 🧱 Technologies Used & Plugins

*   **Next.js:** The React Framework for the Web (App Router).
*   **React:** Frontend library for building user interfaces.
*   **Tailwind CSS:** Utility-first CSS framework.
*   **Shadcn UI / Radix UI:** Accessible and customizable component primitives.
*   **React Query (TanStack):** Server state management and caching.
*   **NextAuth.js:** Authentication solution.
*   **Socket.IO Client:** Real-time bidirectional event-based communication.
*   **Recharts:** Composable charting library for React.
*   **Embla Carousel:** Lightweight carousel library.
*   **React Hook Form & Zod:** Type-safe form validation.
*   **Mapbox GL & Goong JS:** Map rendering and location services.
*   **Lucide React:** Icon library.
*   **i18next:** Internationalization framework.

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Write clear and concise commit messages.
5.  Check your code with linting tools (`yarn lint`).
6.  Submit a pull request with a detailed description of your changes.

## 📄 License

- This project is licensed under the [MIT License](LICENSE).

## ✉️ Contact

If you have any questions or suggestions, feel free to reach out:

- **Vi Hong Minh** - [vihongminh5504@gmail.com](mailto:vihongminh5504@gmail.com)

- Project Repository: [https://github.com/minhvh5504/HOLLA-web-admin.git](https://github.com/minhvh5504/HOLLA-web-admin.git)
