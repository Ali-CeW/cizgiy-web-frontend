import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image as FabricImage, IText } from 'fabric'; // Use named imports
import './CreateProd.css';
import tshirtImage from '../../assets/siyahtisor.png';

const CreateProd = () => {
  // Canvas references
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const previewFabricRef = useRef(null);
  
  // States
  const [tshirtColor, setTshirtColor] = useState('#000000'); // Default to black
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [textColor, setTextColor] = useState('#ffffff'); // Default to white for black t-shirt
  const [fontSize, setFontSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  
  // Available colors for t-shirt
  const colors = [
    { name: 'White', code: '#ffffff' },
    { name: 'Black', code: '#000000' },
    { name: 'Red', code: '#ff0000' },
    { name: 'Blue', code: '#0000ff' },
    { name: 'Green', code: '#00ff00' },
    { name: 'Yellow', code: '#ffff00' },
  ];
  
  // Available fonts
  const fonts = ['Arial', 'Roboto', 'Poppins', 'Times New Roman', 'Courier New'];
  
  // Initialize main Fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvasRef.current = new Canvas(canvasRef.current, {
      width: 280,
      height: 350,
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      selection: true,
      preserveObjectStacking: true,
    });

    // Initialize preview canvas
    previewFabricRef.current = new Canvas(previewCanvasRef.current, {
      width: 100,
      height: 120,
      backgroundColor: 'rgba(255, 255, 255, 0.0)',
      selection: false,
      renderOnAddRemove: true,
      interactivity: false,
    });

    // Add event listeners for object modifications to update preview
    fabricCanvasRef.current.on('object:modified', updatePreview);
    fabricCanvasRef.current.on('object:added', updatePreview);
    fabricCanvasRef.current.on('object:removed', updatePreview);
    
    // Enable keyboard events for delete key
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
      if (previewFabricRef.current) {
        previewFabricRef.current.dispose();
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle image upload with error handling and loading state
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check for supported image formats
    const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!supportedFormats.includes(file.type)) {
      alert('Yalnızca PNG veya JPEG formatındaki resimleri yükleyebilirsiniz.');
      return;
    }

    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (f) => {
      try {
        const data = f.target.result;
        FabricImage.fromURL(data, (img) => {
          // Resize image proportionally if too large
          const maxWidth = 200;
          const maxHeight = 200;
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          img.scale(scale);

          // Center the image on canvas
          img.set({
            left: fabricCanvasRef.current.width / 2,
            top: fabricCanvasRef.current.height / 2,
            originX: 'center',
            originY: 'center',
          });

          fabricCanvasRef.current.add(img);
          fabricCanvasRef.current.setActiveObject(img);
          fabricCanvasRef.current.renderAll();
          updatePreview(); // Ensure preview updates after adding the image
          setIsLoading(false);
        }, { crossOrigin: 'anonymous' });
      } catch (error) {
        console.error('Error loading image:', error);
        setIsLoading(false);
        alert('Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    };

    reader.onerror = () => {
      setIsLoading(false);
      alert('Resim okunamadı. Lütfen başka bir resim deneyin.');
    };

    reader.readAsDataURL(file);
  };

  // Update preview canvas with main canvas content
  const updatePreview = () => {
    if (!fabricCanvasRef.current || !previewFabricRef.current) return;

    // Clear preview canvas
    previewFabricRef.current.clear();

    // Convert main canvas to data URL and use it in preview
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
    });

    FabricImage.fromURL(dataURL, (img) => {
      img.set({
        left: previewFabricRef.current.width / 2,
        top: previewFabricRef.current.height / 2,
        originX: 'center',
        originY: 'center',
        scaleX: previewFabricRef.current.width / fabricCanvasRef.current.width,
        scaleY: previewFabricRef.current.height / fabricCanvasRef.current.height,
        selectable: false,
        evented: false,
      });

      previewFabricRef.current.add(img);
      previewFabricRef.current.renderAll();
    });
  };

  // Handle keydown events (for delete key)
  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteSelectedObject();
    }
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };
  
  // Virtual tshirt color change - creates a colored version of the t-shirt
  const changeShirtColor = (color) => {
    setTshirtColor(color);
    document.documentElement.style.setProperty('--tshirt-color', color);
  };
  
  // Add text to canvas with improved positioning
  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new IText('Metni Düzenle', {
      fontFamily: selectedFont,
      fill: textColor,
      fontSize: fontSize,
      left: fabricCanvasRef.current.width / 2,
      top: fabricCanvasRef.current.height / 2,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };
  
  // Update text properties with safety checks
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set({
        fontFamily: selectedFont,
        fill: textColor,
        fontSize: fontSize
      });
      fabricCanvasRef.current.renderAll();
      updatePreview();
    }
  }, [selectedFont, textColor, fontSize]);
  
  // Save design - actually captures the design
  const saveDesign = () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Create a temporary canvas to render the complete design
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 500;
      tempCanvas.height = 600;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Draw t-shirt background
      const tshirtImg = new Image();
      tshirtImg.onload = () => {
        tempCtx.drawImage(tshirtImg, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Apply t-shirt color if not black
        if (tshirtColor !== '#000000') {
          tempCtx.globalCompositeOperation = 'source-in';
          tempCtx.fillStyle = tshirtColor;
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.globalCompositeOperation = 'source-over';
        }
        
        // Draw the design from fabric canvas
        const designDataUrl = fabricCanvasRef.current.toDataURL({
          format: 'png',
          quality: 1
        });
        
        const designImg = new Image();
        designImg.onload = () => {
          // Position design on shirt
          const designWidth = tempCanvas.width * 0.65;
          const designHeight = tempCanvas.height * 0.45;
          const designX = (tempCanvas.width - designWidth) / 2;
          const designY = tempCanvas.height * 0.25;
          
          tempCtx.drawImage(designImg, designX, designY, designWidth, designHeight);
          
          // Convert to data URL and prompt download
          const dataUrl = tempCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = 'cizgiy-tshirt-design.png';
          link.href = dataUrl;
          link.click();
          
          setIsLoading(false);
        };
        
        designImg.src = designDataUrl;
      };
      
      tshirtImg.onerror = () => {
        setIsLoading(false);
        alert('T-shirt görüntüsü yüklenirken hata oluştu.');
      };
      
      tshirtImg.src = tshirtImage;
    } catch (error) {
      console.error('Design saving error:', error);
      setIsLoading(false);
      alert('Tasarım kaydedilirken bir hata oluştu.');
    }
  };

  // Place order function with basic validation
  const placeOrder = () => {
    if (isLoading) return;
    
    // Check if canvas has any objects
    if (fabricCanvasRef.current && fabricCanvasRef.current.getObjects().length === 0) {
      alert('Lütfen sipariş vermeden önce bir tasarım oluşturun.');
      return;
    }
    
    // Here you would implement the actual order processing
    alert('Siparişiniz alındı! Gerçek bir uygulamada burada ödeme işlemine yönlendirilecektiniz.');
  };

  // Set the CSS variable for the t-shirt image
  useEffect(() => {
    // Set the CSS variable for the t-shirt image
    document.documentElement.style.setProperty(
      '--tshirt-image-url', 
      `url(${tshirtImage})`
    );
    
    // Fallback if the image fails to load
    const img = new Image();
    img.onerror = () => {
      console.warn('T-shirt image failed to load, using fallback color');
      document.documentElement.style.setProperty('--tshirt-image-url', 'none');
    };
    img.src = tshirtImage;
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tişörtünü Tasarla</h1>
      
      {/* Main content area */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tools panel */}
        <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Araçlar</h2>
          
          {/* Color selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Tişört Rengi</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.code}
                  className={`w-8 h-8 rounded-full border border-gray-300 transition hover:scale-110 ${
                    tshirtColor === color.code ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() => changeShirtColor(color.code)}
                  title={color.name}
                ></button>
              ))}
            </div>
          </div>
          
          {/* Image upload */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Resim Yükle</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          
          {/* Text controls */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Yazı Ekle</h3>
            <button
              onClick={addText}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Yazı Ekle
            </button>
            
            <div className="space-y-3">
              {/* Font selection */}
              <div>
                <label className="block text-sm font-medium mb-1">Yazı Tipi</label>
                <select 
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3"
                >
                  {fonts.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
              
              {/* Color selection for text */}
              <div>
                <label className="block text-sm font-medium mb-1">Yazı Rengi</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Font size */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Yazı Boyutu: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Delete button */}
          <div className="mb-6">
            <button
              onClick={deleteSelectedObject}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
            >
              Seçili Nesneyi Sil
            </button>
          </div>
        </div>
        
        {/* Canvas area - using real t-shirt image */}
        <div className="w-full md:w-2/4 flex flex-col items-center">
          <div className="tshirt-container relative">
            <div className={`tshirt-image ${tshirtColor !== '#000000' ? 'colored' : ''}`} style={{'--color': tshirtColor}}>
              <div className="tshirt-canvas-container">
                <canvas ref={canvasRef} className="tshirt-canvas" />
              </div>
            </div>
          </div>
          
          <button
            onClick={saveDesign}
            disabled={isLoading}
            className="mt-6 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Kaydediliyor...' : 'Taslağı Kaydet'}
          </button>
        </div>
        
        {/* Preview area - always show the preview section */}
        <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Önizleme</h2>
          <div className="flex justify-center items-center h-full">
            <div className="relative w-full h-full">
              <canvas ref={previewCanvasRef} className="border border-gray-300 rounded-md" />
              
              {/* Loading spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75 rounded-md">
                  <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order button - always visible at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <button
            onClick={placeOrder}
            disabled={isLoading}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siparişi Tamamla
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProd;
