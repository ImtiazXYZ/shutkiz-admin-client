import { StyleProvider } from '@ant-design/cssinjs';
import { Skeleton, Switch } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';
import ImagePreviewer from '../../components/Image/ImagePreviewer';

function EditCategory() {
  const { id } = useParams();
  const { http } = AdminAuth();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [name, setName] = useState<string | null>('Demo');
  const [create, setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [showNav, setShowNav] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [category, setCategory] = useState({
    name: '',
    bn_name: '',
    thumbnail: '',
    banner: '',
    is_nav_item: '',
  });
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
  };

  const handleBanner = (imageFile: File | null) => {
    setBanner(imageFile);
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('bn_name', category.bn_name);
    formData.append('thumbnail', thumbnail);
    formData.append('banner', banner);
    formData.append('is_nav_item', showNav ? '1' : '0');
    formData.append('_method', 'PUT');

    http
      .post(`/admin/categories/${id}`, formData)
      .then((res) => {
        setCreate(false);
        setName('');
        setThumbnail(null);
        setBanner(null);
        setClearImage(true);
        setShowNav(false);
        setTimeout(() => setClearImage(false), 0);
        localStorage.setItem('updateAlert', 'Category updated successfully!');
        navigate('/categories/all');
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

  const handleNameChange = (e) => {
    setCategory({ ...category, name: e.target.value });
  };
  const handleBnNameChange = (e) => {
    setCategory({ ...category, bn_name: e.target.value });
  };

  const getCategoryData = async () => {
    try {
      const res = await http.get(`/admin/categories/${id}/edit`);
      setCategory(res.data);
      setShowNav(res.data?.is_nav_item);
      //console.log(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowNav = () => {
    setShowNav(!showNav);
  };

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[500px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Edit Category
            </h3>
          </div>
          {isLoading ? (
            <div className="p-10">
              <Skeleton />
            </div>
          ) : (
            <form onSubmit={submitHandler}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={handleNameChange}
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
                  <label className="mb-2.5 block text-black dark:text-white">
                    Bangla Name
                  </label>
                  <input
                    type="text"
                    value={category.bn_name}
                    onChange={handleBnNameChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  {errors.bn_name && (
                    <div className="text-red-500 mt-1">
                      {errors.bn_name.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4.5">
                  <ImagePreviewer
                    onImageSelect={handleThumbmail}
                    label="Thumbnail *"
                    clearImage={clearImage}
                    currentImage={
                      category.thumbnail
                        ? `${baseURL}/${category.thumbnail}`
                        : null
                    }
                  />
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
                  <ImagePreviewer
                    onImageSelect={handleBanner}
                    label="Banner"
                    clearImage={clearImage}
                    currentImage={
                      category.banner ? `${baseURL}/${category.banner}` : null
                    }
                  />
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

                <div className="flex items-center gap-x-2">
                  <StyleProvider hashPriority="high">
                    <span>Show in Navbar</span>{' '}
                    <Switch checked={showNav} onChange={handleShowNav} />
                  </StyleProvider>
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10"
                >
                  {create ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default EditCategory;
