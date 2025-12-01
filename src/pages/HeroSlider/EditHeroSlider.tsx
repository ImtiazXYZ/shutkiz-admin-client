import { Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';
import ImagePreviewer from '../../components/Image/ImagePreviewer';

function EditHeroSlider() {
  const { id } = useParams();
  const { http } = AdminAuth();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>('');
  const [create, setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [category, setCategory] = useState({
    name: '',
    thumbnail: '',
    banner: '',
    url: '',
  });
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('url', url);
    formData.append('image', thumbnail);
    formData.append('_method', 'PUT');

    http
      .post(`/admin/home-sliders/${id}`, formData)
      .then((res) => {
        setCreate(false);
        setThumbnail(null);
        setClearImage(true);
        setTimeout(() => setClearImage(false), 0);
        notify();
        navigate('/website-setup/home-slider/all');
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

  const getCategoryData = async () => {
    try {
      const res = await http.get(`/admin/home-sliders/${id}/edit`);
      setCategory(res.data);
      setUrl(res.data.url);
      //console.log(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const notify = () =>
    toast.success('Slider Updated', {
      autoClose: 3000,
    });

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[500px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Edit Slider
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
                    URL/Link
                  </label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />

                  {errors.url && (
                    <div className="text-red-500 mt-1">
                      {errors.url.map((error, index) => (
                        <div key={index}>{error}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4.5">
                  <ImagePreviewer
                    onImageSelect={handleThumbmail}
                    label="Testimonial Image"
                    clearImage={clearImage}
                    currentImage={
                      category.image ? `${baseURL}/${category.image}` : null
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

export default EditHeroSlider;
