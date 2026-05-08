import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Lock, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageType } from '../../types';

interface HistoryProps {
  isLoggedIn: boolean;
  setShowLoginModal: (val: boolean) => void;
  setCurrentPage: (page: PageType) => void;
  historyItems: any[];
}

const History: React.FC<HistoryProps> = ({
  isLoggedIn,
  setShowLoginModal,
  setCurrentPage,
  historyItems,
}) => {
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedHistory = historyItems.slice((historyPage - 1) * itemsPerPage, historyPage * itemsPerPage);
  const totalPages = Math.ceil(historyItems.length / itemsPerPage);

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">历史记录</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="搜索项目或记录..." className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
        </div>
      </div>
      {!isLoggedIn ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">登录后查看历史记录</h3>
          <p className="text-slate-500 mb-6">登录账号，随时随地查看您的比对历史和详细报告。</p>
          <button onClick={() => setShowLoginModal(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            立即登录
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-100">
                    <th className="pb-3 font-medium">项目名称</th>
                    <th className="pb-3 font-medium">项目编号</th>
                    <th className="pb-3 font-medium">检查时间</th>
                    <th className="pb-3 font-medium">文件数</th>
                    <th className="pb-3 font-medium">风险评估</th>
                    <th className="pb-3 font-medium">状态</th>
                    <th className="pb-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedHistory.map(record => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 text-sm font-semibold text-slate-800">{record.name}</td>
                      <td className="py-3 text-sm font-medium text-slate-500">{record.id}</td>
                      <td className="py-3 text-sm text-slate-500">{record.date}</td>
                      <td className="py-3 text-sm text-slate-500">{record.files} 份</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          record.risk === '-' ? 'bg-slate-50 text-slate-500 border border-slate-200' :
                          record.risk === '高风险' ? 'bg-red-50 text-red-700 border border-red-200' :
                          record.risk === '中风险' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {record.risk}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          record.status === '检查中' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          record.status === '已完成' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-slate-50 text-slate-700 border border-slate-200'
                        }`}>
                          {record.status === '检查中' && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button 
                          onClick={() => setCurrentPage('report')}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    共 {historyItems.length} 条记录
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                      disabled={historyPage === 1}
                      className="p-1 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-700 px-2">
                      {historyPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setHistoryPage(p => Math.min(totalPages, p + 1))}
                      disabled={historyPage === totalPages}
                      className="p-1 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default History;
