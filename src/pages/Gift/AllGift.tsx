import { useEffect, useState } from 'react';
import AdminAuth from '../../components/Admin/AdminAuth';
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../../components/Modals/DeleteModal';
import Pagination from '../../components/Custom/Pagination';
import { Empty, Skeleton } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
function AllGift() {
    const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading,setIsLoading] = useState(true);

    const {http} = AdminAuth();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const navigate = useNavigate();


    useEffect(()=>{
      fetchBlogs(currentPage);
    },[currentPage]);


    const fetchBlogs=async(page)=>{
      setIsLoading(true); //uncomment this for pagination loading too
        try {
          const res = await http.get(`/admin/gifts?page=${page}`);
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


    const handleDelete = (itemId: number) => {
      setSelectedItem(itemId);
      setDeleteModalVisible(true);
    };
  
    const confirmDelete = async () => {
      if (selectedItem) {
        try {
          await http.delete(`/admin/gifts/${selectedItem}`);
          toast.success("Gift Deleted", { autoClose: 2000 });
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
      navigate(`/gifts/edit/${id}`);
    }
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
            <div className='main'>
                <div className='flex justify-end pb-4'>
                    <StyleProvider hashPriority="high">
                    <NavLink to="/gifts/create">
                    <Button type="primary">Create Gift</Button>
                    </NavLink>
                    </StyleProvider>
                </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                #SL
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Gift Name
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Gift Type
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Image
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
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {key+1}
                  </h5>
                </td>
                
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {blog.product?blog.product.name:blog.name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {blog.is_custom==1?"Custom Gift":'Product Gift'}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <img src={`${baseURL}/${blog.product?blog.product.thumbnail:blog.image}`} alt="" className='w-[80px]' />
                </td>

                

                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className='flex gap-x-2'>
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
          )
        }
      </div>
    </div>
    <DeleteModal 
    isVisible={deleteModalVisible}
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
    />
    
    </div>
  )
}

export default AllGift
