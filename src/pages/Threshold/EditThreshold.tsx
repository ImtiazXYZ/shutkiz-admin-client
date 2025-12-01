import { useEffect, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSelect from "../../components/Input/InputSelect";
import ThresholdSelect from "../../components/Input/ThresholdSelect";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "antd";
function EditThreshold() {
  const {http} = AdminAuth();
  const {id} = useParams();
  const [create,setCreate] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading,setIsLoading] = useState(true);
  const [reset,setReset] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [code,setCode] = useState<string>("");
  const [isGift,setIsGift] = useState(false);
  const [gifts,setGifts] = useState();
  const [giftId,setGiftId] = useState();
  const [threshold,setThreshold] = useState();
  const [type,setType] = useState();
  const [selectedGiftId,setSelectedGiftId] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
    fetchThreshold();
    fetchGifts();
  },[])
  const categories = [
      {
          "id" : "Free_Shipping",
          "name" : "Free Shipping"
      },
      {
          "id" : "Gift",
          "name" : "Gift"
      },
  ];

  const fetchGifts = () => {
    http.get("/admin/get-thresholds-gift",{
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((res)=>{
        setGifts(res.data);
    })
    .catch((error)=>{
      console.log(error);
    })
  }


  const fetchThreshold=async()=>{
    try {
        const res =await  http.get(`/admin/thresholds/${id}/edit`);
        setThreshold(res.data);
        setCode(res.data.amount);
        if(res.data.is_free_shipping==1){
            setIsGift(false);
            setType("Free_Shipping");
        }else{
            setGiftId(res.data.gift_id??null);
            setIsGift(true);
            setType("Gift");
            setSelectedGiftId(res.data.gift.id);
        }
        
    } catch (error) {
        
    }finally{
        setIsLoading(false);
    }
  }

  const handleCategoryId=(id)=>{
    setCategoryId(id);
    if(id=="Gift"){
        setIsGift(true);
    }else{
        setIsGift(false);
    }
  }
  const handleGiftId=(id)=>{
    setGiftId(id);
  }

  const submitHandler=(e)=>{
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('amount',code);
    if(isGift==true){
        formData.append('is_gift',isGift);
        formData.append('gift_id',giftId);
    }
    formData.append('_method', 'PUT');
    http.post(`/admin/thresholds/${id}`,formData,{
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((res)=>{
    toast.success("Threshold Updated", { autoClose: 2000 });
      setCreate(false);
      setCode("");
      setGiftId(null);
      setIsGift(false);
      setCategoryId(null);
      setReset(true);
      navigate('/thresholds/all');
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
                Create Threshold 
              </h3>
            </div>
            <form onSubmit={submitHandler}>
              <div className="p-6.5">

              {
                isLoading?<div><Skeleton paragraph={{rows:4}}/></div>:
                <div>
                    <div className="mb-4.5">
                  <div className="flex gap-x-3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amount
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
                <div className="w-full">
                  <InputSelect label="Discount Type" categories={categories} handleCategoryId={handleCategoryId} reset={reset} subcategory={type}/>

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
                    isGift?
                    <div className="mb-4.5">
                <div className="w-full">
                  <ThresholdSelect label="Select Gift" categories={gifts} handleCategoryId={handleGiftId} reset={reset} subcategory={selectedGiftId}/>

                  {errors.recipe_category_id && (
                    <div className="text-red-500 mt-1">
                      {errors.recipe_category_id.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                </div>
                </div>:<div></div>
                }


                

                

                

                

                  

                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
                  {
                    create?"Updating...":"Update"

                  }
                </button>
                </div>
              }
                
              </div>
            </form>
          </div>
        </div>
    </main>
  )
}

export default EditThreshold
