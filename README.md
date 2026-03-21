# Lumber Timber - Circular Economy Toy Platform

A modern e-commerce platform for Channapatna wooden toys that promotes sustainability through circular economy principles.

## Features

### 🏪 Marketplace
- Browse and purchase authentic Channapatna wooden toys
- Advanced filtering by age, price, and category
- Detailed toy information with artisan stories
- Search functionality

### 🔄 Toy Passport System
- Unique ID for each toy
- Complete ownership history
- Repair and maintenance records
- Artisan information

### 👨‍🎨 Adoption Program
- Lifetime repair service for adopted toys
- Reduced pricing for adopted items
- Support local artisans

### 📦 Subscription Service
- Monthly toy rotation plans
- Basic, Standard, and Premium tiers
- Curated toy selections

### 🔧 Repair & Maintenance
- Professional repair services
- Toy repainting and restoration
- Track repair history

### 💰 Return & Credit System
- Easy returns within 30 days
- Credit points for future purchases
- Eco-friendly return process

### 👤 User Dashboard
- Order management
- Subscription tracking
- Repair request history
- Credit balance monitoring

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Razorpay for payments
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/lumber-timber.git
cd lumber-timber
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables

Create `.env` file in backend directory:
```
MONGODB_URI=mongodb://localhost:27017/lumber-timber
JWT_SECRET=your_jwt_secret_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
PORT=5000
```

5. Start MongoDB service

6. Start the backend server
```bash
cd backend
npm run dev
```

7. Start the frontend development server
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Toys
- `GET /api/toys` - Get all toys
- `GET /api/toys/:id` - Get toy by ID
- `POST /api/toys` - Add new toy (admin)
- `PUT /api/toys/:id` - Update toy (admin)
- `DELETE /api/toys/:id` - Delete toy (admin)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

### Subscriptions
- `GET /api/subscriptions` - Get user subscriptions
- `POST /api/subscriptions` - Create subscription

### Repairs
- `GET /api/repairs` - Get user repairs
- `POST /api/repairs` - Create repair request
- `PUT /api/repairs/:id` - Update repair status (admin)

## Design Philosophy

### Color Palette
- Primary: #8B4513 (Saddle Brown)
- Secondary: #D2B48C (Tan)
- Accent: #F5DEB3 (Wheat)
- Neutral: #654321 (Dark Brown)

### UI Principles
- Glassmorphism effects
- Smooth micro-interactions
- Premium typography
- Responsive design
- Accessibility-first approach

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Channapatna artisans for their craftsmanship
- Open source community for amazing tools
- Sustainable design principles