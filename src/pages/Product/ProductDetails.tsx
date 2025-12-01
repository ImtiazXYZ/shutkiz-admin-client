import { useEffect, useRef, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import 'react-toastify/dist/ReactToastify.css';
import { Skeleton } from 'antd';
import { useParams } from "react-router-dom";

function ProductDetails() {
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const {id} = useParams();
  const {http} = AdminAuth();
  const [isLoading,setIsLoading] = useState(true);
  const [blog,setBlog] = useState([]);

  useEffect(()=>{
    fetchBlog();
  },[])



  const fetchBlog=()=>{
    http.get(`/admin/products/${id}`)
    .then((res)=>{
        setBlog(res.data);
        setIsLoading(false);
    })
    .catch((error)=>{
        console.log(error.data);
    })
  }

  const galleryImages = blog && blog.gallery_images ? JSON.parse(blog.gallery_images) : [];

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[700px] mx-auto">
          <div className="rounded-sm border border-stroke bg-white pb-14 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Product Details
              </h3>
            </div>
            {
                isLoading?<div className="p-10"><Skeleton paragraph={{ rows: 8 }}/></div>:
                <div className="p-6.5 text-black">
                <div>
                    <h2 className="font-semibold text-lg pb-5">Product Info</h2>
                    <div className="grid grid-cols-3 gap-y-7 items-center ">
                        <h2 className="font-semibold">Title :</h2>
                        <div className="col-span-2">{blog.name}</div>

                        <h2 className="font-semibold">Categroy :</h2>
                        <div className="col-span-2">{blog.category.name}</div>

                        <h2 className="font-semibold">Subcategroy :</h2>
                        <div className="col-span-2">{blog.subcategory?.name}</div>
                    </div>
                </div>
                <div className="pt-14">
                    <h2 className="font-semibold text-lg pb-5">Product Images</h2>
                    <div className="grid grid-cols-3 gap-y-7 items-center ">
                        <h2 className="font-semibold">Thumbnail :</h2>
                        <div className="col-span-2">
                        <img src={`${baseURL}/${blog.thumbnail}`} alt="" className="w-[80px]" />
                        </div>
                        <h2 className="font-semibold">Gallery Images :</h2>
                        <div className="col-span-2">
                        <div className="flex gap-x-4">
                        {galleryImages.map((image, index) => (
                            <img
                                key={index}
                                src={`${baseURL}/${image}`}
                                alt={`${blog.name} gallery image ${index + 1}`}
                                className="w-[80px] h-auto object-cover m-2"
                            />
                            ))}
                        </div>
                        </div>
                    </div>
                </div>
                <div className="pt-14">
                    <h2 className="font-semibold text-lg pb-5">Product Stock & Price</h2>
                    <div>
                    <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] text-center py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Weight
              </th>
              <th className="min-w-[100px] text-center py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Stock
              </th>
              <th className="min-w-[120px] text-center py-4 px-4 font-medium text-black dark:text-white">
                Regular Price
              </th>
              <th className="min-w-[130px] text-center py-4 px-4 font-medium text-black dark:text-white">
                Discount Price
              </th>
            </tr>
          </thead>
          <tbody>
            {blog.stocks.map((stock, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white text-center">
                    {stock.weight}
                  </h5>
                  
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white text-center">
                  {stock.stock}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white text-center">
                  {stock.regular_price}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white text-center">
                  {stock.discount_price}
                  </p>
                </td>
                
                
              </tr>
            ))}
          </tbody>
        </table>
                    </div>
                </div>


            <div className="grid grid-cols-3 pt-14">

                <h2 className="font-semibold">Description :</h2>
                <div className="col-span-2">
                <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                </div>
            </div>
            </div>
            }

          </div>
        </div>
    </main>
  )
}

export default ProductDetails
