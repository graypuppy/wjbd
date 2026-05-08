import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ChevronRight, ChevronLeft, Loader2, AlertCircle, Wallet, CheckCircle, XCircle } from 'lucide-react';

export type PurchaseViewState = 'main' | 'transfer' | 'records' | 'coupons';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSku: 'month' | 'once';
  setSelectedSku: (sku: 'month' | 'once') => void;
  onPaymentSuccess: () => void;
  initialView?: PurchaseViewState;
}

export default function PurchaseModal({ isOpen, onClose, selectedSku, setSelectedSku, onPaymentSuccess, initialView = 'main' }: PurchaseModalProps) {
  const [view, setView] = useState<PurchaseViewState>(initialView);
  const [showTransferAlert, setShowTransferAlert] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [recordsTab, setRecordsTab] = useState<'recharge' | 'usage'>('recharge');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'paying' | 'failed' | 'success'>('idle');
  const [paymentSimulationResult, setPaymentSimulationResult] = useState<'success' | 'failed'>('success');
  const [rechargePage, setRechargePage] = useState(1);
  const [usagePage, setUsagePage] = useState(1);

  // Reset view when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setShowTransferAlert(false);
      setPaymentMethod('wechat');
      setPaymentStatus('idle');
      setPaymentSimulationResult('success');
    }
  }, [isOpen, initialView]);

  // Handle successful payment delay
  React.useEffect(() => {
    if (paymentStatus === 'paying') {
      const timer = setTimeout(() => {
        setPaymentStatus(paymentSimulationResult);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (paymentStatus === 'success') {
      const timer = setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, paymentSimulationResult, onPaymentSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="bg-white w-[800px] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-medium text-slate-800">
                {view === 'transfer' ? '对公转账' : 
                 view === 'records' ? '我的订单' : 
                 view === 'coupons' ? '优惠券' : '充值'}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 bg-[#F5F8FF] flex-1">
              {view === 'main' && (
                <>
                  {/* Blue Bar */}
                  <div className="bg-[#6B9DF8] text-white px-5 py-3 rounded-t-lg flex justify-between items-center">
                    <span className="font-medium text-lg">请选择购买方案</span>
                    <div className="text-sm opacity-90 flex items-center gap-3">
                      <button onClick={() => setView('transfer')} className="hover:text-white text-white/90 transition-colors">对公转账</button>
                      <span className="text-white/40">|</span>
                      <button onClick={() => setView('records')} className="hover:text-white text-white/90 transition-colors">我的订单</button>
                      <span className="text-white/40">|</span>
                      <button onClick={() => setView('coupons')} className="border border-white/50 px-2 py-0.5 rounded text-white hover:bg-white/20 transition-all shadow-sm">优惠券</button>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-b-lg border border-t-0 border-slate-200 shadow-sm space-y-6">
                    {/* Product Info */}
                    <div className="flex items-start gap-4">
                      <span className="text-slate-600 mt-1 whitespace-nowrap">购买商品：</span>
                      <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-serif text-2xl font-bold font-mono">
                          T
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">多版本文件比对-高级套餐</h4>
                          <p className="text-sm text-slate-500 mt-1">支持资信标、技术标、经济标及底层设备特征的深度比对分析</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* SKUs */}
                    <div className="flex items-start gap-4">
                      <span className="text-slate-600 mt-2 whitespace-nowrap">选择套餐：</span>
                      <div className="flex gap-4 flex-1">
                        {/* Month SKU */}
                        <div 
                          className={`relative flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedSku === 'month' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                          onClick={() => setSelectedSku('month')}
                        >
                          {selectedSku === 'month' && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                          <div className="font-bold text-lg text-slate-800">包月套餐</div>
                          <div className="text-xs text-slate-500 mt-1">30天内不限次比对</div>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-600">¥299</span>
                            <span className="text-sm text-slate-400 line-through">¥399</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">约9.9元/天</div>
                        </div>
                        
                        {/* Once SKU */}
                        <div 
                          className={`relative flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedSku === 'once' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                          onClick={() => setSelectedSku('once')}
                        >
                          {selectedSku === 'once' && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white rounded-bl-lg rounded-tr-sm p-0.5">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                          <div className="font-bold text-lg text-slate-800">单次套餐</div>
                          <div className="text-xs text-slate-500 mt-1">单次项目比对</div>
                          <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-600">¥20</span>
                            <span className="text-sm text-slate-400 line-through">¥30</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">20元/次</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Promo */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 whitespace-nowrap">使用优惠：</span>
                        <select className="border border-slate-300 bg-white rounded px-3 py-1.5 text-sm w-48 outline-none focus:border-blue-500">
                          <option>暂无优惠券</option>
                          <option>新用户专享券 (¥50)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-sm whitespace-nowrap">推广码：</span>
                        <div className="flex items-center">
                          <input type="text" placeholder="选填" className="border border-slate-300 rounded px-3 py-1.5 text-sm w-32 outline-none focus:border-blue-500 focus:z-10 relative bg-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Area */}
                  <div className="bg-white mt-4 p-6 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                    <div className="flex gap-6 items-center">
                      {/* QR Code Area */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-32 h-32 border border-slate-200 rounded p-1 flex items-center justify-center bg-white overflow-hidden">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=simulate_payment_${paymentMethod}`} alt="QR Code" className="w-full h-full opacity-80" />
                        </div>
                        <div className="flex gap-2 w-full">
                          <button onClick={() => { setPaymentSimulationResult('success'); setPaymentStatus('paying'); }} className="text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1.5 rounded transition-colors flex-1 border border-emerald-100 flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" /> 扫码成功
                          </button>
                          <button onClick={() => { setPaymentSimulationResult('failed'); setPaymentStatus('paying'); }} className="text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1.5 rounded transition-colors flex-1 border border-rose-100 flex items-center justify-center gap-1">
                            <XCircle className="w-3 h-3" /> 扫码失败
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-600 flex items-baseline gap-2 mb-3">
                          需支付: <span className="text-3xl font-bold text-[#D97706]">¥{selectedSku === 'month' ? '299' : '20'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setPaymentMethod('wechat')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${paymentMethod === 'wechat' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${paymentMethod === 'wechat' ? 'bg-green-500 text-white' : 'border border-slate-300'}`}>
                              {paymentMethod === 'wechat' && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-sm font-medium">微信支付</span>
                          </button>
                          <button 
                            onClick={() => setPaymentMethod('alipay')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${paymentMethod === 'alipay' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${paymentMethod === 'alipay' ? 'bg-blue-500 text-white' : 'border border-slate-300'}`}>
                              {paymentMethod === 'alipay' && <Check className="w-3 h-3" />}
                            </div>
                            <span className="text-sm font-medium">支付宝</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setView('transfer')} className="text-slate-500 text-sm hover:text-slate-800 flex items-center group">
                      我要对公转账 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-slate-400 text-center">
                    支付即代表你同意 <a href="#" className="text-blue-500 hover:underline">《用户协议》</a> 及 <a href="#" className="text-blue-500 hover:underline">《隐私协议》</a> ，购买后不支持7天无理由退货
                  </div>
                </>
              )}

              {/* Transfer View */}
              {view === 'transfer' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 relative">
                  {showTransferAlert && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                      <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-6 w-96 text-center animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">付款信息已提交</h4>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                          请等待财务核验，欢迎致电商务经理<br/><span className="font-bold text-blue-600 text-base">18906181561</span><br/>获取更多帮助！
                        </p>
                        <button 
                          onClick={() => setShowTransferAlert(false)} 
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          确定
                        </button>
                      </div>
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    对公转账指引
                  </h4>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-100">
                      请通过企业网银或银行柜台汇款至以下账户，并在附言中备注您的账号信息（手机号或邮箱）以便快速核销。转账成功后，可联系客服加快处理。
                    </div>
                    <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col text-sm">
                      <div className="flex px-6 py-3 border-b border-slate-100 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">收款户名</span>
                        <span className="font-bold text-slate-900">安徽国泰新点软件有限公司</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100">
                        <span className="w-32 text-slate-500 font-medium shrink-0">开户银行</span>
                        <span className="font-bold text-slate-900">招商银行合肥分行创新大道支行</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">收款账号</span>
                        <span className="font-bold text-slate-900 font-mono tracking-wider text-blue-700">551907108210701</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100">
                        <span className="w-32 text-slate-500 font-medium shrink-0">开户行行号</span>
                        <span className="text-slate-900 font-mono tracking-wider">308361030033</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">税号</span>
                        <span className="text-slate-900 font-mono tracking-wider">91340100MA2W5D5208</span>
                      </div>
                      <div className="flex px-6 py-3 border-b border-slate-100">
                        <span className="w-32 text-slate-500 font-medium shrink-0">单位地址</span>
                        <span className="text-slate-900 leading-snug">安徽省合肥市高新区黄山路622号高芯光谷601室</span>
                      </div>
                      <div className="flex px-6 py-3 bg-slate-50">
                        <span className="w-32 text-slate-500 font-medium shrink-0">电话</span>
                        <span className="text-slate-900 font-mono tracking-wider">0551-64664620</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                      <button onClick={() => setView('main')} className="px-5 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">返回支付页</button>
                      <button onClick={() => setShowTransferAlert(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">我已付款</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Records View */}
              {view === 'records' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-[600px] overflow-hidden">
                  <div className="flex items-center justify-between mb-6 shrink-0">
                    <h4 className="text-xl font-bold text-slate-800">账号与权益</h4>
                    <button onClick={() => setView('main')} className="px-4 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
                      返回购买
                    </button>
                  </div>
                  
                  <div className="overflow-y-auto pr-2 space-y-6 flex-1 custom-scrollbar">
                    {/* Account Info & Rights */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-slate-200 p-5 rounded-xl bg-slate-50/50">
                        <div className="text-slate-500 mb-2 whitespace-nowrap text-sm font-medium">当前账号</div>
                        <div className="text-2xl font-bold text-slate-800 tracking-tight">13812340000</div>
                      </div>
                      <div className="border border-indigo-100 p-5 rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
                        <div className="text-indigo-600/80 mb-2 whitespace-nowrap text-sm font-medium">当前权益</div>
                        <div className="space-y-1.5">
                          <div className="text-sm flex items-center justify-between">
                            <span className="text-slate-600">包月套餐 (无限次):</span>
                            <span className="font-semibold text-indigo-700">剩余 30 天</span>
                          </div>
                          <div className="text-sm flex items-center justify-between">
                            <span className="text-slate-600">剩余次数:</span>
                            <span className="font-semibold text-indigo-700">剩余 3 次</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tabs for Records */}
                    <div className="pt-2 pb-6">
                       <div className="flex border-b border-slate-200 mb-4">
                         <button 
                           onClick={() => setRecordsTab('recharge')}
                           className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors -mb-px ${recordsTab === 'recharge' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                         >
                           充值记录
                         </button>
                         <button 
                           onClick={() => setRecordsTab('usage')}
                           className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors -mb-px ${recordsTab === 'usage' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                         >
                           消耗记录
                         </button>
                       </div>

                       {recordsTab === 'recharge' && (
                         <div className="flex flex-col gap-4">
                           <div className="border border-slate-200 rounded-lg overflow-hidden shrink-0">
                             <table className="w-full text-left text-sm">
                               <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                 <tr>
                                   <th className="px-5 py-3.5 font-medium">充值时间</th>
                                   <th className="px-5 py-3.5 font-medium">商品说明</th>
                                   <th className="px-5 py-3.5 font-medium">金额</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-05-01 10:23:45</td>
                                   <td className="px-5 py-3.5 text-slate-900 leading-snug">
                                     包月套餐<br/><span className="text-xs text-slate-500 mt-0.5 inline-block">时长: 30天 (无限次)</span>
                                   </td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium">¥299.00</td>
                                 </tr>
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-04-15 14:12:00</td>
                                   <td className="px-5 py-3.5 text-slate-900 leading-snug">
                                     单次套餐<br/><span className="text-xs text-slate-500 mt-0.5 inline-block">包含: 5次</span>
                                   </td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium">¥100.00</td>
                                 </tr>
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-03-01 09:30:00</td>
                                   <td className="px-5 py-3.5 text-slate-900 leading-snug">
                                     单次套餐<br/><span className="text-xs text-slate-500 mt-0.5 inline-block">包含: 1次</span>
                                   </td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium">¥20.00</td>
                                 </tr>
                               </tbody>
                             </table>
                           </div>
                           <div className="flex items-center justify-between text-sm text-slate-500 px-1">
                             <div>共 3 条记录</div>
                             <div className="flex items-center gap-2">
                               <button 
                                 disabled={rechargePage === 1}
                                 onClick={() => setRechargePage(p => Math.max(1, p - 1))}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <ChevronLeft className="w-4 h-4" />
                               </button>
                               <span className="font-medium text-slate-700">{rechargePage} / 1</span>
                               <button 
                                 disabled={rechargePage === 1}
                                 onClick={() => setRechargePage(p => p + 1)}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                             </div>
                           </div>
                         </div>
                       )}

                       {recordsTab === 'usage' && (
                         <div className="flex flex-col gap-4">
                           <div className="border border-slate-200 rounded-lg overflow-hidden shrink-0">
                             <table className="w-full text-left text-sm table-fixed">
                               <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                 <tr>
                                   <th className="px-5 py-3.5 font-medium w-[140px]">比对时间</th>
                                   <th className="px-5 py-3.5 font-medium">项目名称</th>
                                   <th className="px-5 py-3.5 font-medium w-[150px]">消耗扣款</th>
                                 </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-05-02 11:15</td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium truncate" title="某市第一人民医院门诊楼新建工程">某市第一人民医院门诊楼新建工程</td>
                                   <td className="px-5 py-3.5 text-slate-600">
                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 whitespace-nowrap border border-indigo-100">包月畅用 (不扣次)</span>
                                   </td>
                                 </tr>
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-04-16 09:40</td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium truncate" title="《产品需求文档(PRD)》比对">《产品需求文档(PRD)》比对</td>
                                   <td className="px-5 py-3.5 text-slate-600">
                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 whitespace-nowrap border border-orange-100">消耗 1 次</span>
                                   </td>
                                 </tr>
                                 <tr className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">2026-03-05 14:20</td>
                                   <td className="px-5 py-3.5 text-slate-900 font-medium truncate" title="年度采购合同审查记录">年度采购合同审查记录</td>
                                   <td className="px-5 py-3.5 text-slate-600">
                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 whitespace-nowrap border border-orange-100">消耗 1 次</span>
                                   </td>
                                 </tr>
                               </tbody>
                             </table>
                           </div>
                           <div className="flex items-center justify-between text-sm text-slate-500 px-1">
                             <div>共 3 条记录</div>
                             <div className="flex items-center gap-2">
                               <button 
                                 disabled={usagePage === 1}
                                 onClick={() => setUsagePage(p => Math.max(1, p - 1))}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <ChevronLeft className="w-4 h-4" />
                               </button>
                               <span className="font-medium text-slate-700">{usagePage} / 1</span>
                               <button 
                                 disabled={usagePage === 1}
                                 onClick={() => setUsagePage(p => p + 1)}
                                 className="p-1 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 <ChevronRight className="w-4 h-4" />
                               </button>
                             </div>
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              {/* Coupons View */}
              {view === 'coupons' && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-[500px]">
                  <h4 className="text-xl font-bold text-slate-800 mb-6">我的优惠券</h4>
                  <div className="grid gap-4 flex-1 overflow-y-auto content-start">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-red-100 rounded-full opacity-50"></div>
                      <div className="flex items-center gap-5 relative z-10">
                        <div className="text-red-500 font-bold tracking-tighter">
                          <span className="text-2xl mr-0.5">¥</span><span className="text-5xl">50</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-lg">新用户专享券</div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-white/50 px-2 py-0.5 rounded text-red-600">满200元可用</span>
                            <span>仅限包月套餐</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10 pl-6 border-l border-red-200 border-dashed ml-2">
                        <button onClick={() => { setSelectedSku('month'); setView('main'); }} className="bg-red-500 text-white px-5 py-2 rounded-full text-sm hover:bg-red-600 transition-colors font-medium shadow-md shadow-red-200">去使用</button>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-5 flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-5">
                        <div className="text-slate-400 font-bold tracking-tighter">
                          <span className="text-5xl">8</span><span className="text-2xl ml-1">折</span>
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 text-lg">双十一特惠折扣券</div>
                          <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-600">无门槛</span>
                            <span>全场通用</span>
                          </div>
                        </div>
                      </div>
                      <div className="pl-6 border-l border-slate-300 border-dashed ml-2 h-full flex items-center">
                        <span className="text-slate-400 font-medium px-4">已过期</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 border-t border-slate-100 pt-6">
                    <button onClick={() => setView('main')} className="px-5 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium">返回支付</button>
                  </div>
                </div>
              )}

            </div>
            
            {/* Payment Status Overlay */}
            {paymentStatus !== 'idle' && (
              <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-white rounded-2xl p-8 w-[360px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center border border-slate-100 animate-in zoom-in-95 duration-200">
                  {paymentStatus === 'paying' && (
                    <div className="flex flex-col items-center">
                      <div className="mb-6 relative w-32 h-24 flex items-center justify-center">
                        {/* Sparkles */}
                        <div className="absolute top-2 left-2 text-blue-400">✦</div>
                        <div className="absolute top-0 right-4 text-blue-400 scale-150">✦</div>
                        <div className="absolute bottom-4 right-2 text-blue-400">✦</div>
                        
                        {/* Custom Wallet Illustration */}
                        <svg width="100" height="80" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="25" y="25" width="50" height="40" rx="6" fill="#D3E2FB"/>
                          <rect x="65" y="38" width="10" height="14" rx="4" fill="#FFFFFF"/>
                          <circle cx="70" cy="45" r="2" fill="#4F8AF6"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">支付中，请稍候...</h3>
                      <p className="text-sm text-slate-500 text-center">正在等待支付中心确认返回结果</p>
                      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mt-6" />
                    </div>
                  )}

                  {paymentStatus === 'success' && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-6 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">支付成功！</h3>
                      <p className="text-sm text-slate-500">感谢您的购买，权益已自动到账</p>
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-6 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">支付失败</h3>
                      <p className="text-sm text-slate-500 mb-6 text-center">抱歉，支付过程中出现异常<br/>请检查网络或更换支付方式后重试</p>
                      <button 
                        onClick={() => setPaymentStatus('idle')} 
                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl shadow-sm hover:bg-slate-800 transition-colors font-medium"
                      >
                        重新支付
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
