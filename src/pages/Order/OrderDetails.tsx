import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';

function OrderDetails() {
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const { id } = useParams();
  const { http } = AdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = () => {
    http
      .get(`/admin/orders/${id}`)
      .then((res) => {
        setBlog(res.data);
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error.data);
      });
  };

  const galleryImages =
    blog && blog.gallery_images ? JSON.parse(blog.gallery_images) : [];

  return (
    <main className="">
      <div className="flex flex-col gap-9 max-w-[700px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white pb-14 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Order Details
            </h3>
          </div>
          {isLoading ? (
            <div className="p-10">
              <Skeleton paragraph={{ rows: 8 }} />
            </div>
          ) : (
            <div className="p-6.5 text-black">
              <div>
                <h2 className="font-semibold text-lg pb-5">User Info</h2>
                <div className="grid grid-cols-3 gap-y-7 items-center ">
                  <h2 className="font-semibold">Name :</h2>
                  <div className="col-span-2">{blog.name}</div>

                  <h2 className="font-semibold">Mobile :</h2>
                  <div className="col-span-2">{blog.mobile}</div>

                  <h2 className="font-semibold">Email :</h2>
                  <div className="col-span-2">{blog.email}</div>

                  <h2 className="font-semibold">Address :</h2>
                  <div className="col-span-2">
                    {blog.address},{' '}
                    {blog.division == 1
                      ? 'Dhaka'
                      : blog.division == 2
                      ? 'Chittagong'
                      : blog.division == 4
                      ? 'Rajshahi'
                      : blog.division == 7
                      ? 'Rangpur'
                      : blog.division == 3
                      ? 'Khulna'
                      : blog.division == 5
                      ? 'Barishal'
                      : blog.division == 6
                      ? 'Sylhet'
                      : blog.division == 8
                      ? 'Mymensingh'
                      : 'Unknown Division'}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="font-semibold text-lg pb-5 pt-14">
                  Discount & Gifts
                </h2>
                <div className="grid grid-cols-3 gap-y-4 items-center ">
                  <h2 className="font-semibold">Threshold Applied :</h2>
                  <div className="col-span-2">
                    <span
                      className={`${
                        blog.is_threshold ? 'bg-green-500' : 'bg-red-500'
                      } rounded-xl px-5 text-white py-1`}
                    >
                      {blog.is_threshold ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <h2 className="font-semibold">Coupon Applied :</h2>
                  <div className="col-span-2">
                    <span
                      className={`${
                        blog.is_coupon ? 'bg-green-500' : 'bg-red-500'
                      } rounded-xl px-5 text-white py-1`}
                    >
                      {blog.is_coupon ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <h2 className="font-semibold">Free Shipping :</h2>
                  <div className="col-span-2">
                    <span
                      className={`${
                        blog.is_free_shipping ? 'bg-green-500' : 'bg-red-500'
                      } rounded-xl px-5 text-white py-1`}
                    >
                      {blog.is_free_shipping ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <h2 className="font-semibold">Attach Gift :</h2>
                  <div className="col-span-2">
                    <span
                      className={`${
                        blog?.threshold?.is_free_shipping
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      } rounded-xl px-5 text-white py-1`}
                    >
                      {blog.is_free_shipping ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {blog.is_coupon ? (
                    <>
                      <h2 className="font-semibold">Coupon Amount :</h2>
                      <div className="col-span-2">{blog.coupon_amount}</div>
                    </>
                  ) : (
                    ''
                  )}

                  {blog.is_threshold && blog.threshold.is_free_shipping == 0 ? (
                    <h2 className="font-semibold">Gift :</h2>
                  ) : (
                    ''
                  )}
                </div>
              </div>

              {blog.is_threshold && blog.threshold.is_free_shipping == 0 ? (
                <div className="bg-white shadow-xl w-full py-5 px-5">
                  <div>
                    <img
                      src={`${baseURL}/${
                        blog.threshold.gift.is_custom
                          ? blog.threshold.gift.image
                          : blog.threshold.gift.product.thumbnail
                      }`}
                      alt=""
                      className="w-[70px]"
                    />
                  </div>
                  <p className="text-black pt-2">
                    {blog.threshold.gift.is_custom
                      ? blog.threshold.gift.name
                      : blog.threshold.gift.product.name}
                  </p>
                </div>
              ) : (
                ''
              )}
              <div className="pt-14">
                <h2 className="font-semibold text-lg pb-5">
                  Product & Price Info
                </h2>
                <div>
                  <table className="w-full table-auto text-sm">
                    <thead>
                      <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="min-w-[100px] text-center py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                          Image
                        </th>
                        <th className="min-w-[100px] text-center py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                          Name
                        </th>
                        <th className="min-w-[120px] text-center py-4 px-4 font-medium text-black dark:text-white">
                          Quantity
                        </th>
                        <th className="min-w-[120px] text-center py-4 px-4 font-medium text-black dark:text-white">
                          Price
                        </th>
                        <th className="min-w-[120px] text-center py-4 px-4 font-medium text-black dark:text-white">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {blog.products.map((product, key) => (
                        <tr key={key}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white text-center">
                              <img
                                src={`${baseURL}/${product.thumbnail}`}
                                alt=""
                                className="w-[70px]"
                              />
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white text-center">
                              {product.name}{' '}
                              <span className="pl-3">
                                {product.additional_stock_data.weight}
                              </span>
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white text-center">
                              {product.pivot.quantity}
                            </p>
                          </td>

                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white text-center">
                              {product.pivot.price}
                            </p>
                          </td>

                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white text-center">
                              {product.pivot.price * product.pivot.quantity}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-14">
                <h2 className="font-semibold text-lg pb-5">Order Total</h2>
                <div className="grid grid-cols-3 gap-y-3 items-center ">
                  <h2 className="font-semibold">Subtotal :</h2>
                  <div className="col-span-2 text-black">{blog.subtotal}</div>

                  <h2 className="font-semibold">Shipping Cost :</h2>
                  <div className="col-span-2 text-black">
                    {blog.shipping_cost}
                  </div>

                  <h2 className="font-semibold">Discount (Coupon) :</h2>
                  <div className="col-span-2 text-black">
                    {blog.is_coupon ? blog.coupon_amount : '0'}
                  </div>

                  <h2 className="font-semibold">Grand Total :</h2>
                  <div className="col-span-2 text-black font-semibold text-lg">
                    {blog.grandtotal}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
