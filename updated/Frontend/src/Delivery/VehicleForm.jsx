import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VehicleTypeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleType: '',
    brand: '',
    model: '',
    color: '',
    licensePlateNumber: '',
    drivingLicenseNumber: '',
    insuranceNumber: '',
    documentImage: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_DELIVER_API_URL;

  // Regex patterns matching backend validation
  const patterns = {
    brand: /^[A-Za-z0-9\- ]{2,30}$/,
    model: /^[A-Za-z0-9\- ]{2,30}$/,
    color: /^[A-Za-z ]{3,20}$/,
    licensePlate: /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/,
    drivingLicense: /^[A-Z]{2}[0-9]{2}\/[0-9]{4,10}$/,
    insurance: /^[A-Za-z0-9\-]{8,20}$/
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, documentImage: e.target.files[0] });
    setErrors(prev => ({ ...prev, documentImage: undefined }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (formData.vehicleType === 'MOTORCYCLE') {
      if (!formData.brand || !patterns.brand.test(formData.brand)) {
        newErrors.brand = 'Invalid brand (2-30 chars, letters/numbers/hyphens)';
      }
      if (!formData.model || !patterns.model.test(formData.model)) {
        newErrors.model = 'Invalid model (2-30 chars, letters/numbers/hyphens)';
      }
      if (formData.color && !patterns.color.test(formData.color)) {
        newErrors.color = 'Invalid color (3-20 letters/spaces)';
      }
      if (!formData.licensePlateNumber || !patterns.licensePlate.test(formData.licensePlateNumber)) {
        newErrors.licensePlateNumber = 'Invalid format (e.g. MH12AB1234)';
      }
      if (formData.drivingLicenseNumber && !patterns.drivingLicense.test(formData.drivingLicenseNumber)) {
        newErrors.drivingLicenseNumber = 'Invalid format (e.g. MH12/2023456)';
      }
      if (formData.insuranceNumber && !patterns.insurance.test(formData.insuranceNumber)) {
        newErrors.insuranceNumber = 'Invalid insurance number (8-20 chars)';
      }
      if (!formData.documentImage) {
        newErrors.documentImage = 'Document image is required';
      } else if (!['image/jpeg', 'image/png', 'application/pdf'].includes(formData.documentImage.type)) {
        newErrors.documentImage = 'Only JPG/PNG/PDF files allowed';
      } else if (formData.documentImage.size > 5242880) {
        newErrors.documentImage = 'File size must be under 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('vehicleType', formData.vehicleType);

      if (formData.vehicleType === 'MOTORCYCLE') {
        const vehicleInfo = {
          brand: formData.brand,
          model: formData.model,
          color: formData.color,
          licensePlateNumber: formData.licensePlateNumber,
          drivingLicenseNumber: formData.drivingLicenseNumber,
          insuranceNumber: formData.insuranceNumber
        };
        formPayload.append('vehicleInfo', JSON.stringify(vehicleInfo));
        formPayload.append('documentImage', formData.documentImage);
      }

      const response = await axios.post(
        `${API_URL}/rider/select-vehicle-type`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        navigate('/rider/vehicle-info');
      }
    } catch (err) {
      setErrors({
        server: err.response?.data?.message || 'Failed to save vehicle information'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="bg-white/90 backdrop-blur-lg rounded-xl p-8 w-full max-w-md shadow-xl border border-orange-100">
        <h2 className="text-2xl font-bold mb-6 text-center">Vehicle Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Type *</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Vehicle Type</option>
              <option value="MOTORCYCLE">Motorcycle</option>
              <option value="BICYCLE">Bicycle</option>
            </select>
            {errors.vehicleType && <span className="text-red-500 text-sm">{errors.vehicleType}</span>}
          </div>

          {formData.vehicleType === 'MOTORCYCLE' && (
            <>
              {/* Brand */}
              <div>
                <input
                  type="text"
                  placeholder="Brand *"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {errors.brand && <span className="text-red-500 text-sm">{errors.brand}</span>}
              </div>

              {/* Model */}
              <div>
                <input
                  type="text"
                  placeholder="Model *"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {errors.model && <span className="text-red-500 text-sm">{errors.model}</span>}
              </div>

              {/* Color */}
              <div>
                <input
                  type="text"
                  placeholder="Color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                {errors.color && <span className="text-red-500 text-sm">{errors.color}</span>}
              </div>

              {/* License Plate */}
              <div>
                <input
                  type="text"
                  placeholder="License Plate Number *"
                  value={formData.licensePlateNumber}
                  onChange={(e) => setFormData({...formData, licensePlateNumber: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  required
                />
                {errors.licensePlateNumber && (
                  <span className="text-red-500 text-sm">{errors.licensePlateNumber}</span>
                )}
              </div>

              {/* Driving License */}
              <div>
                <input
                  type="text"
                  placeholder="Driving License Number"
                  value={formData.drivingLicenseNumber}
                  onChange={(e) => setFormData({...formData, drivingLicenseNumber: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                {errors.drivingLicenseNumber && (
                  <span className="text-red-500 text-sm">{errors.drivingLicenseNumber}</span>
                )}
              </div>

              {/* Insurance Number */}
              <div>
                <input
                  type="text"
                  placeholder="Insurance Number"
                  value={formData.insuranceNumber}
                  onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
                {errors.insuranceNumber && (
                  <span className="text-red-500 text-sm">{errors.insuranceNumber}</span>
                )}
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vehicle Document (RC Book) *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500"
                  accept="image/*, application/pdf"
                  required
                />
                {errors.documentImage && (
                  <span className="text-red-500 text-sm">{errors.documentImage}</span>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>

          {errors.server && (
            <p className="text-red-500 text-sm mt-4 text-center">{errors.server}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehicleTypeForm;
