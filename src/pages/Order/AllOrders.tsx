import { Empty, Select, Skeleton, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { GrTransaction } from 'react-icons/gr';
import { IoEyeOutline } from 'react-icons/io5';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminAuth from '../../components/Admin/AdminAuth';
import Pagination from '../../components/Custom/Pagination';
import DeleteModal from '../../components/Modals/DeleteModal';
import ImagePreviewModal from '../../components/Modals/ImagePreviewModal';

function AllOrders() {
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { http } = AdminAuth();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const navigate = useNavigate();

  const [isImagePreVisible, setIsImagePreVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page) => {
    setIsLoading(true); //uncomment this for pagination loading too
    try {
      const res = await http.get(`/admin/orders?page=${page}`);
      setBlogs(res.data.data);
      setTotalPages(res.data.last_page);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (itemId: number) => {
    setSelectedItem(itemId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      try {
        await http.delete(`/admin/blogs/${selectedItem}`);
        toast.success('Blog Deleted', { autoClose: 2000 });
        const remainingItemsOnPage = blogs.length - 1;
        if (remainingItemsOnPage === 0 && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else {
          fetchBlogs(currentPage);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setDeleteModalVisible(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const handleDetails = (id) => {
    navigate(`/orders/details/${id}`);
  };

  const handleTransaction = (id) => {
    navigate(`/orders/transaction/${id}`);
  };

  const handleImageModalCancel = () => {
    setIsImagePreVisible(false);
    setCurrentImage(null);
  };

  const handleChange = async (value: string, orderId: string) => {
    const formData = new FormData();
    formData.append('status', value);
    formData.append('orderId', orderId);
    try {
      const res = await http.post('/admin/update-order-status', formData);
      toast.success('Order Status Updated', { autoClose: 2000 });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePdf = async (id) => {
    try {
      const response = await http.post(
        `/admin/generate-order-pdf/${id}`,
        null,
        { responseType: 'blob' },
      );

      // Create a Blob URL for the PDF and open it in a new tab
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      window.open(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {isLoading && (
            <div className="pb-10">
              <Skeleton active />
            </div>
          )}
          {!isLoading && (
            <div className="main">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      #SL
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="min-w-[350px] py-4 px-4 font-medium text-black dark:text-white text-center">
                      Customer
                    </th>
                    <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                      Sub Total
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Grand Total
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.length > 0 ? (
                    <>
                      {blogs.map((blog, key) => (
                        <tr key={key}>
                          <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                            <h5 className="font-medium text-black dark:text-white">
                              {key + 1}
                            </h5>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <Select
                              defaultValue={blog.status}
                              style={{ width: 120 }}
                              onChange={(value) => handleChange(value, blog.id)}
                              options={[
                                { value: 'Pending', label: 'Pending' },
                                { value: 'Processing', label: 'Processing' },
                                { value: 'Complete', label: 'Complete' },
                                { value: 'Cancel', label: 'Cancel' },
                              ]}
                            />
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <table className="w-full table-auto text-sm">
                              <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Name
                                  </th>
                                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    Mobile
                                  </th>
                                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                                    Email
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                    <h5 className="font-medium text-black dark:text-white text-center">
                                      {blog.name}
                                    </h5>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                      {blog.mobile}
                                    </p>
                                  </td>
                                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                    <p className="text-black dark:text-white text-center">
                                      {blog.email}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <p className="text-black dark:text-white">
                              {blog.subtotal}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex gap-x-2">
                              <p className="text-black dark:text-white">
                                {blog.grandtotal}
                              </p>

                              <Tooltip
                                title={`${
                                  blog?.is_free_shipping
                                    ? 'Free Shipping'
                                    : 'Regular'
                                }`}
                              >
                                <FaInfoCircle />
                              </Tooltip>
                            </div>
                          </td>

                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <div className="flex gap-x-2">
                              <div
                                onClick={() => handleDetails(blog.id)}
                                className="bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer"
                              >
                                <IoEyeOutline className="text-white text-lg " />
                              </div>
                              <div
                                onClick={() => handlePdf(blog.id)}
                                className="bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer"
                              >
                                <LiaFileInvoiceSolid className="text-white text-lg " />
                              </div>
                              <div
                                onClick={() => handleTransaction(blog.id)}
                                className="bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer"
                              >
                                <GrTransaction className="text-white text-lg " />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr className="w-full">
                      <td className="text-black text-center py-4" colSpan={5}>
                        <Empty />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {blogs.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        isVisible={deleteModalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <ImagePreviewModal
        visible={isImagePreVisible}
        onClose={handleImageModalCancel}
        imgSrc={currentImage}
      />
    </div>
  );
}

export default AllOrders;
