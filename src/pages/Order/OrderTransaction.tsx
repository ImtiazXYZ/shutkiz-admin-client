import { useEffect, useState } from "react";
import AdminAuth from "../../components/Admin/AdminAuth";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const OrderTransaction = () => {
  const baseURL = import.meta.env.VITE_SERVER_BASE_URL;
  const { id } = useParams();
  const { http } = AdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = () => {
    http.get(`/admin/orders/${id}`)
      .then((res) => {
        const orderData = res.data;
        setOrder(orderData);
        setPaymentType(orderData.payment_type);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setIsLoading(false);
      });
  };

  const handleRefund = () => {
    if (!refundAmount) {
      alert("Please enter a refund amount.");
      return;
    }

    const formData = new FormData();
    formData.append('paymentID',order.payment.paymentID);
    formData.append('trxID',order.payment.trxID);
    formData.append('amount',refundAmount);

    console.log(formData);

    http.post('/bkash-refund',formData)
    .then((res)=>{
      //console.log(res);
      setRefundAmount("");
      const transaction = res.data;
      if(transaction.code == 1){
        toast.success("Refund Successfull", { autoClose: 2000 });
      }
      if(transaction.code == 2){
        toast.warning("Already Refunded", { autoClose: 2000 });
      }
      if(transaction.code == 0){
        toast.error("Refund Fail", { autoClose: 2000 });
      }
    })
    .catch((error)=>{
      console.log(error);
    })
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="flex flex-col gap-9 max-w-[700px] mx-auto">
      <div className="rounded-sm border border-stroke bg-white p-4 lg:p-10 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Order Payment Details
        </h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            {paymentType === "cod" && order && (
              <div className="flex flex-col gap-y-3">
                <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Amount: </span> {order.grandtotal}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Order Date:</span> {order.created_at}
              </p>
              </div>
            )}
            {paymentType === "bkash" && order.payment && (
              <div className="flex flex-col gap-y-3">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Amount:</span> {order.payment.amount} Taka
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Payment Account Number:</span> {order.payment.payerAccount}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Transaction Date & Time:</span> {order.payment.paymentExecuteTime}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Payment Id:</span> {order.payment.paymentID}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Transaction Id:</span> {order.payment.trxID}
                </p>
              </div>
            )}
          </div>
        </div>

        {paymentType === "bkash" && (
          <div className="mb-6 pt-5">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Refund Section</h2>
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter refund amount"
                  className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleRefund}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Refund
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTransaction;
