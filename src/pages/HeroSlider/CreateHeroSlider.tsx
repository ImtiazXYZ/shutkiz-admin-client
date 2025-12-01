import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';
import ImagePreviewer from '../../components/Image/ImagePreviewer';

function CreateHeroSlider() {
  const { http } = AdminAuth();
  const [url, setUrl] = useState<string | null>('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [create, setCreate] = useState<boolean>(false);
  const [clearImage, setClearImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const handleThumbmail = (imageFile: File | null) => {
    setThumbnail(imageFile);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('url', url);
    formData.append('image', thumbnail);
    http
      .post('/admin/home-sliders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        notify();
        setCreate(false);
        setThumbnail(null);
        setClearImage(true);
        setTimeout(() => setClearImage(false), 0);
        //console.log(res);
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
    toast.success('Slider Created', {
      autoClose: 3000,
    });

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[500px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Create Slider
            </h3>
          </div>
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
                  label="Slider Image"
                  clearImage={clearImage}
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
                {create ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreateHeroSlider;
