import { useEffect, useState } from 'react';
import { BiCategory } from 'react-icons/bi';

const InputSelect = ({
  label,
  categories,
  handleCategoryId,
  subcategory,
  reset,
  required,
  disable = false,
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    subcategory || '',
  ); // Initial value is set to subcategory or empty

  // This effect ensures the selectedCategoryId is updated whenever subcategory changes
  useEffect(() => {
    if (subcategory) {
      setSelectedCategoryId(subcategory.toString()); // Convert subcategory to string if needed
      setIsOptionSelected(true); // Indicate an option is selected
    }
  }, [subcategory]); // Only runs when subcategory changes

  // Reset select when reset prop is true
  useEffect(() => {
    if (reset) {
      setSelectedCategoryId(''); // Clear the selection
      setIsOptionSelected(false); // Reset text color
    }
  }, [reset]);

  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setSelectedCategoryId(newCategoryId);
    handleCategoryId(newCategoryId); // Pass the new category ID to parent component
  };

  return (
    <div>
      <label className="mb-3 block text-black dark:text-white">
        {label}{' '}
        {required ? <span className="text-red-500 pl-1 text-2xl">*</span> : ''}
      </label>

      <div className="relative z-20 bg-white dark:bg-form-input">
        <span className="absolute top-1/2 left-4 z-30 -translate-y-1/2">
          <BiCategory />
        </span>

        <select
          value={selectedCategoryId} // Controlled input value
          name="category_id"
          onChange={handleCategoryChange}
          disabled={disable}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input cursor-pointer ${
            isOptionSelected ? 'text-black dark:text-white' : ''
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            Select
          </option>

          {categories &&
            categories.map((category, key) => (
              <option
                key={key}
                value={category.id}
                className="text-body cursor-pointer dark:text-bodydark"
              >
                {category.name}
              </option>
            ))}
        </select>

        <span className="absolute top-1/2 right-4 z-10 -translate-y-1/2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              />
            </g>
          </svg>
        </span>
      </div>
    </div>
  );
};

export default InputSelect;
