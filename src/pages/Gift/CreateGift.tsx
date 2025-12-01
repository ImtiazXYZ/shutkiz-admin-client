import { useEffect, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSelect from "../../components/Input/InputSelect";
import ImagePreviewer from "../../components/Image/ImagePreviewer";
function CreateGift() {
  const {http} = AdminAuth();
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [create,setCreate] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [reset,setReset] = useState(false);
  const [code,setCode] = useState<string>("");
  const [description,setDescription] = useState<string>("");
  const [expiryDate,setExpiryDate] = useState<string>("");
  const [clearImage, setClearImage] = useState(false);
  const [isCustom,setIsCustom] = useState(null);
  const [products,setProducts] = useState([]);
  const [productId,setProductId] = useState(null);

  useEffect(()=>{
    fetchProducts();
  },[])

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
    
  };
  const categories = [
      {
          "id" : "Custom",
          "name" : "Custom"
      },
      {
          "id" : "Product",
          "name" : "Product"
      },
  ];

  const fetchProducts = () => {
    http.get("/admin/get-gifts-product",{
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((res)=>{
    setProducts(res.data);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  const handleCategoryId=(id)=>{
    if(id=="Custom"){
        setIsCustom(true);
    }else{
        setIsCustom(false);
    }
  }
  
  const handleProductId=(id)=>{
    setProductId(id);
  }

  const submitHandler=(e)=>{
    e.preventDefault();
    setReset(false);
    setCreate(true);
    const formData = new FormData();
    if(isCustom==true){
        formData.append('is_custom',isCustom);
    }
    formData.append('name',code);
    formData.append('note',description);
    formData.append('image',thumbnail);
    if (productId !== null) {
        formData.append('product_id', productId);
    }
    http.post("/admin/gifts",formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
    })
    .then((res)=>{
    toast.success("Gift Created", { autoClose: 2000 });
      setCreate(false);
      setCode("");
      setDescription("");
      setExpiryDate("");
      setReset(true);
      setIsCustom(null);
      setProductId(null);
    })
    .catch((error)=>{
      setCreate(false);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      } else {
        //console.error(error);
      }
      //console.log(error);
    })
  }



  


  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[600px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Gift 
              </h3>
            </div>
            <form onSubmit={submitHandler}>
              <div className="p-6.5">

              
                <div className="mb-4.5">
                <div className="w-full">
                  <InputSelect label="Gift Type" categories={categories} handleCategoryId={handleCategoryId} reset={reset}/>

                  {errors.recipe_category_id && (
                    <div className="text-red-500 mt-1">
                      {errors.recipe_category_id.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                </div>
                </div>


                {
                    isCustom==true?
                    <div>
                        <div className="mb-4.5">
                        <div className="flex gap-x-3">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Gift Item Name<span className="text-red-500 pl-1 text-2xl">*</span>
                        </label>

                        </div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e)=>setCode(e.target.value)}
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                        {errors.code && (
                            <div className="text-red-500 mt-1">
                            {errors.code.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                            </div>
                        )}
                        </div>

                    <div className="mb-4.5">
                    <ImagePreviewer onImageSelect={handleThumbmail} label="Gift Image" clearImage={clearImage} required={true}/>
                    {thumbnail && (
                        <p className="mt-2 text-sm text-gray-500">
                        Selected Image: {thumbnail.name}
                        </p>
                    )}
                    {errors.thumbnail && (
                        <div className="text-red-500 mt-1">
                        {errors.thumbnail.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))}
                        </div>
                    )}
                    </div>


                    <div>
                    <label className="mb-3 block text-black dark:text-white">
                    Gift Note
                    </label>
                    <textarea
                    rows={3}
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    ></textarea>
                    </div>

                    <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
                  {
                    create?"Creating...":"Create"

                  }
                </button>
                    </div>

                    
                
                
                :<div></div>
                }


                

              {
                isCustom==false?
                <div className="mb-4.5 mt-5">
                <div className="w-full">
                  <InputSelect label="Select Product" categories={products} handleCategoryId={handleProductId} reset={reset} required={true}/>

                  {errors.recipe_category_id && (
                    <div className="text-red-500 mt-1">
                      {errors.recipe_category_id.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
                  {
                    create?"Creating...":"Create"

                  }
                </button>

                </div>
                </div>:<div></div>
              }

                

                

                

                  

                
                
              </div>
            </form>
          </div>
        </div>
    </main>
  )
}

export default CreateGift
