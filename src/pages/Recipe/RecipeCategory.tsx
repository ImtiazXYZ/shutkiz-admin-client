
import { useEffect, useState } from 'react';
import AdminAuth from '../../components/Admin/AdminAuth';
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Pagination from '../../components/Custom/Pagination';
import { Skeleton } from 'antd';
import DeleteModal from '../../components/Modals/DeleteModal';
import { toast } from 'react-toastify';
import CreateRecipeCategory from './CreateRecipeCategory';
import EditRecipeCategory from './EditRecipeCategory';

function RecipeCategory() {
    const {http} = AdminAuth();
    const [categories,setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading,setIsLoading] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [isEditOpen,setIsEditOpen] = useState(false);
    const [selectedEditId,setSelectedId] = useState(null);

    useEffect(()=>{
        fetchCategories(currentPage);
    },[currentPage])

    const refreshData=()=>{
        fetchCategories(currentPage);
    }

    const fetchCategories=async(page)=>{
        setIsLoading(true); //uncomment this for pagination loading too
          try {
            const res = await http.get(`/admin/recipe-categories?page=${page}`);
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
            await http.delete(`/admin/recipe-categories/${selectedItem}`);
            toast.success("Recipe Category Deleted", { autoClose: 2000 });
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

      //Edit and update operation
      const openEditModal=(id)=>{
        setIsEditOpen(true);
        setSelectedId(id);
      }
      const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedId(null);
      };
    
  return (
    <main>
        
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className='flex justify-between mb-4'>
            <h2 className='font-semibold text-black'>Recipe Category</h2>
            <CreateRecipeCategory refreshData={refreshData}/>
        </div>
      <div className="max-w-full overflow-x-auto">
        {
            isLoading?
            <div className='pb-10'>
                <Skeleton active />
            </div>
            :
            <div>
                <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                        #SL
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Name
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories && categories.length>0?
                        <>
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
                                <div className='flex gap-x-2'>
                                <div className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center'>
                                <FiEdit onClick={()=>openEditModal(category.id)} className='text-white cursor-pointer'/>
                                </div>
                                <div onClick={() => handleDelete(category.id)}
                                    className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center'>
                                <AiOutlineDelete className='text-white text-lg cursor-pointer'/>
                                </div>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </>:
                        
                            <tr className='w-full'>
                                <td></td>
                                <td className='text-black text-center py-4'>No data found</td>
                                <td></td>
                            </tr>
                        
                    }
                </tbody>
                </table>
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}/>
                <DeleteModal 
                isVisible={deleteModalVisible}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}/>
                <EditRecipeCategory
                isOpen={isEditOpen}
                selectedId={selectedEditId}
                onClose={closeEditModal}
                refreshData={refreshData}
                />
            </div>
        }
      </div>
    </div>
    </main>
  )
}

export default RecipeCategory
