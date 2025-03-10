# Personal Finance Tracker

A simple and intuitive finance tracking application built with modern web technologies to help users manage their personal finances efficiently.

## Features

- **Next.js** - A React framework for server-side rendering and static site generation.
- **ShadCN** - UI components for building beautiful interfaces.
- **Firebase Authentication** - Secure user authentication with Google OAuth.
- **Firestore Database** - Real-time data storage and retrieval.
- **Tailwind CSS** - A utility-first CSS framework for styling.
- **Lucide Icons** - Modern and customizable icons.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication (Google OAuth).
   - Create a `.env.local` file in the project root and add your Firebase config:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```

4. Run the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Sign in with Google** to access your dashboard.
- **Add transactions manually** with categories and amounts.
- **View recent transactions** and edit them.
- **Monitor your spending habits** with an intuitive UI.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, ShadCN
- **Authentication:** Firebase OAuth
- **Database:** Firestore
- **Icons:** Lucide

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, reach out via [your email or social links].
