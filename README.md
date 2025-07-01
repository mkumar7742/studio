
# TrackWise - A Firebase Studio Project

This is a full-stack Next.js project bootstrapped with `create-next-app`, designed and built in Firebase Studio. It includes a Node.js/Express backend that connects to a MongoDB database.

## Getting Started

To get the development environment running on your local machine, follow these steps:

### 1. Install Dependencies
Open your terminal in the project root and run:
```bash
npm install
```

### 2. Set Up Environment Variables
Create a file named `.env` in the root of the project and add your MongoDB connection string.

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
```

**For MongoDB Community Server (Local):**
```
MONGODB_URI="mongodb://127.0.0.1:27017/trackwise"
```

Replace the placeholder with your actual connection string. The server will not start without it.

### 3. Run the Development Servers
This project uses `concurrently` to run both the frontend and backend servers with a single command. In your terminal, run:

```bash
npm run dev
```
This will:
- Start the Next.js frontend server on `http://localhost:3000`.
- Start the Node.js backend server on `http://localhost:5001`.

### 4. View Your App
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The application is now running in a full-stack configuration. Any data you create will be sent to the backend and stored in your MongoDB database.
# studio
