import axios from 'axios';
import { UserPlus, Mail, Phone, Image as ImageIcon, Package, Trash2} from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext.jsx';
import { toast } from 'react-toastify';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const formatPrice = (p) => {
  if (p === undefined || p === null) return "₹0";
  return `₹${p.toLocaleString('en-IN')}`;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, status }) => {
  const styles = {
    'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Shipped': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Processing': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Pending': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    'In Stock': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Low Stock': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Out of Stock': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    'Active': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Inactive': 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${styles[status] || styles['Pending']}`}>
      {children || status}
    </span>
  );
};


export const CustomersView = () => {

  const { backendUrl } = useContext(AdminContext)
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [customers, setCustomers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState('');

  // customers info from backend
  const fetchCustomers = async () => {
    setLoadingCustomers(true)

    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.get(backendUrl + '/api/admin/customers')
      setCustomers(data.customers)
    } catch (error) {
      console.log(error.message || "Error in fetching customers data")
    } finally {
      setLoadingCustomers(false)
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, [])


  const handleDeleteUser = async (id) => {
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/admin/all-users/${id}`)

      if (data.success) {
        toast.success(data.message)
        fetchCustomers();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message || "Error in deleting Customer")
    }
  }

  const openDeleteModalUser = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    handleDeleteUser(userToDelete)
    setIsDeleteModalOpen(false);
  };


  // for downloading customers data
  const downloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Name", "Email", "Total Orders", "Total Spent(Rs.)", "Status", "Join Date"];
    const tableRows = [];

    customers.forEach(customer => {
      const customerData = [
        // customer._id,
        customer.name,
        customer.email,
        customer.totalOrders,
        customer.totalSpent,
        customer.totalOrders <= 1 ? 'Inactive' : 'Active', // customer status
        new Date(customer.joinDate).toLocaleDateString()
      ];
      tableRows.push(customerData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.text("Customer List", 14, 15);
    doc.save("customers_report.pdf");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Customers</h2>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">Identity & loyalty management</p>
        </div>
        <button onClick={downloadPDF} className="flex items-center gap-3 cursor-pointer px-8 py-4 bg-zinc-900 text-white dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl"><UserPlus size={18}/> Customers Report</button>
      </header>

      <Card className="p-0 overflow-hidden border-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
              <tr className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <th className="text-left px-8 py-5">Client Name</th>
                <th className="text-left px-8 py-5">Total Orders</th>
                <th className="text-left px-8 py-5">Total Spent</th>
                <th className="text-left px-8 py-5">Status</th>
                <th className="text-left px-8 py-5">Join Date</th>
                <th className="text-right px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {customers?.map(c => (
                <tr key={c._id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-zinc-500">{c.name.charAt(0)}</div>
                      <div>
                        <p className="font-black text-sm dark:text-white uppercase tracking-tight">{c.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 font-bold text-sm dark:text-white"><Package size={14} className="text-zinc-400"/> {c.totalOrders} <span className="text-[10px] text-zinc-400 uppercase font-black">Orders</span></div>
                  </td>
                  <td className="px-8 py-5 font-black text-sm dark:text-white">{formatPrice(c.totalSpent)}</td>
                  <td className="px-8 py-5"><Badge status={c.totalOrders <= 1 ? 'Inactive' : 'Active'} /></td>
                  
                  <td className="px-8 py-5 text-right dark:text-white whitespace-nowrap">
                    {c.joinDate &&
                      new Date(c.joinDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button onClick={() => openDeleteModalUser(c._id)} className="p-2 text-rose-500 md:text-zinc-400 md:hover:text-rose-500 transition-colors cursor-pointer"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* delete Customer model */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-80 shadow-xl transform transition-all">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Customer?</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              This action cannot be undone. Are you sure you want to delete this customer?
            </p>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteUser}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
