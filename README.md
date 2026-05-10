# Gridlock: Spatial Crafting Authentication

Gridlock is a React-based proof-of-concept that attempts to reimagine the login experience. Instead of typing a string of characters, users "craft" their credentials on a 3x3 grid. This project explores the intersection of gamified UI, spatial memory, and secure data serialization.

## 🧠 The Concept

Traditional passwords rely on character sequences. Gridlock shifts the burden of recall from abstract text to, what I'd call, **spatial patterns**. By using familiar mechanics (Minecraft-style crafting), we can create complex passwords that are easier for the human brain to visualize and remember, yet computationally difficult to brute-force.

## 🛠 Tech Stack & Architecture

- **Frontend:** React.js
- **State Management:** React Context / Hooks
- **Drag & Drop:** React DnD (or Framer Motion)
- **Security:** Argon2/bcrypt for hashing serialized grid states

### The Mechanism: From Grid to Hash

The core logic treats the crafting table as a 3x3 matrix. Each slot is mapped to an index in a flat array:

$$[0, 1, 2, 3, 4, 5, 6, 7, 8]$$

When a user places an item, the system records the **Item ID** and its **Slot Index**. Before authentication, this state is serialized into a unique string and passed through a one-way hashing algorithm.

> **Technical Insight:** The randomness-complexity of a 3x3 grid with even 20 possible items (including empty slots) provides over $7.9 \times 10^{11}$ possible combinations. This significantly outperforms a standard 4-digit or 6-digit PIN.

## ✨ Key Features (TBC)

- **Pattern Serialization:** A custom logic layer that converts visual arrangements into deterministic strings for hashing.
- **Anti-Peeking Logic:** Optional "obscure" mode where items vanish or change icons after placement to prevent shoulder-surfing.
- **Responsive Inventory:** A dynamic "toolbox" of items used as the source for the crafting credentials.

## 🚀 Installation & Setup

1. Clone the repository:
   ```bash
   git clone [https://github.com/bvltra/gridlock.git](https://github.com/bvltra/gridlock.git)
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
