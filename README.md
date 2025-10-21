# CRUD Dashboard - Modern Next.js App

A beautiful and modern CRUD (Create, Read, Update, Delete) application built with Next.js 15, MongoDB, and Tailwind CSS.

## Features

- 🔐 **Simple Authentication** - Login without database (hardcoded credentials)
- 📝 **Full CRUD Operations** - Create, Read, Update, and Delete items
- 🎨 **Modern UI** - Beautiful gradient design with Tailwind CSS
- 🗄️ **MongoDB Integration** - Persistent data storage
- ⚡ **Fast & Responsive** - Built with Next.js 15 and React 19
- 🎯 **User-Friendly Interface** - Intuitive card-based layout

## Default Credentials

- **Username:** `admin`
- **Password:** `admin123`

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB installed locally OR a MongoDB Atlas account
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd hellloo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MongoDB:**

   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   
   ```env
   MONGODB_URI=mongodb://localhost:27017/crudapp
   ```
   
   Or for MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crudapp?retryWrites=true&w=majority
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

3. **Login with the default credentials:**
   - Username: `admin`
   - Password: `admin123`

## Project Structure

```
hellloo/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.js      # Login API
│   │   │   └── logout/route.js     # Logout API
│   │   └── items/route.js          # CRUD operations API
│   ├── dashboard/
│   │   └── page.js                 # Main dashboard with CRUD interface
│   ├── login/
│   │   └── page.js                 # Login page
│   ├── globals.css                 # Global styles
│   ├── layout.js                   # Root layout
│   └── page.js                     # Home page (redirects to login)
├── lib/
│   └── mongodb.js                  # MongoDB connection utility
└── .env.local                      # Environment variables (create this)
```

## Features Breakdown

### Authentication
- Simple login system without database dependency
- Session management using localStorage
- Protected routes that redirect to login if not authenticated

### CRUD Operations

#### Create
- Add new items with fields:
  - Name
  - Category (Electronics, Furniture, Clothing, Books, Other)
  - Quantity
  - Description

#### Read
- View all items in a beautiful card-based grid layout
- Each card displays item details with color-coded categories

#### Update
- Edit existing items by clicking the "Edit" button
- Form pre-fills with current data

#### Delete
- Remove items with a confirmation dialog
- Instant UI update after deletion

### Database Schema

Items are stored in MongoDB with the following structure:

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  quantity: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Tech Stack

- **Framework:** Next.js 15
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Database:** MongoDB
- **Database Driver:** mongodb (native driver)
- **Language:** JavaScript

## API Routes

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout user

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
- `PUT /api/items` - Update existing item
- `DELETE /api/items?id={id}` - Delete item by ID

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. Use the connection string:
   ```
   mongodb://localhost:27017/crudapp
   ```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Add your IP address to the whitelist
5. Create a database user
6. Use the connection string in `.env.local`

## Customization

### Change Login Credentials

Edit `app/api/auth/login/route.js`:

```javascript
if (username === 'your_username' && password === 'your_password') {
  // Login logic
}
```

### Add More Categories

Edit `app/dashboard/page.js` and add options to the category select:

```javascript
<option value="YourCategory">Your Category</option>
```

### Modify Color Theme

Edit `app/globals.css` and `tailwind` classes in components to change the color scheme.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your connection string in `.env.local`
- Verify network access (for MongoDB Atlas)

### Port Already in Use
- Stop other processes using port 3000 or run on a different port:
  ```bash
  npm run dev -- -p 3001
  ```

### Authentication Not Working
- Clear browser localStorage
- Check browser console for errors
- Verify API routes are working

## Future Enhancements

- [ ] User registration and real authentication
- [ ] Image upload for items
- [ ] Search and filter functionality
- [ ] Pagination for large datasets
- [ ] Export data to CSV/Excel
- [ ] Dark mode toggle
- [ ] Role-based access control

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the documentation or create an issue in the repository.

---

Built with ❤️ using Next.js and MongoDB
