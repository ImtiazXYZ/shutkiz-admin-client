import { useEffect, useState } from "react";
import ImagePreviewer from "../../components/Image/ImagePreviewer";
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSelect from "../../components/Input/InputSelect";
import { Skeleton } from 'antd';

function CreateSubcategory() {
  const {http} = AdminAuth();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [name,setName] = useState<string|null>("");
  const [create,setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [categories,setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [isLoading,setIsLoading] = useState(true);
  const [reset,setReset] = useState(false);

  useEffect(()=>{
    fetchCategories();
  },[])

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
    
  };

  const handleBanner = (imageFile: File | null) => {
    setBanner(imageFile);
    
  };

  const handleCategoryId=(id)=>{
    setCategoryId(id);
    //console.log(categoryId);
  }

  const fetchCategories=()=>{
    http.get("/admin/all-categories")
    .then((res)=>{
        setCategories(res.data);
        setIsLoading(false);
    })
    .catch((error)=>{
        console.log(error.data);
    })
  }

  const submitHandler=(e)=>{
    e.preventDefault();
    setCreate(true);
    setReset(false);
    const formData = new FormData();
    formData.append('name',name);
    formData.append('thumbnail',thumbnail);
    formData.append('banner',banner);
    formData.append('category_id',categoryId);
    http.post("/admin/sub-categories",formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
    })
    .then((res)=>{
      notify();
      setCreate(false);
      setName("");
      setReset(true);
      setThumbnail(null);
      setBanner(null);
      setClearImage(true); 
      setTimeout(() => setClearImage(false), 0);
      //console.log(res);
    })
    .catch((error)=>{
      setCreate(false);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error(error);
      }
      console.log(error);
    })
  }

  const notify = () => toast.success("Subategory Created",{
    autoClose: 3000,
  });


  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[500px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Subcategory
              </h3>
            </div>
            <form onSubmit={submitHandler}>
              <div className="p-6.5">


              {
                isLoading?<Skeleton.Button active={true} block={true}  />:
                <div className="mb-4.5">
                  <InputSelect label="Select Parent Category" categories={categories} handleCategoryId={handleCategoryId} reset={reset}/>

                  {errors.category_id && (
                    <div className="text-red-500 mt-1">
                      {errors.category_id.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                </div>
              }

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

                  {errors.name && (
                    <div className="text-red-500 mt-1">
                      {errors.name.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                </div>


                <div className="mb-4.5">
                <ImagePreviewer onImageSelect={handleThumbmail} label="Thumbnail" clearImage={clearImage} />
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

                <div className="mb-4.5">
                <ImagePreviewer onImageSelect={handleBanner} label="Banner" clearImage={clearImage} />
                  {banner && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected Image: {banner.name}
                    </p>
                  )}
                  {errors.banner && (
                    <div className="text-red-500 mt-1">
                      {errors.banner.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>

                

                

                  

                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
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

export default CreateSubcategory
