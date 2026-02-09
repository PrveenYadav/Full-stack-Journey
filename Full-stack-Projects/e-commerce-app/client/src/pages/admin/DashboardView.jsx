import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShoppingCart, ArrowUpRight, ArrowDownRight, BarChart3, DollarSign, TrendingUp, Image as ImageIcon, Users, Repeat, UserCheck, Calendar, RefreshCw} from 'lucide-react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext.jsx';

// both for creating pdf of data and then downloading
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
  iconColor = 'text-zinc-600 dark:text-zinc-300',
  iconBg = 'bg-zinc-50 dark:bg-zinc-800',
}) => (
  <Card>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>

      <div
        className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
          trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
        }`}
      >
        {trend === 'up' ? (
          <ArrowUpRight size={14} />
        ) : (
          <ArrowDownRight size={14} />
        )}{' '}
        {change}
      </div>
    </div>

    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
      {title}
    </p>

    <h4 className="text-3xl font-black dark:text-white leading-none">
      {value}
    </h4>
  </Card>
);


export const DashboardView = () => {

  const [range, setRange] = useState(7); // days
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const { backendUrl } = useContext(AdminContext)

 const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/all`);

      const mapped = data.items?.map((p) => {
        const totalStock = p.variants.reduce((t, v) => t + v.stock, 0);
        return {
          id: p._id,
          name: p.name,
          stock: totalStock,
        };
      });

      setProducts(mapped);
    } catch (error) {
      console.log(error.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/orders`, {
        withCredentials: true
      });

      setOrders(data.orders); 

    } catch (err) {
      console.log("Error in fetch orders", err.message)
      // toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const getRange = (days) => {
    const now = new Date(); // now: 8, start: 8 - 7 => 1
    const start = new Date();
    start.setDate(now.getDate() - days);
    return { start, end: now };
  };

  const getPreviousRange = (days) => {
    const now = new Date();
    const end = new Date();
    end.setDate(now.getDate() - days);

    const start = new Date();
    start.setDate(end.getDate() - days);

    return { start, end };
  };

  const filterOrdersByDate = (orders, start, end) => {
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();

    return orders.filter(o => {
      const createdMs = new Date(o.createdAt).getTime();
      return createdMs >= startMs && createdMs <= endMs;
    });
  };

  const percentChange = (current, previous) => {
    if (previous === 0) return current === 0 ? 0 : 100;
    return ((current - previous) / previous) * 100;
  };

  const formatChange = (value) => ({
    change: `${value > 0 ? '+' : ''}${value.toFixed(1)}%`,
    trend: value >= 0 ? 'up' : 'down',
  });

  const getCustomerStats = (ordersArr) => {
    const customers = {};
    ordersArr.forEach(o => {
      const id = o.user?._id;
      customers[id] = (customers[id] || 0) + 1;
    });

    const unique = Object.keys(customers).length;
    const repeat = Object.values(customers).filter(c => c > 1).length;

    return { customers, unique, repeat };
  };


  const stats = useMemo(() => {
    const DAYS = range;
    // const DAYS = 7;

    const { start, end } = getRange(DAYS);
    const { start: prevStart, end: prevEnd } = getPreviousRange(DAYS);

    const currentOrders = filterOrdersByDate(orders, start, end);
    const previousOrders = filterOrdersByDate(orders, prevStart, prevEnd);

    const sum = (arr) => arr.reduce((a, o) => a + o.totalAmount, 0);

    // Revenue
    const currentRevenue = sum(currentOrders);
    const prevRevenue = sum(previousOrders);
    const revenueDelta = formatChange(percentChange(currentRevenue, prevRevenue));

    // Orders
    const currentCount = currentOrders.length;
    const prevCount = previousOrders.length;
    const ordersDelta = formatChange(percentChange(currentCount, prevCount));

    // Averrage
    const currentAOV = currentCount ? currentRevenue / currentCount : 0;
    const prevAOV = prevCount ? prevRevenue / prevCount : 0;
    const aovDelta = formatChange(percentChange(currentAOV, prevAOV));

    // Unique customers
    const getUniqueCount = (orders) => {
      return new Set(
        orders
          .map(o => o.user?._id?.toString()) 
          .filter(Boolean) // Removes undefined, null, or empty strings
      ).size;
    };
    const uniqueCustomers = getUniqueCount(currentOrders);
    const prevUniqueCustomers = getUniqueCount(previousOrders);
    const customersDelta = formatChange(
      percentChange(uniqueCustomers, prevUniqueCustomers)
    );

    const currentCustomerStats = getCustomerStats(currentOrders);
    const prevCustomerStats = getCustomerStats(previousOrders);

    // Repeat rate
    const repeatRate =
      currentCustomerStats.unique
        ? (currentCustomerStats.repeat / currentCustomerStats.unique) * 100
        : 0;

    const prevRepeatRate =
      prevCustomerStats.unique
        ? (prevCustomerStats.repeat / prevCustomerStats.unique) * 100
        : 0;

    const repeatDelta = formatChange(
      percentChange(repeatRate, prevRepeatRate)
    );

    // Revenue per customer
    const revenuePerCustomer =
      currentCustomerStats.unique
        ? currentRevenue / currentCustomerStats.unique
        : 0;

    const prevRevenuePerCustomer =
      prevCustomerStats.unique
        ? prevRevenue / prevCustomerStats.unique
        : 0;

    const rpcDelta = formatChange(
      percentChange(revenuePerCustomer, prevRevenuePerCustomer)
    );

    // Orders per day
    const ordersPerDay = currentCount / DAYS;
    const prevOrdersPerDay = prevCount / DAYS;

    const opdDelta = formatChange(
      percentChange(ordersPerDay, prevOrdersPerDay)
    );

    // Returning revenue
    const firstTimeRevenue = currentOrders
      .filter(o => currentCustomerStats.customers[o.user?._id] === 1)
      .reduce((a, o) => a + o.totalAmount, 0);

    const returningRevenue = currentRevenue - firstTimeRevenue;

    const prevFirstTimeRevenue = previousOrders
      .filter(o => prevCustomerStats.customers[o.user?._id] === 1)
      .reduce((a, o) => a + o.totalAmount, 0);

    const prevReturningRevenue = prevRevenue - prevFirstTimeRevenue;

    const returningDelta = formatChange(
      percentChange(returningRevenue, prevReturningRevenue)
    );

    return [
    {
      title: "Total Revenue",
      value: formatPrice(currentRevenue),
      ...revenueDelta,
      icon: DollarSign,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Total Orders",
      value: currentCount,
      ...ordersDelta,
      icon: ShoppingCart,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Avg. Order Value",
      value: formatPrice(Math.round(currentAOV)),
      ...aovDelta,
      icon: BarChart3,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
    },
    {
      title: "Unique Customers",
      value: uniqueCustomers,
      ...customersDelta,
      icon: Users,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
    },
    {
      title: "Repeat Customer Rate",
      value: `${repeatRate.toFixed(1)}%`,
      ...repeatDelta,
      icon: Repeat,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
    },
    {
      title: "Revenue / Customer",
      value: formatPrice(Math.round(revenuePerCustomer)),
      ...rpcDelta,
      icon: UserCheck,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
    },
    {
      title: "Orders / Day",
      value: ordersPerDay.toFixed(1),
      ...opdDelta,
      icon: Calendar,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
    },
    {
      title: "Returning Revenue",
      value: formatPrice(returningRevenue),
      ...returningDelta,
      icon: RefreshCw,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
  ];

  }, [orders]);


  const startOfUTCDay = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const endOfUTCDay = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

  const salesVelocity = useMemo(() => {
    const buckets = Array.from({ length: range }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (range - i - 1));

      const dayStart = startOfUTCDay(date);
      const dayEnd = endOfUTCDay(date);
      // const dayStart = new Date(date.setHours(0, 0, 0, 0));
      // const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const count = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= dayStart && d <= dayEnd;
      }).length;

      return {
        label: dayStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: count,
      };
    });

    const max = Math.max(...buckets.map(b => b.value), 1);

    return buckets.map(b => ({
      ...b,
      height: (b.value / max) * 100,
    }));
  }, [orders, range]);

  //  console.log("stats: ", stats)


  const downloadDashboardPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text("Admin Dashboard Report", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString()} | Last ${range} days`,
      pageWidth / 2,
      22,
      { align: "center" }
    );

    // KPI Summary (from stats)
    doc.text("Dashboard Summary", 14, 35);

    doc.setFont("helvetica", "normal");

    const formatValueForPDF = (title, value) => {
      // Strip everything except numbers, commas, and dots
      // This removes superscripts, hidden markers, and weird spaces
      const clean = String(value).replace(/[^\d.,]/g, "");

      const moneyMetrics = [
        "Total Revenue",
        "Avg. Order Value",
        "Revenue / Customer",
        "Returning Revenue",
      ];

      if (moneyMetrics.includes(title)) {
        return `Rs. ${clean}`;
      }

      return clean;
    };

    autoTable(doc, {
      startY: 40,
      theme: "grid",
      head: [["Metric", "Value", "Change"]],
      body: stats.map((s) => [
        s.title,
        formatValueForPDF(s.title, s.value),
        s.change,
      ]),
   
      tableWidth: 'wrap', // Shrinks table to content
      margin: { left: 15 }, 
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 69, halign: "right" },
        2: { cellWidth: 30, halign: "right" },
      },
      headStyles: {
        fillColor: [16, 185, 129],
      },
    });

    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    doc.text("Order Status Overview", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Status", "Count"]],
      body: Object.entries(statusCounts),
      theme: "striped",
    });

    // Recent Orders
    doc.text("Recent Orders", 14, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Order ID", "Customer", "Status", "Amount", "Date"]],
      body: orders.slice(0, 10).map((order) => [
        order.orderId,
        order.orderInfo?.name || "N/A",
        order.status,
        `Rs. ${order.totalAmount}`,
        new Date(order.createdAt).toLocaleDateString(),
      ]),
      theme: "grid",
      headStyles: { fillColor: [40, 40, 40] },
    });

    // Footer
    doc.setFontSize(10);
    doc.text(
      "© Admin Dashboard",
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    doc.save(`dashboard_report_last_${range}_days.pdf`);
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Command Center</h2>
          <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest mt-1">Real-time store performance</p>
        </div>
        <div className="flex gap-3">
          <button onClick={downloadDashboardPDF} className="cursor-pointer px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl hover:scale-105 transition-transform">Export Reports</button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats?.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">Sales Velocity</h3>
            <select
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="bg-transparent dark:bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] tracking-widest outline-none border-b-2 border-zinc-200 dark:border-zinc-800 pb-1 cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 1 Month</option>
              <option value={90}>Last 3 Months</option>
              <option value={180}>Last 6 Months</option>
              <option value={365}>Last 1 Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2 overflow-x-scroll">
            {salesVelocity.map((day, i) => (
              <div key={i} className="flex-grow flex flex-col items-center gap-3 group">
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl relative overflow-hidden h-full min-h-[10px]">
                  <div
                    className="absolute bottom-0 w-full bg-black dark:bg-white rounded-2xl transition-all duration-1000 ease-out group-hover:bg-zinc-600"
                    style={{ height: `${day.height}%` }}
                  />
                </div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-8">Inventory Pulse</h3>
          <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {products?.slice(0, 5).map(p => (
              <div key={p._id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h5 className="font-black text-sm dark:text-white uppercase tracking-tight truncate max-w-[120px]">{p.name}</h5>
                  </div>
                  <span className={`text-[10px] font-black ${p.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>{p.stock} units</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${p.stock < 10 ? 'bg-rose-500' : 'bg-black dark:bg-white'} transition-all duration-1000`} style={{ width: `${Math.min(100, (p.stock/50)*100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};