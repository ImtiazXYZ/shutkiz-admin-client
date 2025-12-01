import { useEffect, useState } from 'react';
import AdminAuth from '../../components/Admin/AdminAuth';
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../../components/Modals/DeleteModal';
import Pagination from '../../components/Custom/Pagination';
import { Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';


function AllCategory() {
    const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading,setIsLoading] = useState(true);

    const {http} = AdminAuth();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(()=>{
      fetchCategories(currentPage);
      getUpdateMsg();
    },[currentPage]);

    const getUpdateMsg=()=>{
      const message = localStorage.getItem('updateAlert');
      if (message) {
          toast.success("Category Updated", { autoClose: 2000 });
          localStorage.removeItem('updateAlert');
      }
    }

    const fetchCategories=async(page)=>{
      setIsLoading(true); //uncomment this for pagination loading too
        try {
          const res = await http.get(`/admin/categories?page=${page}`);
          setCategories(res.data.data);
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
          await http.delete(`/admin/categories/${selectedItem}`);
          toast.success("Category Deleted", { autoClose: 2000 });
          const remainingItemsOnPage = categories.length - 1;
          if (remainingItemsOnPage === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            fetchCategories(currentPage);
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
      navigate(`/categories/edit/${id}`);
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
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                #SL
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Category
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Thumbnail
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Banner
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {key+1}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {category.name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <img src={`${baseURL}/${category.thumbnail}`} alt="" className='w-[80px]' />
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <img src={`${baseURL}/${category.banner}`} alt="" className='w-[80px]' />
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className='flex gap-x-2'>
                  <div onClick={()=>handleEdit(category.id)} className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center'>
                  <FiEdit className='text-white cursor-pointer'/>
                  </div>
                  <div onClick={() => handleDelete(category.id)}
                    className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center'>
                  <AiOutlineDelete className='text-white text-lg cursor-pointer'/>
                  </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
         currentPage={currentPage}
         totalPages={totalPages}
         onPageChange={handlePageChange}
         />
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

export default AllCategory
