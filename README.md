# Web Manga Platform

A web platform for reading manga built with React and Node.js.

## 🚀 Features

- Online manga reading
- User authentication system
- Favorite manga list management
- Manga search functionality
- Online payment integration (PayPal)
- User-friendly and responsive interface

## 🛠 Technologies Used

### Frontend
- React 18
- Redux Toolkit
- React Query
- Ant Design
- Bootstrap
- React Router DOM
- Axios
- PayPal Integration

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Nodemailer
- Bcrypt

## 🏗 Project Structure

```
web-manga/
├── Frontend_Web-Manga/    # React frontend
├── Backend_Web-Manga/     # Node.js backend
└── docker-compose.yml     # Docker configuration
```

## 🚀 Installation and Setup

### System Requirements
- Node.js
- MongoDB
- Docker (optional)

### Frontend Setup
```bash
cd Frontend_Web-Manga
npm install
npm start
```

### Backend Setup
```bash
cd Backend_Web-Manga
npm install
npm start
```

### Running with Docker
```bash
docker-compose up
```

## 🔧 Environment Configuration

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## 📝 License

ISC
