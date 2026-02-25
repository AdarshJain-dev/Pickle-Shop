# Jain Sahab Special - E-commerce Website
## Deployment Information

### 🎉 Application Successfully Deployed!

**Live URL:** http://54.160.231.34/

---

## 📋 Features Implemented

### 🛍️ Customer Features
- ✅ Modern, responsive homepage with Indian aesthetics
- ✅ Product catalog with filtering and search
- ✅ Product variants (1 kg and 500 g options)
- ✅ Shopping cart with quantity management
- ✅ Wishlist functionality
- ✅ User registration and login
- ✅ Order placement and tracking
- ✅ Multiple payment options (UPI, Card, COD)
- ✅ Order history and status tracking

### 🔐 Admin Features
- ✅ Secure admin dashboard
- ✅ Statistics overview (orders, revenue, customers)
- ✅ Product management (add/edit/delete)
- ✅ Order management and status updates
- ✅ Inventory management

### 🥘 Products Available
1. **Mango Pickle (आम का अचार)**
   - 1 kg: ₹120
   - 500 g: ₹70

2. **Lemon Pickle (निम्बू का अचार)**
   - 1 kg: ₹120
   - 500 g: ₹70

3. **Lemon Chili Pickle (निम्बू मिर्ची का अचार)**
   - 1 kg: ₹150
   - 500 g: ₹80

4. **Amla Pickle (आंवला का अचार)**
   - 1 kg: ₹140
   - 500 g: ₹75

5. **Jain Sahab Special Achaar Masala (जैन साहब स्पेशल अचार मसाला)**
   - 200 g: ₹80
   - 500 g: ₹180
   - 1 kg: ₹320

---

## 🔑 Login Credentials

### Admin Access
- **Email:** admin@jainsahab.com
- **Password:** admin123

### Test Customer
You can create a new customer account via the registration page.

---

## 🏗️ Technical Architecture

### Technology Stack
- **Frontend:** Next.js 14 (React 18)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 15
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy:** Nginx

### Services Running
1. **jss_postgres** - PostgreSQL database (Port 5432)
2. **jss_backend** - Node.js API server (Port 5000)
3. **jss_frontend** - Next.js application (Port 3000)
4. **jss_nginx** - Nginx reverse proxy (Port 80)

---

## 📁 Project Structure

```
jain-sahab-special/
├── backend/
│   ├── src/
│   │   ├── db.js              # Database configuration
│   │   ├── server.js          # Express server
│   │   ├── seedData.js        # Initial data seeding
│   │   ├── middleware/
│   │   │   └── auth.js        # JWT authentication
│   │   └── routes/
│   │       ├── auth.js        # Authentication endpoints
│   │       ├── products.js    # Product management
│   │       ├── orders.js      # Order management
│   │       └── wishlist.js    # Wishlist endpoints
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.js           # Homepage
│   │   ├── products/         # Product listing
│   │   ├── cart/             # Shopping cart
│   │   ├── orders/           # Order history
│   │   ├── admin/            # Admin panel
│   │   ├── login/            # Login page
│   │   └── register/         # Registration page
│   ├── components/
│   │   ├── Header.js         # Navigation header
│   │   ├── Footer.js         # Footer component
│   │   └── ProductCard.js    # Product display card
│   ├── lib/
│   │   ├── api.js            # API client
│   │   └── store.js          # State management
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── nginx.conf            # Reverse proxy config
│
└── docker-compose.yml        # Container orchestration

```

---

## 🚀 Deployment Commands

### Start the Application
```bash
cd /home/ubuntu/agent/jain-sahab-special
sudo docker compose up -d
```

### Stop the Application
```bash
cd /home/ubuntu/agent/jain-sahab-special
sudo docker compose down
```

### View Logs
```bash
# All services
sudo docker compose logs -f

# Specific service
sudo docker compose logs -f backend
sudo docker compose logs -f frontend
```

### Restart Services
```bash
sudo docker compose restart
```

### Rebuild and Deploy
```bash
sudo docker compose down
sudo docker compose up -d --build
```

---

## 🗄️ Database Management

### Connect to PostgreSQL
```bash
sudo docker exec -it jss_postgres psql -U jssuser -d jainssahab
```

### Common SQL Queries
```sql
-- View all products
SELECT * FROM products;

-- View all orders
SELECT * FROM orders;

-- View order items
SELECT * FROM order_items;

-- Check user accounts
SELECT id, email, name, is_admin FROM users;
```

---

## 🔧 Troubleshooting

### Check Container Status
```bash
sudo docker ps
```

### Check Logs for Errors
```bash
sudo docker logs jss_backend
sudo docker logs jss_frontend
sudo docker logs jss_postgres
```

### Restart Specific Service
```bash
sudo docker restart jss_backend
```

### Check API Health
```bash
curl http://localhost/api/health
```

### Check Products
```bash
curl http://localhost/api/products
```

---

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Authenticated Endpoints
- `GET /api/auth/me` - Get current user
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Admin Endpoints
- `GET /api/orders` - Get all orders
- `PUT /api/orders/:id/status` - Update order status
- `GET /api/orders/stats/summary` - Get statistics
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

---

## 📱 Responsive Design

The website is fully responsive and works on:
- ✅ Desktop (1920px and above)
- ✅ Laptop (1024px - 1919px)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (320px - 767px)

---

## 🎨 Design Features

- Clean and modern UI with warm Indian color palette
- Traditional aesthetics combined with modern e-commerce UX
- Bilingual support (English and Hindi)
- Product variant selection
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states for better UX

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- SQL injection prevention with parameterized queries
- Input validation
- CORS configuration

---

## 📦 Docker Volumes

- `postgres_data` - Persistent database storage

---

## 🌟 Future Enhancements

Potential improvements that can be added:
- Payment gateway integration (Razorpay/Stripe)
- Email notifications for orders
- SMS notifications
- Product reviews and ratings
- Discount coupons
- Bulk order discounts
- Product image uploads
- Advanced search and filters
- Sales analytics
- Export orders to CSV
- Multi-language support

---

## 📞 Support

For any issues or questions, please check the logs or restart the services.

---

## ✅ Deployment Checklist

- [x] PostgreSQL database running
- [x] Backend API server running
- [x] Frontend Next.js app running
- [x] Nginx reverse proxy configured
- [x] Database tables created
- [x] Initial products seeded
- [x] Admin account created
- [x] Application accessible via public IP
- [x] All API endpoints working
- [x] Authentication working
- [x] Cart functionality working
- [x] Order placement working

---

**Deployment Date:** February 25, 2026
**Deployed By:** Claude Code
**Status:** ✅ LIVE AND OPERATIONAL
