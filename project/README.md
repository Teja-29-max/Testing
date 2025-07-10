# Software Testing Internship Form

A beautiful, modern, and responsive web application for a Software Testing Internship assignment. This project demonstrates frontend development skills with elegant UI/UX design, form validation, and smooth animations.

## 🚀 What Was Built

### Frontend Web Application
- **Responsive Form Interface**: A centered form with professional styling inside an elegant card design
- **Form Validation**: Client-side validation ensuring required fields are filled and email format is correct
- **Smooth Animations**: 
  - Fade-in animation when the page loads
  - Hover effects on interactive elements
  - Slide-in alerts for success/error messages
- **Modern Design**: Clean, professional look with soft colors, rounded corners, and drop shadows

### Python Script
- **Command-Line Interface**: Processes name and email input from command line arguments
- **Input Validation**: Ensures both fields are provided and email contains "@"
- **Formatted Output**: Displays received data in a clean, readable format

## 🛠️ Tools Used

### Frontend
- **React 18** - Modern JavaScript framework for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server

### Backend/Script
- **Python 3** - Command-line script for data processing
- **argparse** - Command-line argument parsing library

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## 🎨 Design Features

- **Color Scheme**: Soft gradient backgrounds with blue and purple accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Proper form labels and focus states

## 🏃‍♂️ How to Run

### Frontend Web Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:5173`
   - The form will automatically fade in with smooth animations

4. **Test the Form**
   - Fill in your name and email
   - Submit to see success message
   - Try submitting with empty fields or invalid email to see error messages

### Python Script

1. **Make Script Executable** (optional)
   ```bash
   chmod +x form_script.py
   ```

2. **Run with Arguments**
   ```bash
   python form_script.py --name "John Doe" --email "john@example.com"
   ```

3. **Alternative Short Form**
   ```bash
   python form_script.py -n "Jane Smith" -e "jane@company.org"
   ```

4. **View Help**
   ```bash
   python form_script.py --help
   ```

### Expected Output
```
Received data:
Name: John Doe
Email: john@example.com
```

## 📋 Form Validation Rules

### Frontend (React)
- **Name**: Must not be empty
- **Email**: Must not be empty and must contain "@" symbol
- **Success**: Shows green alert with checkmark icon
- **Error**: Shows red alert with warning icon

### Python Script
- **Name**: Must not be empty or just whitespace
- **Email**: Must not be empty and must contain "@" symbol
- **Validation**: Displays error messages and exits with code 1 if validation fails

## 🌟 Features Demonstrated

- **Modern Web Development**: React, TypeScript, and modern CSS
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **User Experience**: Smooth animations and intuitive interface
- **Form Validation**: Client-side validation with user-friendly feedback
- **Code Quality**: Clean, maintainable, and well-documented code
- **Command-Line Tools**: Python script with proper argument handling

## 🚀 Production Ready

This application is built with production-worthy practices:
- Component-based architecture
- TypeScript for type safety
- Responsive design for all devices
- Proper error handling
- Clean code structure
- Comprehensive validation

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── InternshipForm.tsx    # Main form component
│   ├── App.tsx                   # Root application component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Tailwind CSS imports
├── form_script.py                # Python command-line script
├── README.md                     # This file
└── package.json                  # Dependencies and scripts
```

---

*This project demonstrates proficiency in modern frontend development, user experience design, and command-line scripting - perfect for a Software Testing Internship role.*