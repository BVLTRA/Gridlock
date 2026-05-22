# GRIDLOCK // Notebook

Gridlock is a full-stack, secure notebook application built to explore alternative authentication mechanics. Rather than relying on traditional alphanumeric passwords, Gridlock introduces a spatial, visually-driven login system.

## The Purpose
Human memory is highly spatial and visual, yet standard security systems force users to memorize arbitrary strings of text. Gridlock was built to test if a web application could maintain industry-standard security (cryptographic hashing, JWT sessions, relational databases) while completely replacing the traditional password input field with an interactive, pattern-based puzzle. 

Beneath the surface, it functions as a fluid, auto-saving workspace for users to manage discrete notes with zero-latency tab switching and real-time database synchronization.

## The Creative Authentication: "Spatial Crafting"
Gridlock bypasses the keyboard entirely for the password phase. 

Authentication is handled via a **3x3 spatial grid**, inspired by classic minecraft crafting mechanics. 
1. **The Interaction:** Users are presented with a toolbox of visual items (e.g., diamonds, redstone, sticks). To register or log in, they drag and drop these items into specific slots on the grid to form a unique visual pattern.
2. **The Mechanism:** When the user submits the form, the front end maps the 9 slots into a serialized string. 
3. **The Security:** This string is never stored as plain text. The Express backend intercepts the string and passes it through a Mongoose pre-save hook, utilizing `bcryptjs` to salt and hash the sequence. During login, `bcrypt.compare` verifies the "geometry" of the grid against the stored hash. If successful, the server generates a cryptographically signed JSON Web Token (JWT) to secure the user's session.

## Tech Stack
* **Frontend:** React, React Router (Shared Layout Architecture), CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Atlas), Mongoose (Relational 1-to-Many Schema)
* **Security:** bcryptjs, jsonwebtoken (JWT)

---

## How to Run Locally

To run Gridlock on your local machine, you will need to start both the Node server and the React frontend in separate terminal windows.

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or a local MongoDB instance)

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
```
cd server
```

2. Install the required dependencies:
```
npm install   
```
      
3. Create a .env file in the root of the server directory and add your cryptographic keys and database routing:
```
Code snippet:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=generate_a_random_secret_string_here
```
   

4. Start the backend server:
```
npm run dev 
#or 'node index.js' if nodemon is not installed
```

Note: If you are working on a public Wi-Fi network (like a campus or coffee shop), ensure your MongoDB network access is set to 0.0.0.0/0 (Allow Access from Anywhere) and be aware that some public routers block the MongoDB communication port (27017). Use a mobile hotspot or VPN if the connection hangs.

### 2. Frontend Setup
1. Open a new, separate terminal window and navigate to the frontend directory:
```
# Adjust this path based on your folder structure (e.g., cd gridlock)
npm install
```

2. Start the React development server:
```
npm start
```

3. The application will automatically open in your default browser at http://localhost:3000.

Built as an exploration of interactive development and digital mechanics.

## Demo Video
https://drive.google.com/drive/folders/13gsu4sXJ3UXWrUH-LM15hsbf9oEEOKk8?usp=sharing