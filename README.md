# 📚 VNR202 - Book Rental Management System

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-JavaScript-yellow?style=for-the-badge&logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/Framework-Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Library-jQuery-0769AD?style=for-the-badge&logo=jquery" alt="jQuery">
  <img src="https://img.shields.io/badge/Charts-Chart.js-FF6384?style=for-the-badge&logo=chartdotjs" alt="Chart.js">
  <img src="https://img.shields.io/badge/3D-Three.js-000000?style=for-the-badge&logo=threedotjs" alt="Three.js">
    <img src="https://github.com/NTT-DevFPT/VNR_202/actions/workflows/ci.yml/badge.svg" alt="CI">
</div>

<div align="center">
  <h3>🌐 <a href="https://vnr-202-sand.vercel.app">Live Demo</a></h3>
</div>

---

## 📖 About The Project

**VNR202** is a comprehensive Book Rental Management System designed for libraries and book rental services. The application provides an intuitive interface for managing book catalogs, tracking user rentals, calculating fees, and generating detailed reports with interactive visualizations.

This project demonstrates modern frontend development practices with a focus on user experience, responsive design, and data visualization.

---

## ✨ Key Features

### 📊 **Catalog Management**
- Browse and search book catalog with advanced filtering
- View detailed book information including availability status
- Real-time stock tracking and inventory management
- Book categorization and tagging system

### 👥 **User Management**
- User registration and authentication
- Rental history tracking for each user
- Fee calculation based on rental duration
- Overdue book notifications and penalty management

### 📈 **Reporting & Analytics**
- Interactive charts and graphs using Chart.js
- Rental statistics and trends analysis
- Revenue reports and financial summaries
- Most popular books and user activity insights

### 🎨 **Enhanced UI/UX**
- Responsive design that works on all devices
- Modern Bootstrap 5 components and styling
- Smooth animations and transitions
- 3D visual elements powered by Three.js
- Intuitive navigation and user-friendly interface

---

## 🛠️ Tech Stack

### **Frontend Development**
- **Bootstrap 5**: Modern CSS framework for responsive design and pre-built components
- **jQuery**: Simplified DOM manipulation and AJAX requests
- **Chart.js**: Beautiful, responsive charts for data visualization
- **Three.js**: 3D graphics library for interactive visual elements
- **HTML5/CSS3**: Modern web standards with custom styling

### **Additional Tools**
- **Vite**: Fast build tool and development server
- **PostCSS**: CSS processing and optimization
- **Vercel**: Deployment and hosting platform

---

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js (v18 or higher)
node --version

# npm or yarn
npm --version
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/NTT-DevFPT/VNR_202.git
cd VNR_202
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production files will be in the `dist/` directory.

---

## 📁 Project Structure

```
VNR_202/
├── public/              # Static assets
│   └── images/         # Image files
├── src/                # Source files
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── styles/        # CSS/SCSS files
│   ├── utils/         # Utility functions
│   └── main.js        # Application entry point
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation
```

---

## 🎯 Core Functionality

### Book Rental Workflow

1. **Browse Catalog**: Users can search and filter available books
2. **Select Books**: Add desired books to rental cart
3. **Checkout**: Complete rental process with user information
4. **Track Rentals**: Monitor rental duration and due dates
5. **Return Process**: Handle book returns and calculate fees
6. **Payment**: Process payments including late fees if applicable

### Admin Dashboard Features

- Add/Edit/Delete books from catalog
- Manage user accounts and permissions
- View comprehensive rental reports
- Monitor system analytics and metrics
- Generate financial reports

---

## 📊 Data Visualization

The application includes various charts and graphs:

- **Line Charts**: Rental trends over time
- **Bar Charts**: Popular books comparison
- **Pie Charts**: Category distribution
- **Doughnut Charts**: Revenue breakdown

All charts are interactive and responsive, built with Chart.js.

---

## 🌟 Screenshots

*Screenshots coming soon*

---

## 🔮 Future Enhancements

- [ ] User authentication with JWT
- [ ] Backend API integration
- [ ] Real-time notifications using WebSockets
- [ ] Mobile app version
- [ ] QR code for book scanning
- [ ] Email notifications for due dates
- [ ] Advanced search with filters
- [ ] Multi-language support
- [ ] Dark mode theme

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of an academic assignment for FPT University.

---

## 👤 Author

**Nguyễn Thành Tài**
- GitHub: [@NTT-DevFPT](https://github.com/NTT-DevFPT)
- LinkedIn: [Connect with me](https://linkedin.com)
- Email: thanhtai10903@gmail.com
- Portfolio: [ntt-dev-fpt.vercel.app](https://ntt-dev-fpt.vercel.app)

---

## 🙏 Acknowledgments

- Bootstrap team for the amazing CSS framework
- Chart.js community for excellent documentation
- Three.js creators for 3D graphics capabilities
- FPT University for project guidance

---

<div align="center">
  <p>Made with ❤️ by NTT-DevFPT</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
