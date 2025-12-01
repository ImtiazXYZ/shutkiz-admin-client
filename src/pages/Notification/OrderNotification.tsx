import { useEffect, useState } from 'react';
import AdminAuth from '../../components/Admin/AdminAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../../components/Modals/DeleteModal';
import Pagination from '../../components/Custom/Pagination';
import { Button, Skeleton } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

function OrderNotification() {
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
    },[currentPage]);


    const fetchCategories=async(page)=>{
      setIsLoading(true); //uncomment this for pagination loading too
        try {
          const res = await http.get(`/admin/all-order-notifications?page=${page}`);
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
          await http.delete(`/admin/testimonials/${selectedItem}`);
          toast.success("Testimonial Deleted", { autoClose: 2000 });
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
      navigate(`/testimonials/edit/${id}`);
    }


    const markAsRead=(id)=>{
        setIsLoading(true);
        http.put(`/admin/order-notifications/${id}`)
        .then((res)=>{
          fetchCategories(currentPage);
        })
        .catch((error)=>{
          console.log(error);
        })
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
                <div className='pb-5'>
                    <h2 className='text-gray-800 text-lg font-semibold'>All Order Notifications</h2>
                </div>
                <div className='flex flex-col gap-y-3'> 
                    
                    {
                        categories.map((category,key)=>(
                            <div className="flex justify-between items-center border-b border-stroke px-6 py-4 hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4 border">
                        <div className="flex flex-col gap-1">
                            <Link to={`/orders/details/${category.id}`}>
                            <p className="text-sm text-gray-800 dark:text-white font-semibold">
                            New Order Placed: 
                            <span className="font-normal">
                                Order <span className="font-semibold">#{category.order.uuid}</span> by {category.order.name} for TK {category.order.grandtotal}
                            </span>
                            </p>
                            </Link>
                            <p className="text-xs text-gray-500">
                            {format(new Date(category.created_at), 'dd MMM, yyyy hh:mm a')}
                            </p>
                        </div>

                        <button className="text-xs px-2 py-1 bg-meta-4 text-white rounded-md hover:bg-meta-7" onClick={() => markAsRead(category.id)}>
                            Mark as Read
                        </button>
                    </div>
                        ))
                    }
                    
                </div>

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

export default OrderNotification
