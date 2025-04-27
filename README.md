# Study Materials Store

A full-stack web application for selling and distributing study materials with secure password-protected downloads.

## 🌟 Features

- 🔐 User authentication (signup/login)
- 👑 Admin dashboard for managing content
- 🛒 Shopping cart functionality 
- 💳 Checkout system with GST calculation
- 📄 Automatic PDF bill generation
- 🔑 Secure one-time password for downloads
- 📚 Subject-wise material organization
- 🔍 Search and filter capabilities
- 📱 Responsive design

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js 
- **File Handling**: Multer
- **PDF Generation**: PDFKit
- **Security**: Crypto for OTP generation

## 📦 Prerequisites

- Node.js (v14+ recommended)
- npm (comes with Node.js)
- Web browser with JavaScript enabled

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-materials-app
   ```

2. **Set up backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Server runs at: http://localhost:3000

3. **Launch frontend**
   Using VS Code:
   - Install "Live Server" extension
   - Right-click `frontend/index.html`
   - Select "Open with Live Server"

   Or using Python's HTTP server:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
   Access at: http://localhost:5500

## 📁 Project Structure

```
study-materials-app/
├── backend/
│   ├── server.js          # Express server & API endpoints
│   ├── admin.json         # Admin credentials
│   ├── users.json         # User data
│   ├── files-config.json  # File mapping configuration 
│   ├── subjects.json      # Subject definitions
│   ├── bills/            # Generated PDF bills
│   └── files/            # Protected study materials
├── frontend/
│   ├── index.html        # Main store page
│   ├── admin.html        # Admin dashboard
│   ├── login.html        # User login
│   ├── signup.html       # User registration
│   ├── style.css         # Main styles
│   ├── signup.css        # Auth pages styles
│   ├── app.js           # Core application logic
│   └── items.js         # Study materials data
```

## 🔑 Authentication

### User Login
- Email and password based
- Purchase history tracking
- Password change functionality

### Admin Login
- Default credentials:
  - Email: admin@study.com
  - Password: admin123
- Access to user management
- Material upload capabilities

## 💼 Admin Features

1. **User Management**
   - View all users
   - Track user purchases
   - View purchase history

2. **Content Management**
   - Add/remove study materials
   - Set prices and descriptions
   - Upload protected PDF files
   - Manage subject categories

## 🛍️ Shopping Features

1. **Cart System**
   - Add/remove items
   - Real-time price calculation
   - GST (18%) included

2. **Checkout Process**
   - Automatic bill generation
   - Unique download passwords
   - Purchase history tracking

3. **Download Security**
   - One-time passwords
   - Timed download links
   - Secure file access

## 🔐 Security Features

- Password-protected downloads
- One-time use passwords
- Secure file storage
- Token-based downloads
- Admin access control

## 🛠️ Configuration

### Admin Settings
Edit `backend/admin.json`:
```json
{
  "email": "admin@study.com",
  "password": "your-secure-password"
}
```

### File Storage
Protected files location: `backend/files`
- Supported format: PDF
- Auto-configured on upload

## 📝 Development Notes

1. **Adding New Features**
   - Backend: Add routes in `server.js`
   - Frontend: Extend `app.js` functionality
   - Styles: Modify appropriate CSS files

2. **Security Considerations**
   - Use HTTPS in production
   - Implement proper password hashing
   - Add rate limiting for downloads

## 🚀 Production Deployment

1. **Backend Preparation**
   - Set up proper database
   - Configure environment variables
   - Implement proper security measures

2. **Frontend Optimization**
   - Minify JavaScript and CSS
   - Optimize images
   - Enable caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License