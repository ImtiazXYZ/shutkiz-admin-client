import { useEffect, useState } from "react";
import { Switch } from 'antd';
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StyleProvider } from '@ant-design/cssinjs';


function HeaderSetup() {
  const {http} = AdminAuth();
  const [create,setCreate] = useState<boolean>(false);
  const [topbarMessage,setTopbarMessage] = useState();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading,setIsLoading] = useState(true);
  const [setting,setSetting] = useState();
  const [isTopbar,setIsTopbar] = useState();


  useEffect(()=>{
    fetchSetting();
  },[])

  const fetchSetting=async()=>{
    setIsLoading(true); //uncomment this for pagination loading too
        try {
          const res = await http.get(`/admin/website-settings`);
          setTopbarMessage(res.data.topbar_message);
          if(res.data.is_topbar==1){
            setIsTopbar(true);
          }else{
            setIsTopbar(false)
          }
        } catch (error) {
          console.log(error);
        }finally{
          setIsLoading(false);
        }
  }

  
  const submitHandler=(e)=>{
    e.preventDefault();
    if(topbarMessage==""){
      toast.error("This cant be empty");
      return;
    }
    setCreate(true);
    const formData = new FormData();
    if(isTopbar==true){
      formData.append('is_topbar',isTopbar);
    }
    formData.append('topbar_message',topbarMessage);
    formData.append('_method', 'PUT');
    http.post(`/admin/website-settings/${1}`, formData,{
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then((res)=>{
      notify();
      setCreate(false);
      
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

  const notify = () => toast.success("Header Updated",{
    autoClose: 3000,
  });


  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
    if(checked==true){
      setIsTopbar(true);
    }else{
      setIsTopbar(false);
    }
  };

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[600px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Website Header Setup
              </h3>
            </div>
            <form onSubmit={submitHandler}>
              <div className="p-6.5">

                

                <div className="mb-4.5">
                        <div className="flex gap-x-3">
                        <label className="mb-2.5 block text-black dark:text-white">
                            Topbar Message
                        </label>
                        <StyleProvider hashPriority="high">
                        <Switch checked={isTopbar} onChange={onChange} />
                        </StyleProvider>

                        </div>
                        <input
                            type="text"
                            value={topbarMessage}
                            onChange={(e)=>setTopbarMessage(e.target.value)}
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

                

                

                

                  

                <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
                  {
                    create?"Updating...":"Update"

                  }
                </button>
                
              </div>
            </form>
          </div>
        </div>
    </main>
  )
}

export default HeaderSetup
