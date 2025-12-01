import { useEffect, useRef, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from 'antd';
import { useParams } from "react-router-dom";

function RecipeDetails() {
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const {id} = useParams();
  const {http} = AdminAuth();
  const [isLoading,setIsLoading] = useState(true);
  const [recipe,setRecipe] = useState([]);

  useEffect(()=>{
    fetchRecipe();
  },[])



  const fetchRecipe=()=>{
    http.get(`/admin/recipes/${id}`)
    .then((res)=>{
        setRecipe(res.data);
        setIsLoading(false);
    })
    .catch((error)=>{
        console.log(error.data);
    })
  }



  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[700px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Recipe Details
              </h3>
            </div>
            {
                isLoading?<div className="p-10"><Skeleton paragraph={{ rows: 8 }}/></div>:
                <div className="p-6.5 text-black">
            <div className="grid grid-cols-3 gap-y-7 items-center ">
                <h2 className="font-semibold">Title :</h2>
                <div className="col-span-2">{recipe.title}</div>

                <h2 className="font-semibold">Categroy :</h2>
                <div className="col-span-2">{recipe.recipe_categories.name}</div>

                <h2 className="font-semibold">Thumbnail :</h2>
                <div className="col-span-2">
                <img src={`${baseURL}/${recipe.thumbnail}`} alt="" className="w-[80px]" />
                </div>

                <h2 className="font-semibold">Banner :</h2>
                <div className="col-span-2">
                <img src={`${baseURL}/${recipe.banner}`} alt="" className="w-[80px]" />
                </div>
            </div>
            <div className="grid grid-cols-3 pt-7">

                <h2 className="font-semibold">Description :</h2>
                <div className="col-span-2">
                <div dangerouslySetInnerHTML={{ __html: recipe.description }} />
                </div>
            </div>
            </div>
            }

          </div>
        </div>
    </main>
  )
}

export default RecipeDetails
