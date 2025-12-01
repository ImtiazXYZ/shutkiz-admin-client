import { useEffect, useRef, useState } from 'react';
import AdminAuth from '../../components/Admin/AdminAuth';
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../../components/Modals/DeleteModal';
import Pagination from '../../components/Custom/Pagination';
import { Empty, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline } from "react-icons/io5";
import ImagePreviewModal from '../../components/Modals/ImagePreviewModal';
import { Select,Badge } from 'antd';


function AllProduct() {
    const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading,setIsLoading] = useState(true);

    const {http} = AdminAuth();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const navigate = useNavigate();

    const [isImagePreVisible, setIsImagePreVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);


    const tableRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const scrollablePreference = localStorage.getItem('scrollableTable');
        if (scrollablePreference) {
          setIsScrollable(JSON.parse(scrollablePreference));
        }
        fetchBlogs(currentPage); // Fetch blogs based on current page
      }, [currentPage]);


    const fetchBlogs=async(page)=>{
      setIsLoading(true); //uncomment this for pagination loading too
        try {
          const res = await http.get(`/admin/products?page=${page}`);
          
          setBlogs(res.data.data);
          setTotalPages(res.data.last_page);
        } catch (error) {
          console.log(error);
        }finally{
          setIsLoading(false);
        }
    }

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
      };


    const handleDelete = (itemId: number) => {
      setSelectedItem(itemId);
      setDeleteModalVisible(true);
    };
  
    const confirmDelete = async () => {
      if (selectedItem) {
        try {
          await http.delete(`/admin/products/${selectedItem}`);
          toast.success("Product Deleted", { autoClose: 2000 });
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

    const handleEdit=(id)=>{
      navigate(`/product/edit/${id}`);
    }
    const handleDetails=(id)=>{
      navigate(`/product/details/${id}`);
    }

    const showImageModal = (imgSrc) => {
        setCurrentImage(imgSrc);
        setIsImagePreVisible(true);
      };
    
      const handleImageModalCancel = () => {
        setIsImagePreVisible(false);
        setCurrentImage(null);
      };




      const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX - tableRef.current.getBoundingClientRect().left);
        setScrollLeft(tableRef.current.scrollLeft);
      };
    
      const handleMouseMove = (e) => {
        if (!isDragging || !isScrollable) return;
        e.preventDefault();
        const x = e.clientX - tableRef.current.getBoundingClientRect().left;
        const walk = (x - startX) * 2; // Adjust scroll speed
        tableRef.current.scrollLeft = scrollLeft - walk;
      };
    
      const handleMouseUp = () => {
        setIsDragging(false);
      };
    
      const handleDropdownChange = (value) => {
        setIsScrollable(value === 1); // Set scrollable based on selected value
        localStorage.setItem('scrollableTable', JSON.stringify(value === 1));
      };

      
  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        {isLoading&&(
          <div className='pb-10'>
            <Skeleton active />
          </div>
        )}
        {
          !isLoading&&(
            <div >
                <div className='pb-5 flex justify-end'>
                <Select
                        defaultValue="Normal"
                        style={{ width: 120 }}
                        onChange={handleDropdownChange}
                        options={[
                            { value: 0, label: 'Normal' },
                            { value: 1, label: 'Scroll' },
                            
                        ]}
                        />
                </div>
                
                <div ref={tableRef}
                className={` ${isScrollable ? 'overflow-x-auto' : ''}`}
                onMouseDown={isScrollable ? handleMouseDown : null}
                onMouseMove={isScrollable ? handleMouseMove : null}
                onMouseUp={isScrollable ? handleMouseUp : null}
                onMouseLeave={isScrollable ? handleMouseUp : null} // Stop dragging if mouse leaves
                style={{
                    cursor: isScrollable ? (isDragging ? 'grabbing' : 'grab') : 'default',
                whiteSpace: 'nowrap',
                }}>
                
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white ">
                        #SL
                      </th>
                      <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                        Status
                      </th>
                      <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                        Name
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Thumbnail
                      </th>
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white text-center">
                        Pricing
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      blogs.length>0?
                      <>
                      {blogs.map((blog, key) => (
                      <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4  dark:border-strokedark ">
                          <h5 className="font-medium text-black dark:text-white text-center">
                            {key+1}
                          </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <Select
                        defaultValue="Active"
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: 1, label: 'Active' },
                            { value: 0, label: 'Inactive' },
                            
                        ]}
                        />
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <p className="text-black dark:text-white relative">
                            <span className='relative'>
                            {blog.name}
                            <div className='absolute -top-3 -right-2'>
                            <Badge status="processing" color='green' />
                            </div>
                            </span>
                            
                          </p>
                        </td>
        
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="relative group w-[80px] h-[80px] cursor-pointer">
                          <img
                            src={`${baseURL}/${blog.thumbnail}`}
                            alt="Thumbnail"
                            className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
                          />
                          <div onClick={()=>showImageModal(`${baseURL}/${blog.thumbnail}`)}
                            className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            
                          >
                            <div className='w-[30px] h-[30px] rounded-full bg-black flex justify-center items-center'>
                            <IoEyeOutline style={{ fontSize: "18px", color: "white" }} />
                            </div>
                          </div>
                        </div>
                        </td>
        
        
        
        
        
                        <td className="border-b border-[#eee] pt-2 px-4 dark:border-strokedark">
                          <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Weight
                      </th>
                      <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        Stock
                      </th>
                      <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Regular Price
                      </th>
                      <th className="min-w-[130px] py-4 px-4 font-medium text-black dark:text-white">
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
                        </td>
                        
        
                        
        
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                          <div className='flex gap-x-2'>
                          <div onClick={() => handleDetails(blog.id)}
                            className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer'>
                          <IoEyeOutline className='text-white text-lg '/>
                          </div>
                          <div onClick={()=>handleEdit(blog.id)} className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer'>
                          <FiEdit className='text-white '/>
                          </div>
                          <div onClick={() => handleDelete(blog.id)}
                            className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer'>
                          <AiOutlineDelete className='text-white text-lg '/>
                          </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                      </>:
                      <tr className='w-full'>
                      
                      <td className='text-black text-center py-4' colSpan={5}><Empty/></td>
                      
                  </tr>
                    }
                  </tbody>
                </table>
                {
                    blogs.length > 0 &&
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}/>
                    }
                </div>
            </div>
          )
        }
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
  )
}

export default AllProduct
