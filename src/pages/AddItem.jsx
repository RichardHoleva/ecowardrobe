import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AddItem() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('top');
  const [brandType, setBrandType] = useState('fast_fashion');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleClose = () => {
    navigate(-1);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter a name for the item.');
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
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, imageFile);

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
    setLoading(false);

    // small delay then go to wardrobe
    setTimeout(() => {
      navigate('/wardrobe');
    }, 800);
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <i className="fas fa-times"></i>
        </button>

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
                <button
                  type="button"
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Upload Photos
                </button>
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
              >
                <option value="">Choose category</option>
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
              >
                <option value="">Choose type of shop</option>
                <option value="fast_fashion">Fast fashion</option>
                <option value="second_hand">Second-hand</option>
                <option value="sustainable_brand">Sustainable brand</option>
                <option value="dont_know">Don&apos;t know</option>
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
  );
}