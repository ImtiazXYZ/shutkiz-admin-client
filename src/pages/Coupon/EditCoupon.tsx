import { useEffect, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Skeleton } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { useNavigate, useParams } from "react-router-dom";
import CouponSelect from "../../components/Input/CouponSelect";
import CustomDatePicker from "../../components/Custom/CustomDatePicker";

function EditCoupon() {
  const { http } = AdminAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [create, setCreate] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [reset, setReset] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [coupon, setCoupon] = useState({});
  const [editedData, setEditedData] = useState({
    code: "",
    description: "",
    amount: "",
    expiryDate: ""
  });

  const categories = [
    { id: "Flat", name: "Flat" },
    { id: "Percentage", name: "Percentage" }
  ];

  useEffect(() => {
    getCouponData();
  }, []);

  const getCouponData = async () => {
    try {
      const res = await http.get(`/admin/coupons/${id}/edit`);
      setEditedData({
        code: res.data.code || "",
        description: res.data.description || "",
        amount: res.data.amount || "",
        expiryDate: res.data.expiry_date || ""
      });
      setCoupon(res.data);
    } catch (error) {
      console.error("Failed to fetch coupon data", error);
      toast.error("Failed to fetch coupon data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryId = (id) => {
    setCategoryId(id);
  };

  const submitHandler = async(e) => {
    e.preventDefault();
    setCreate(true);
    const formData = new FormData();
    formData.append('type', coupon.type);
    formData.append('code', editedData.code);
    formData.append('description', editedData.description);
    formData.append('amount', editedData.amount);
    formData.append('expiry_date', editedData.expiryDate);
    formData.append('_method', 'PUT');

    try {
    await http.post(`/admin/coupons/${id}`, formData);
      toast.success("Coupon updated successfully", { autoClose: 2000 });
      navigate('/coupons/all');
      resetForm();
    } catch (error) {
      setCreate(false);
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (axios.isAxiosError(error) && error.response && error.response.data) {
      setErrors(error.response.data.errors || {});
    }
  };

  const resetForm = () => {
    setCreate(false);
    setEditedData({ code: "", description: "", amount: "", expiryDate: "" });
    setReset(true);
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const code = Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    setEditedData({ ...editedData, code });
  };

  return (
    <main>
      <div className="flex flex-col gap-9 max-w-[600px] mx-auto">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Edit Coupon</h3>
          </div>
          {
            isLoading?<div className="p-10"><Skeleton paragraph={{ rows: 8 }}/></div>:
            <form onSubmit={submitHandler}>
            <div className="p-6.5">
              {/* Coupon Code Input */}
              <div className="mb-4.5">
                <div className="flex gap-x-3">
                  <label className="mb-2.5 block text-black dark:text-white">Coupon Code</label>
                  <StyleProvider hashPriority="high">
                    <Button type="primary" size="small" onClick={generateCouponCode}>Generate</Button>
                  </StyleProvider>
                </div>
                <input
                  type="text"
                  value={editedData.code}
                  onChange={(e) => setEditedData({ ...editedData, code: e.target.value })}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors.code && <div className="text-red-500 mt-1">{errors.code.join(", ")}</div>}
              </div>

              {/* Coupon Description Input */}
              <div>
                <label className="mb-3 block text-black dark:text-white">Coupon Description</label>
                <textarea
                  rows={3}
                  value={editedData.description}
                  onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                  placeholder="Optional"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              {/* Discount Type and Amount Inputs */}
              <div className="mb-4.5 flex justify-between pt-3 gap-x-3">
                <div className="w-full">
                  <CouponSelect label="Discount Type" categories={categories} handleCategoryId={handleCategoryId} reset={reset} selectedCoupon={coupon.type} />
                </div>
                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">Coupon Amount</label>
                  <input
                    type="text"
                    value={editedData.amount}
                    onChange={(e) => setEditedData({ ...editedData, amount: e.target.value })}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  {errors.amount && <div className="text-red-500 mt-1">{errors.amount.join(", ")}</div>}
                </div>
              </div>

              {/* Expiry Date Picker */}
              <div className="mb-4.5">
                <CustomDatePicker title="Expiry Date" expiryDate={editedData.expiryDate} setExpiryDate={(date) => setEditedData({ ...editedData, expiryDate: date })} />
              </div>

              {/* Submit Button */}
              <button type="submit" className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mt-10">
                {create ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
          }
        </div>
      </div>
    </main>
  );
}

export default EditCoupon;
