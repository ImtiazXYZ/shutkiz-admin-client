import { StyleProvider } from '@ant-design/cssinjs';
import { Switch } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';
import InputSelect from '../../components/Input/InputSelect';

function EditFreeShipping() {
  const { http } = AdminAuth();
  const [create, setCreate] = useState<boolean>(false);
  const [topbarMessage, setTopbarMessage] = useState();
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [setting, setSetting] = useState();
  const [isTopbar, setIsTopbar] = useState();

  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [reset, setReset] = useState(false);
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  useEffect(() => {
    fetchSetting();
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    http
      .get('/admin/all-categories')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategoryId = (id) => {
    setCategoryId(id);
  };

  const fetchSetting = async () => {
    setIsLoading(true); //uncomment this for pagination loading too
    try {
      const res = await http.get(`/admin/website-settings`);
      if (
        res.data.free_shipping_category_id &&
        res.data.free_shipping_category_id !== null
      ) {
        setCategoryId(res.data.free_shipping_category_id);
      }
      if (res.data.is_free_shipping == 1) {
        setIsFreeShipping(true);
      } else {
        setIsFreeShipping(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    if (isFreeShipping) {
      formData.append('is_free_shipping', 1);
    }
    formData.append('free_shipping_category_id', categoryId);
    formData.append('_method', 'PUT');
    http
      .post(`/admin/website-settings/${1}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        notify();
        setCreate(false);
      })
      .catch((error) => {
        setCreate(false);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data
        ) {
          setErrors(error.response.data.errors || {});
        } else {
          //console.error(error);
        }
        //console.log(error);
      });
  };

  const notify = () =>
    toast.success('Free Shipping Updated', {
      autoClose: 3000,
    });

  const handleFreeShipping = (checked: boolean) => {
    if (checked == true) {
      setIsFreeShipping(true);
    } else {
      setIsFreeShipping(false);
    }
  };

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[600px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Free Shipping
            </h3>
          </div>
          <form onSubmit={submitHandler}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <div className="flex gap-x-3 mb-4">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Enable Free Shipping
                  </label>
                  <StyleProvider hashPriority="high">
                    <Switch
                      checked={isFreeShipping}
                      onChange={handleFreeShipping}
                    />
                  </StyleProvider>
                </div>
                <div className="w-full">
                  <InputSelect
                    label="Select Category"
                    categories={categories}
                    handleCategoryId={handleCategoryId}
                    reset={reset}
                    disable={!isFreeShipping}
                    subcategory={categoryId}
                  />
                  {errors.category_id && (
                    <span className="text-sm text-red-500">
                      {errors.category_id}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10"
              >
                {create ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default EditFreeShipping;
