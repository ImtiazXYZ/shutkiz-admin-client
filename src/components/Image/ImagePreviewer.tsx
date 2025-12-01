import React, { useState, useEffect, ChangeEvent } from 'react';
import { Badge } from 'antd';
interface ImagePreviewerProps {
  onImageSelect?: (imageFile: File | null) => void;
  label: string;
  clearImage: boolean; // New prop to trigger clearing the image preview
  currentImage : string;
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ onImageSelect, label, clearImage,currentImage,required }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null); // Reference to the file input

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set the image preview
        if (onImageSelect) {
          onImageSelect(file); // Call the onImageSelect callback if provided
        }
      };
      reader.readAsDataURL(file); // Read the file and convert it to base64 URL
    }
  };

  // Use effect to clear the image preview when clearImage is true
  useEffect(() => {
    if (clearImage) {
      setImagePreview(null); // Clear the preview
      if (inputRef.current) {
        inputRef.current.value = ''; // Clear the file input field
      }
      if (onImageSelect) {
        onImageSelect(null); // Notify the parent that the image is removed
      }
    }
  }, [clearImage, onImageSelect]);

  const handleRemoveImage = () => {
    setImagePreview(null); // Reset the image preview
    if (inputRef.current) {
      inputRef.current.value = ''; // Reset the input field
    }
    if (onImageSelect) {
      onImageSelect(null); // Notify parent that the image was removed
    }
  };

  return (
    <div className="">
      <div className="mb-4.5">
        <label className="mb-3 block text-black dark:text-white">{label}
          {required?<span className="text-red-500 pl-1 text-2xl">*</span>:''}
        </label>
        <input
          ref={inputRef} // Reference to the file input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
        />
      </div>

      <div className='flex gap-x-10'>
      
      {imagePreview && (
        <div className="relative w-[80px]">
          <img
            src={imagePreview}
            alt="Selected Preview"
            className="w-full object-cover rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full shadow-md hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
      {
        currentImage?(
          <div className='relative w-[80px]'>
            <img src={currentImage} className='w-full' alt="" />
            <div className='absolute -top-5 right-0'>
            <Badge.Ribbon text="Current">
              
            </Badge.Ribbon>
            </div>
          </div>
        ):null
      }
      </div>
    </div>
  );
};

export default ImagePreviewer;
