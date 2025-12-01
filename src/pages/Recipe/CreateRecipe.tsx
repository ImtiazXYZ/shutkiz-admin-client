import { useEffect, useRef, useState } from "react";
import ImagePreviewer from "../../components/Image/ImagePreviewer";
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from "jodit-react";
import { Skeleton } from 'antd';
import InputSelect from "../../components/Input/InputSelect";

function CreateRecipe() {
  const {http} = AdminAuth();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [title,setTitle] = useState<string>("");
  const [create,setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [categories,setCategories] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string>('');

  useEffect(()=>{
    fetchRecipeCategories();
  },[])

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
  };

  const handleBanner = (imageFile: File | null) => {
    setBanner(imageFile);
  };



  const fetchRecipeCategories=()=>{
    http.get("/admin/all-recipe-categories")
    .then((res)=>{
        setCategories(res.data);
        setIsLoading(false);
    })
    .catch((error)=>{
        console.log(error.data);
    })
  }

  const handleCategoryId=(id)=>{
    setCategoryId(id);
    //console.log(categoryId);
  }

  const submitHandler=(e)=>{
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('recipe_category_id',categoryId);
    formData.append('title',title);
    formData.append('thumbnail',thumbnail);
    formData.append('banner',banner);
    formData.append('description',content);
    http.post("/admin/recipes",formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
    })
    .then((res)=>{
    toast.success("Recipe Created", { autoClose: 2000 });
      setCreate(false);
      setTitle("");
      setThumbnail(null);
      setBanner(null);
      setClearImage(true); 
      setContent("");
      setTimeout(() => setClearImage(false), 0);
      //console.log(res);
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

  const config = {
    readonly: false,
    height: 400,
    toolbarSticky: false,
    uploader: {
        insertImageAsBase64URI: true,
    },
  };


  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[600px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Recipe
              </h3>
            </div>
            <form onSubmit={submitHandler}>
              <div className="p-6.5">

              {
                isLoading?<Skeleton.Button active={true} block={true}  />:
                <div className="mb-4.5">
                  <InputSelect label="Select Recipe Category" categories={categories} handleCategoryId={handleCategoryId}/>

                  {errors.recipe_category_id && (
                    <div className="text-red-500 mt-1">
                      {errors.recipe_category_id.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                </div>
              }

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  {errors.title && (
                    <div className="text-red-500 mt-1">
                      {errors.title.map((error, index) => (
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

                <div className="mb-4.5">
                    <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={(newContent) => setContent(newContent)}/>
                    {errors.description && (
                    <div className="text-red-500 mt-1">
                      {errors.description.map((error, index) => (
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

export default CreateRecipe
