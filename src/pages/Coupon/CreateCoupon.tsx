import {useRef, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import JoditEditor from "jodit-react";
import { Button, Skeleton } from 'antd';
import InputSelect from "../../components/Input/InputSelect";
import CustomDatePicker from "../../components/Custom/CustomDatePicker";
import { StyleProvider } from '@ant-design/cssinjs';
function CreateCoupon() {
  const {http} = AdminAuth();

  const [create,setCreate] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading,setIsLoading] = useState(true);
  const [reset,setReset] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [code,setCode] = useState<string>("");
  const [description,setDescription] = useState<string>("");
  const [amount,setAmount] = useState<string>("");
  const [expiryDate,setExpiryDate] = useState<string>("");
  const categories = [
      {
          "id" : "Flat",
          "name" : "Flat"
      },
      {
          "id" : "Percentage",
          "name" : "Percentage"
      },
  ]

  const handleCategoryId=(id)=>{
    setCategoryId(id);
    //console.log(categoryId);
  }

  const submitHandler=(e)=>{
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('type',categoryId);
    formData.append('code',code);
    formData.append('description',description);
    formData.append('amount',amount);
    formData.append('expiry_date',expiryDate);
    http.post("/admin/coupons",formData,{
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((res)=>{
    toast.success("Coupon Created", { autoClose: 2000 });
      setCreate(false);
      setCode("");
      setDescription("");
      setAmount(""); 
      setExpiryDate("");
      setReset(true);
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



  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(code);
  };


  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[600px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Create Coupon 
              </h3>
            </div>
            <form onSubmit={submitHandler}>
              <div className="p-6.5">

              

                <div className="mb-4.5">
                  <div className="flex gap-x-3">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Coupon Code 
                  </label>
                  <StyleProvider hashPriority="high">
                    
                    <Button type="primary" size="small" onClick={generateCouponCode}>Generate</Button>
                    
                    </StyleProvider>
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


                <div>
                <label className="mb-3 block text-black dark:text-white">
                  Coupon Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e)=>setDescription(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

                <div className="mb-4.5 flex justify-between pt-3 gap-x-3">
                <div className="w-full">
                  <InputSelect label="Discount Type" categories={categories} handleCategoryId={handleCategoryId} reset={reset}/>

                  {errors.recipe_category_id && (
                    <div className="text-red-500 mt-1">
                      {errors.recipe_category_id.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}

                </div>
                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Coupon Amount
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  {errors.amount && (
                    <div className="text-red-500 mt-1">
                      {errors.amount.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>
                </div>

                <div className="mb-4.5">
                  <CustomDatePicker title="Expiry Date" expiryDate={expiryDate} setExpiryDate={setExpiryDate} />
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

export default CreateCoupon
