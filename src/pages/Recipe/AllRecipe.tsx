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
import { IoEyeOutline } from "react-icons/io5";
import ImagePreviewModal from '../../components/Modals/ImagePreviewModal';

function AllRecipe() {
    const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading,setIsLoading] = useState(true);

    const {http} = AdminAuth();
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const navigate = useNavigate();

    const [isImagePreVisible, setIsImagePreVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(()=>{
      fetchRecipes(currentPage);
      getUpdateMsg();
    },[currentPage]);

    const getUpdateMsg=()=>{
      const message = localStorage.getItem('updateAlert');
      if (message) {
          toast.success("Recipe Updated", { autoClose: 2000 });
          localStorage.removeItem('updateAlert');
      }
    }

    const fetchRecipes=async(page)=>{
      setIsLoading(true); //uncomment this for pagination loading too
        try {
          const res = await http.get(`/admin/recipes?page=${page}`);
          setRecipes(res.data.data);
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
          await http.delete(`/admin/recipes/${selectedItem}`);
          toast.success("Category Deleted", { autoClose: 2000 });
          const remainingItemsOnPage = recipes.length - 1;
          if (remainingItemsOnPage === 0 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
          } else {
            fetchRecipes(currentPage);
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
      navigate(`/recipe/edit/${id}`);
    }
    const handleDetails=(id)=>{
      navigate(`/recipe/details/${id}`);
    }

    const showImageModal = (imgSrc) => {
        setCurrentImage(imgSrc);
        setIsImagePreVisible(true);
      };
    
      const handleImageModalCancel = () => {
        setIsImagePreVisible(false);
        setCurrentImage(null);
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
            <div className='main'>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                #SL
              </th>
              <th className="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white">
                Title
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
            {recipes.map((recipe, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {key+1}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {recipe.title}
                  </p>
                </td>

                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="relative group w-[80px] h-[80px] cursor-pointer">
                  <img
                    src={`${baseURL}/${recipe.thumbnail}`}
                    alt="Thumbnail"
                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
                  />
                  <div onClick={()=>showImageModal(`${baseURL}/${recipe.thumbnail}`)}
                    className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    
                  >
                    <div className='w-[30px] h-[30px] rounded-full bg-black flex justify-center items-center'>
                    <IoEyeOutline style={{ fontSize: "18px", color: "white" }} />
                    </div>
                  </div>
                </div>
                </td>

                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="relative group w-[80px] h-[80px] cursor-pointer">
                  <img
                    src={`${baseURL}/${recipe.banner}`}
                    alt="Thumbnail"
                    className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
                  />
                  <div onClick={()=>showImageModal(`${baseURL}/${recipe.banner}`)}
                    className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    
                  >
                    <div className='w-[30px] h-[30px] rounded-full bg-black flex justify-center items-center'>
                    <IoEyeOutline style={{ fontSize: "18px", color: "white" }} />
                    </div>
                  </div>
                </div>
                </td>

                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className='flex gap-x-2'>
                  <div onClick={() => handleDetails(recipe.id)}
                    className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer'>
                  <IoEyeOutline className='text-white text-lg '/>
                  </div>
                  <div onClick={()=>handleEdit(recipe.id)} className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer'>
                  <FiEdit className='text-white '/>
                  </div>
                  <div onClick={() => handleDelete(recipe.id)}
                    className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center cursor-pointer'>
                  <AiOutlineDelete className='text-white text-lg '/>
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
    <ImagePreviewModal
        visible={isImagePreVisible}
        onClose={handleImageModalCancel}
        imgSrc={currentImage}
      />
    
    </div>
  )
}

export default AllRecipe
