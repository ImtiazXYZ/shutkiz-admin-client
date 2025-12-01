import { useEffect, useRef, useState } from "react";
import ImagePreviewer from "../../components/Image/ImagePreviewer";
import AdminAuth from "../../components/Admin/AdminAuth";
import 'react-toastify/dist/ReactToastify.css';
import InputSelect from "../../components/Input/InputSelect";
import MultipleImagePreviewer from "../../components/Image/MultipleImagePreviewer";
import { AiOutlinePlus } from "react-icons/ai";
import { IoIosRemove } from "react-icons/io";
import { Select, Space, Switch } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import JoditEditor from "jodit-react";
import axios from "axios";
import { toast } from "react-toastify";

function CreateProduct() {
  const {http} = AdminAuth();
  const [name,setName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [create,setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [categories,setCategories] = useState<any[]>([]);
  const [subcategories,setSubcategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [fields,setFields] = useState<any[]>([{weight:"",stock:"",regular_price:"",discount_price:"",discountEnabled: false}]);
  const [isVariable,setIsVariable] = useState(false);
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [reset,setReset] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);



  

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!categoryId) newErrors.category_id = "Category is required.";
    // if (!subcategoryId) newErrors.subcategory_id = "Subcategory is required.";
    if (!content) newErrors.description = "Description is required.";
    if (!thumbnail) newErrors.thumbnail = "Thumbnail is required.";
    if (selectedImages.length === 0) newErrors.gallery_images = "At least one gallery image is required.";
    if (fields.length === 0) newErrors.stock_price = "At least one stock price is required.";

    const stockErrors = fields.map((stock, index) => {
      const stockErrors = {};
      if (!stock.weight) stockErrors.weight = `Weight is required`;
      if (!stock.stock) stockErrors.stock = `Stock is required`;
      if (!stock.regular_price) stockErrors.regular_price = `Regular price is required`;
      if (stock.discountEnabled && !stock.discount_price) stockErrors.discount_price = `Discount price is required`;
      return stockErrors;
    });

    // Combine stock errors into the main errors object
    stockErrors.forEach((err, index) => {
        if (Object.keys(err).length > 0) {
            newErrors[`stock_${index}`] = err;
        }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  useEffect(()=>{
    fetchCategories();
    fetchRecipes();
  },[])




  //Images
  const handleFileListChange = (files: any[]) => {
    setSelectedImages(files);
  };

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
  };

  //Fetch Category & Subcategory

  const fetchCategories=()=>{
    http.get('/admin/all-categories')
    .then((res)=>{
        setCategories(res.data);
    })
    .catch((error)=>{
        console.log(error);
    })
  }
  const fetchRecipes=()=>{
    http.get('/admin/all-recipes')
    .then((res)=>{
        setRecipes(res.data);
        //console.log(res.data);
    })
    .catch((error)=>{
        console.log(error);
    })
  }

  const handleCategoryId=(id)=>{
    setCategoryId(id);
    getCatCorrSubcat(id);
    
  }
  const handleSubcategoryId=(id)=>{
    setSubcategoryId(id);
  }
  const getCatCorrSubcat=(id)=>{
    http.get(`/admin/categories/${id}`)
    .then((res)=>{
      setSubcategories(res.data.subcategories);
    })
  }

  //Handle Fileds Adding And Removing
  const handleAddField=()=>{
    setFields([...fields,{weight:"",stock:"",regular_price:"",discount_price:"",discountEnabled: false}]);
  }

  const handleRemoveField = (index) => {
    if (isVariable && fields.length <= 2) {
      return;
    }
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newFields = [...fields];
    newFields[index][name] = value;
    setFields(newFields);
  };

  // Toggle discount field enabled/disabled
  const handleToggleDiscount = (index) => {
    const newFields = [...fields];
    newFields[index].discountEnabled = !newFields[index].discountEnabled;
    setFields(newFields);
  };

  const resetFieldsAfterSuccess = () => {
    setFields(() => [
      { weight: "", stock: "", regular_price: "", discount_price: "", discountEnabled: false }
    ]);
  };
  


  //Haldle simple or variable product
  const handleVariable = (checked: boolean) => {
    setIsVariable(checked);
    if (checked) {
      setFields([
        { weight: "", stock: "", regular_price: "", discount_price: "", discountEnabled: false },
        { weight: "", stock: "", regular_price: "", discount_price: "", discountEnabled: false }
      ]);
    } else {
      setFields([{ weight: "", stock: "", regular_price: "", discount_price: "", discountEnabled: false }]);
    }
  };
  

  //Config for editor
  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    uploader: {
        insertImageAsBase64URI: true,
    },
  };

  //Submit product from
  const productSubmitHandler=(e)=>{
    e.preventDefault();
    setReset(false);
    setCreate(true);
    if (!validate()) return;
    const formData = new FormData();
    formData.append("name",name);
    formData.append("category_id",categoryId);
    formData.append("subcategory_id",subcategoryId);
    formData.append('description',content);
    formData.append('isVariable',isVariable?1:0);
    if (thumbnail && thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    }
    if (selectedRecipeIds && selectedRecipeIds.length > 0) {
      selectedRecipeIds.forEach((id) => {
        formData.append('recipe_ids[]', id); // Using 'recipe_ids[]' to indicate an array
      });
    }
    formData.append("stock_price",JSON.stringify(fields));
    selectedImages.forEach((file) => {
      if (file.originFileObj) {
        formData.append('gallery_images[]', file.originFileObj);
      }
    });

    http.post('/admin/products',formData)
    .then((res)=>{
      //console.log(res);
      setCreate(false);
      setName('');
      setReset(true);
      setCategoryId('');
      setSubcategoryId('');
      setContent('');
      setThumbnail(null);
      setClearImage(true);
      setTimeout(() => setClearImage(false), 0);
      setSelectedImages([]);
      setFields([{weight: "", stock: "", regular_price: "", discount_price: "", discountEnabled: false}]);
      setIsVariable(false);
      setSelectedRecipeIds([]);
      resetFieldsAfterSuccess();
      toast.success("Product Created", { autoClose: 2000 });
      
    })
    .catch((error)=>{
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error(error);
      }
      //console.log(error);
    })
    



    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }




    //Code for recipe multiple select


    
  }

  const handleChange = (value) => {
    setSelectedRecipeIds(value);
  };
  

  

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[900px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Product
              </h3>
            </div>
            <form onSubmit={productSubmitHandler}>
              <div className="p-6.5">

                <div className="section-1 shadow-md  p-5 rounded-lg">
                    <h2 className="pb-3 font-semibold text-black">Product Info</h2>
                    <div className="mb-4.5">
                    <label className="mb-2.5 block text-black dark:text-white">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                    </div>

                    <div className="mb-4.5 flex gap-x-5">
                        <div className="w-full">
                        <InputSelect label="Select Category" categories={categories} handleCategoryId={handleCategoryId} reset={reset}/>
                        {errors.category_id && <span className="text-sm text-red-500">{errors.category_id}</span>}
                        </div>
                        <div className="w-full">
                        <InputSelect label="Select Sub Category" categories={subcategories} handleCategoryId={handleSubcategoryId} reset={reset}/>
                        {errors.subcategory_id && <span className="text-sm text-red-500">{errors.subcategory_id}</span>}
                        </div>
                    </div>

                </div>

                <div className="section-2 p-5 rounded-lg mt-10 shadow-md">
                <h2 className="pb-3 font-semibold text-black">Product Images</h2>
                <div className="mb-4.5">
                    <ImagePreviewer onImageSelect={handleThumbmail} label="Thumbnail" clearImage={clearImage} />
                    {thumbnail && (
                        <p className="mt-2 text-sm text-gray-500">
                        Selected Image: {thumbnail.name}
                        </p>
                    )}
                    {errors.thumbnail && <span className="text-sm text-red-500">{errors.thumbnail}</span>}
                    </div>
                    <div className="mb-4.5">
                    <MultipleImagePreviewer onFileListChange={handleFileListChange} label="Gallery Images" selectedImages={selectedImages}/>
                    {errors.gallery_images && <span className="text-sm text-red-500">{errors.gallery_images}</span>}
                </div>
                </div>

                <div className="section-3 p-5 rounded-lg mt-10 shadow-md">
                <div className="flex justify-between pb-5">
                <h2 className="pb-3 font-semibold text-black">Product Stocks & Price</h2>
                {errors.stock_price && <span>{errors.stock_price}</span>}
                <div className="flex items-center gap-x-2">
                  <StyleProvider hashPriority="high">
                  <span>Variable Product</span> <Switch checked={isVariable} onChange={handleVariable} />
                  </StyleProvider>
                </div>
                </div>


                    {
                      fields.map((field,index)=>(
                        <div className="flex gap-x-5 relative pt-10" key={index}>
                        <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Weight
                        </label>
                        <input
                         name="weight"
                         value={field.weight}
                         onChange={(event) => handleInputChange(index, event)}
                            type="text" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                            {errors[`stock_${index}`]?.weight && <span className="text-sm text-red-500">{errors[`stock_${index}`].weight}</span>}
                        </div>
                        <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Stock
                        </label>
                        <input
                         name="stock"
                         value={field.stock}
                         onChange={(event) => handleInputChange(index, event)}
                            type="text" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                            {errors[`stock_${index}`]?.stock && <span className="text-sm text-red-500">{errors[`stock_${index}`].stock}</span>}
                        </div>
                        <div className="mb-4.5 w-full">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Regular Price
                        </label>
                        <input
                         name="regular_price"
                         value={field.regular_price}
                         onChange={(event) => handleInputChange(index, event)}
                            type="text" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                            {errors[`stock_${index}`]?.regular_price && <span className="text-sm text-red-500">{errors[`stock_${index}`].regular_price}</span>}
                        </div>
                        <div className="mb-4.5 w-full">
                        <div className="flex justify-between">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Discount Price
                        </label>
                        <label>
                        <Switch
                          checked={fields[index].discountEnabled}
                          onChange={() => handleToggleDiscount(index)}
                          
                        /> 
                      </label>
                        </div>
                        <input
                         name="discount_price"
                         value={field.discount_price}
                         disabled={!field.discountEnabled}
                         onChange={(event) => handleInputChange(index, event)}
                            type="text" className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"/>
                            {errors[`stock_${index}`]?.discount_price && <span className="text-sm text-red-500">{errors[`stock_${index}`].discount_price}</span>}
                            
                        </div>
                        
                        {
                          isVariable&&
                          <div className="absolute -top-3 right-0 flex gap-x-2">
                          <div onClick={handleAddField} className="bg-black w-[30px] h-[30px] rounded-full flex justify-center items-center text-white cursor-pointer">
                            <AiOutlinePlus/>
                          </div>
                          {
                            fields.length>1&&
                            <div onClick={() => handleRemoveField(index)} className="bg-black w-[30px] h-[30px] rounded-full flex justify-center items-center text-white cursor-pointer">
                            <IoIosRemove/>
                          </div>
                          }
                        </div>
                        }
                    </div>
                      ))
                    }



                </div>



                <div className="section-3 p-5 rounded-lg mt-10 shadow-md">
                <h2 className="pb-3 font-semibold text-black">Product Description</h2>
                <div className="mb-4.5">
                    <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => setContent(newContent)}/>
                    
                
                </div>
                {errors.descriptionn && <span className="text-sm text-red-500">{errors.description}</span>}
                </div>




                <div className="section-3 p-5 rounded-lg mt-10 shadow-md">
                <h2 className="pb-3 font-semibold text-black">Product Related Recipe</h2>
                <div className="mb-4.5">
                <StyleProvider hashPriority="high">
                <Select
                mode="multiple"
                showSearch
                style={{ width: '100%' }}
                placeholder="Select one or more recipes"
                onChange={handleChange}
                value={selectedRecipeIds}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase()) ||
                  option.value.toString().toLowerCase().includes(input.toLowerCase())
                }
              >
                {recipes.map((recipe) => (
                  <Select.Option key={recipe.id} value={recipe.id}>
                    {recipe.title}
                  </Select.Option>
                ))}
              </Select>
                </StyleProvider>
                    
                
                </div>
                
                </div>
                

               

                

                

                  

                <button type="submit" className="flex w-[200px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
                  {
                    create?"Creating...":"Create"

                  }
                </button>
                
              </div>
            </form>
          </div>
        </div>
    </main>
  )
}

export default CreateProduct
