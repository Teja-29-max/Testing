import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, User, Mail } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
}

interface Alert {
  type: 'success' | 'error';
  message: string;
  show: boolean;
}

const InternshipForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: ''
  });
  const [alert, setAlert] = useState<Alert>({
    type: 'success',
    message: '',
    show: false
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on component mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      showAlert('error', 'Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim()) {
      showAlert('error', 'Please enter your email address');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      showAlert('error', 'Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message, show: true });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      showAlert('success', 'Form submitted successfully! Thank you for your interest.');
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({ fullName: '', email: '' });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-md transform transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Alert Message */}
        <div 
          className={`mb-6 transform transition-all duration-500 ease-out ${
            alert.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          {alert.show && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${
              alert.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {alert.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Software Testing Internship
            </h1>
            <p className="text-gray-600">
              Join our team and gain hands-on experience in software quality assurance
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
            >
              Submit Application
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>We'll review your application and get back to you soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipForm;