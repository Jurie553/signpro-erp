import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Briefcase, FileText, Clock, CheckCircle2, AlertCircle, Users, Box, Share2, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useCollection } from '../lib/firestoreService';
import { Quote, Job, Client, Product } from '../types';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: quotes, loading: quotesLoading } = useCollection<Quote>('quotes');
  const { data: jobs, loading: jobsLoading } = useCollection<Job>('jobs');
  const { data: clients, loading: clientsLoading } = useCollection<Client>('clients');
  const { data: products, loading: productsLoading } = useCollection<Product>('products');

  const loading = quotesLoading || jobsLoading || clientsLoading || productsLoading;

  const mtdRevenue = quotes
    .filter(q => q.status === 'Accepted' && new Date(q.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, q) => sum + q.subtotal, 0);

  const mtdProfit = quotes
    .filter(q => q.status === 'Accepted' && new Date(q.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, q) => sum + q.profit, 0);

  const activeJobsCount = jobs.filter(j => j.stage !== 'Delivered' && j.stage !== 'Cancelled').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'Sent' || q.status === 'Viewed' || q.status === 'Draft').length;

  const chartData = [
    { name: 'Mon', revenue: 4200 },
    { name: 'Tue', revenue: 3800 },
    { name: 'Wed', revenue: 5600 },
    { name: 'Thu', revenue: 8400 },
    { name: 'Fri', revenue: 6200 },
    { name: 'Sat', revenue: 2500 },
    { name: 'Sun', revenue: 1200 },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Studio Pulse</h2>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Live production metrics</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm self-start md:self-auto">
          <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-2">System Active</span>
        </div>
      </header>

      {/* Guided Workflow Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Core Execution Workflow</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <WorkflowStep 
            id={1}
            title="Clients"
            desc="Partner network"
            icon={Users}
            link="/clients"
            isComplete={clients.length > 0}
            loading={clientsLoading}
            navigate={navigate}
          />
          <WorkflowStep 
            id={2}
            title="Products"
            desc="Unit catalog"
            icon={Box}
            link="/products"
            isComplete={products.length > 0}
            loading={productsLoading}
            navigate={navigate}
          />
          <WorkflowStep 
            id={3}
            title="Quoting"
            desc="Cost estimation"
            icon={FileText}
            link="/quotes"
            isComplete={quotes.length > 0}
            loading={quotesLoading}
            navigate={navigate}
          />
          <WorkflowStep 
            id={4}
            title="Production"
            desc="Output flow"
            icon={Share2}
            link="/jobs"
            isComplete={jobs.length > 0}
            loading={jobsLoading}
            navigate={navigate}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Revenue MTD" value={loading ? '...' : `R ${mtdRevenue.toLocaleString()}`} icon={DollarSign} trend="+12.5%" link="/reports" navigate={navigate} />
        <StatCard label="Net Profit" value={loading ? '...' : `R ${mtdProfit.toLocaleString()}`} icon={TrendingUp} trend="+8.2%" link="/reports" navigate={navigate} />
        <StatCard label="Active Fleet" value={loading ? '...' : activeJobsCount.toString()} icon={Briefcase} trend="0" link="/jobs" navigate={navigate} />
        <StatCard label="Quote Pipeline" value={loading ? '...' : pendingQuotesCount.toString()} icon={FileText} trend="-2" link="/quotes" navigate={navigate} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Performance Metrics</h3>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Live</span>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={2} 
                  fill="#dbeafe" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex-1">
            <h3 className="text-sm font-bold text-slate-900 mb-6">Activity Log</h3>
            
            <div className="space-y-4">
              {loading ? (
                 <div className="flex items-center justify-center py-6 text-slate-400">Loading...</div>
              ) : (
                quotes.slice(0, 4).map((quote) => (
                    <div key={quote.id} className="flex gap-3 text-sm">
                        <div className="pt-1"><div className="w-2 h-2 rounded-full bg-blue-500" /></div>
                        <div>
                            <p className="text-slate-900 font-medium">Quote {quote.status}</p>
                            <p className="text-slate-500 text-[10px]">{quote.quoteNumber}</p>
                        </div>
                    </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({ title, desc, icon: Icon, link, isComplete, navigate }: any) {
  return (
    <div 
      onClick={() => navigate(link)}
      className="group cursor-pointer bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
          <Icon size={20} />
        </div>
        {isComplete && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, link, navigate }: any) {
  return (
    <div 
      onClick={() => link && navigate(link)}
      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm cursor-pointer hover:border-blue-300 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-400"><Icon size={20} /></div>
        <div className={cn("text-[10px] font-semibold px-2 py-0.5 rounded", trend?.startsWith('+') ? "text-emerald-700 bg-emerald-50" : "text-slate-600 bg-slate-100")}>
          {trend}
        </div>
      </div>
      
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
    </div>
  );
}
