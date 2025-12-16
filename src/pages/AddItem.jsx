// src/pages/AddItem.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useItems } from '../context/ItemsContext';
import Navbar from '../components/Navbar';

// Convert any image to WebP format with compression
async function convertToWebP(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with .webp extension
              const webpFile = new File(
                [blob], 
                file.name.replace(/\.[^/.]+$/, '.webp'),
                { type: 'image/webp' }
              );
              resolve(webpFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Image loading failed'));
      img.src = e.target.result;
    };
    
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}

export default function AddItem() {
  const navigate = useNavigate();
  const { refetch } = useItems();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [brandType, setBrandType] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Get appropriate icon based on category
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'top':
        return 'fa-shirt';
      case 'bottom':
        return 'fa-socks';
      case 'shoes':
        return 'fa-shoe-prints';
      case 'outerwear':
        return 'fa-mitten';
      default:
        return 'fa-shirt';
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Convert to WebP for better performance
        const webpFile = await convertToWebP(file);
        setImageFile(webpFile);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(webpFile);
      } catch (error) {
        console.error('Error converting image:', error);
        setErrorMsg('Failed to process image. Please try another file.');
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a name for the item.');
      return;
    }

    if (!category) {
      setErrorMsg('Please select a category.');
      return;
    }

    if (!brandType) {
      setErrorMsg('Please select a type.');
      return;
    }

    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setErrorMsg('You must be logged in to add items.');
      setLoading(false);
      return;
    }

    let imageUrl = null;

    // Upload image if provided
    if (imageFile) {
      // File is already WebP from handleImageSelect
      const fileName = `${user.id}/${Date.now()}.webp`;
      
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, imageFile, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        setErrorMsg('Failed to upload image. Please try again.');
        setLoading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName);
      
      imageUrl = publicUrl;
    }

    const { error } = await supabase.from('items').insert([
      {
        name: name.trim(),
        category,
        brand_type: brandType,
        user_id: user.id,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error('Error adding item:', error);
      setErrorMsg('Something went wrong while saving. Please try again.');
      setLoading(false);
      return;
    }

    setSuccessMsg('Item added to your wardrobe!');
    
    // Refetch items to update the context
    await refetch();
    
    setLoading(false);

    // small delay then go to wardrobe
    setTimeout(() => {
      navigate('/wardrobe');
    }, 500);
  }

  return (
    <>
      <Navbar />
      <div className="add-item-page">
        <div className="add-item-container">
          <div className="modal-header">
            <h2>Add Item</h2>
            <p>Add a new piece to your wardrobe</p>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Image Upload Section */}
              <div className="image-upload">
                {imagePreview ? (
                  <div className="image-preview-box">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="remove-image-btn"
                      aria-label="Remove image"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    {category && (
                      <div className="item-no-image" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#6b7280' }}>
                        <i className={`fas ${getCategoryIcon(category)}`}></i>
                      </div>
                    )}
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      + Upload Photos
                    </button>
                  </div>
                )}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Form Fields */}
              <div className="form-field">
                <label htmlFor="name">Item name*</label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Black hoodie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="shoes">Shoes</option>
                  <option value="outerwear">Outerwear</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="brandType">Type*</label>
                <select
                  id="brandType"
                  value={brandType}
                  onChange={(e) => setBrandType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="fast_fashion">Fast fashion</option>
                  <option value="second_hand">Second-hand</option>
                  <option value="sustainable">Sustainable brand</option>
                </select>
                <p className="hint">
                  Second-hand and sustainable brands often have lower impact
                </p>
              </div>

              {errorMsg && <p className="error" role="alert">{errorMsg}</p>}
              {successMsg && <p className="success" role="status">{successMsg}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Saving…' : 'Add to Wardrobe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}