
import { useEffect, useState } from 'react';
import AdminAuth from '../../components/Admin/AdminAuth';
import CreateStaff from './CreateStaff';
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import Pagination from '../../components/Custom/Pagination';
import { Skeleton } from 'antd';
import CopyToClipboard from '../../components/Custom/CopyToClipboard';
import DeleteModal from '../../components/Modals/DeleteModal';
import { toast } from 'react-toastify';
import EditStaff from './EditStaff';



function AllStaff() {
    const {http} = AdminAuth();
    const [staffs,setStaffs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading,setIsLoading] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [isEditOpen,setIsEditOpen] = useState(false);
    const [selectedEditId,setSelectedId] = useState(null);

    useEffect(()=>{
        fetchStaffs(currentPage);
    },[currentPage])

    const refreshData=()=>{
        fetchStaffs(currentPage);
    }

    const fetchStaffs=async(page)=>{
        setIsLoading(true); //uncomment this for pagination loading too
          try {
            const res = await http.get(`/admin/staffs?page=${page}`);
            setStaffs(res.data.data);
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
            await http.delete(`/admin/staffs/${selectedItem}`);
            toast.success("Staff Deleted", { autoClose: 2000 });
            const remainingItemsOnPage = staffs.length - 1;
            if (remainingItemsOnPage === 0 && currentPage > 1) {
              setCurrentPage((prevPage) => prevPage - 1);
            } else {
                fetchStaffs(currentPage);
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
        <div className='flex justify-end mb-4'>
            <CreateStaff refreshData={refreshData}/>
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
                        Role
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Name
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Email
                    </th>
                    {/* <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                        Password
                    </th> */}
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Actions
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {staffs.map((staff, key) => (
                    <tr key={key}>
                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <h5 className="font-medium text-black dark:text-white">
                            {key+1}
                        </h5>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {staff.role}
                        </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {staff.name}
                        </p>
                        </td>
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className='flex gap-x-1'>
                        <p className="text-black dark:text-white">
                            {staff.email}
                        </p>
                        <CopyToClipboard value={staff.email}/>
                        </div>
                        </td>
                        {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                            {staff.email}
                        </p>
                        </td> */}
                        
                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className='flex gap-x-2'>
                        <div className='bg-[#1C2434] w-[35px] h-[35px] rounded-full flex justify-center items-center'>
                        <FiEdit onClick={()=>openEditModal(staff.id)} className='text-white cursor-pointer'/>
                        </div>
                        <div onClick={() => handleDelete(staff.id)}
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
                onPageChange={handlePageChange}/>
                <DeleteModal 
                isVisible={deleteModalVisible}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}/>
                <EditStaff
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

export default AllStaff
