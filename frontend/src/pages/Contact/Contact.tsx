import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { FaArrowLeft } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [nameError, setNameError] = useState('');

  const handleChange = (e:any) => {
    const { name, value } = e.target;

    if (name === 'name') {
      const isValidName = /^[A-Za-z\s]*$/.test(value);
      
      if (!isValidName) {
        setNameError('Name can only contain letters and spaces');
        toast.error('Name can only contain letters and spaces', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      } else {
        setNameError('');
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (event:any) => {
    event.preventDefault();
    
    if (nameError) {
      toast.error('Please fix the name field before submitting', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    toast.info('Sending your message...', {
      position: "top-right",
      autoClose: false,
    });
    
    const submissionData = new FormData();
    submissionData.append("access_key", "670f9db9-534a-49b1-b0b2-7af74d3e4492");
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData
      });

      const data = await response.json();

      if (data.success) {
        toast.dismiss();
        toast.success('Form Submitted Successfully', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.dismiss();
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.dismiss();
      toast.error('An error occurred while submitting the form', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <NavLink
          to="/"
          className="absolute top-4 left-8 text-white hover:text-blue-500 transition-colors duration-200 flex items-center"
          aria-label="Back to home"
        >
          <FaArrowLeft size={28} />
        </NavLink>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Contact Us
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                nameError ? 'border-red-500' : 'border-gray-600'
              } rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Your name"
              required
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Your message here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={!!nameError}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              nameError ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            Send Message
          </button>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Contact;