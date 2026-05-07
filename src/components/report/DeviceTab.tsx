import React from 'react';
import { Fingerprint, AlertTriangle, FileText, File as FileIcon, FileType } from 'lucide-react';
import { FileItem } from '../../types';

interface DeviceTabProps {
  isExporting: boolean;
  comparingFiles: FileItem[];
  ALL_DEVICE_ITEMS: string[];
  mockDeviceMatrixData: any[];
  mockTechDetails: any;
  isDeviceValueDuplicate: (colIdx: number, val: string) => boolean;
  getDeviceDuplicateDetails: (colIdx: number, val: string, rowId: string) => string[];
}

const DeviceTab: React.FC<DeviceTabProps> = ({
  isExporting,
  comparingFiles,
  ALL_DEVICE_ITEMS,
  mockDeviceMatrixData,
  mockTechDetails,
  isDeviceValueDuplicate,
  getDeviceDuplicateDetails
}) => {
  const getPropDuplicates = (currentBidderId: string, propLabel: string, propValue: string) => {
    const duplicates: string[] = [];
    mockTechDetails.unencryptedDocProps.bidders.forEach((bidder: any) => {
      if (bidder.id === currentBidderId) return;
      bidder.files.forEach((file: any) => {
        const matchingProp = file.props.find((p: any) => p.label === propLabel && p.value === propValue);
        if (matchingProp) {
          duplicates.push(`${bidder.name} > ${file.name}`);
        }
      });
    });
    return duplicates;
  };

  return (
    <div className="space-y-8">
      {isExporting && <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 mt-8">文件设备特征比对</h2>}
      
      {/* Section 1: Device Feature Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-xl">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Fingerprint className="w-5 h-5 text-purple-500"/> 设备特征比对矩阵 (非加密投标文件)</h3>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm inline-block"></span> 标红代表存在重复风险 (多份文件硬件特征一致)
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                <th className="py-4 px-5 font-bold border-r border-slate-200 w-64 bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">文件名称 \ 检测点</th>
                {ALL_DEVICE_ITEMS.map(item => (
                  <th key={item} className="py-4 px-5 font-bold border-r border-slate-200 whitespace-nowrap bg-slate-50">{item}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockDeviceMatrixData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-5 font-medium text-slate-800 border-r border-slate-200 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="truncate w-52" title={row.name}>{row.name}</div>
                  </td>
                  {row.values.map((val: string, colIdx: number) => {
                    const isDup = isDeviceValueDuplicate(colIdx, val);
                    const duplicates = isDup ? getDeviceDuplicateDetails(colIdx, val, row.id) : [];
                    return (
                      <td 
                        key={colIdx} 
                        className={`py-4 px-5 text-sm border-r border-slate-200 relative group transition-colors ${isDup ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-600'}`}
                      >
                        {isDup && <AlertTriangle className="w-4 h-4 inline mr-1.5 text-red-500" />}
                        <span className="font-mono">{val}</span>
                        {isDup && (
                          <div className="absolute z-50 hidden group-hover:block bg-slate-800 text-white text-[10px] rounded p-2 shadow-lg -top-10 left-0 whitespace-nowrap">
                            <div className="font-bold mb-1">硬件特征一致</div>
                            <div>涉及文件:</div>
                            <div className="text-slate-300 mt-0.5">{duplicates.join(', ')}</div>
                            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-slate-800 transform rotate-45"></div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Document Properties Matrix (Moved from TechTab) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500"/> 
              文件属性查重 (非加密投标文件模式)
            </h3>
          </div>
          <span className="text-xs text-slate-500 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
            提取内部PDF/Word属性
          </span>
        </div>
        
        <div className="p-4 bg-slate-50/50">
            <div className="space-y-6">
              {mockTechDetails.unencryptedDocProps.bidders.map((bidder: any) => (
                <div key={bidder.id} className="bg-white border border-slate-200 rounded-lg shadow-sm">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between rounded-t-lg">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-slate-500" />
                      {bidder.name}
                    </h4>
                    <span className="text-xs text-slate-500">包含 {bidder.files.length} 个内部文件</span>
                  </div>
                  
                  <div className="overflow-visible">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500">
                          <th className="py-2 px-4 font-medium w-64">内部文件</th>
                          {bidder.files[0]?.props.map((p: any, i: number) => (
                            <th key={i} className="py-2 px-4 font-medium border-l border-slate-100">{p.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bidder.files.map((file: any, fIdx: number) => (
                          <tr key={fIdx} className="hover:bg-slate-50">
                            <td className="py-3 px-4 text-sm font-medium text-slate-700 flex items-center gap-2">
                              <FileType className={`w-4 h-4 ${file.name.endsWith('.pdf') ? 'text-red-500' : 'text-blue-500'}`} />
                              {file.name}
                            </td>
                            {file.props.map((prop: any, pIdx: number) => {
                              // Use dynamic calculation instead of hardcoded isDuplicate
                              const duplicates = getPropDuplicates(bidder.id, prop.label, prop.value);
                              const isDup = duplicates.length > 0;
                              
                              return (
                                <td 
                                  key={pIdx} 
                                  className={`py-3 px-4 text-sm border-l border-slate-100 relative group ${isDup ? 'bg-red-50/50 text-red-700 font-medium cursor-help hover:bg-red-100/50 transition-colors' : 'text-slate-600'}`}
                                >
                                  {isDup && <AlertTriangle className="w-3 h-3 inline mr-1 text-red-500" />}
                                  {prop.value}
                                  
                                  {isDup && (
                                    <div 
                                      className="absolute z-[100] hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs whitespace-normal pointer-events-none" 
                                    >
                                      <div className={"font-bold mb-2 flex items-center gap-1.5 border-b border-slate-700 pb-2"}>
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400"/> 
                                        <span>发现相同属性值</span>
                                      </div>
                                      <div className="text-slate-300 mb-2">属性值: <span className="text-white font-mono bg-slate-700 px-1.5 py-0.5 rounded">{prop.value}</span></div>
                                      <div className="text-slate-400 mb-1.5">重复来源:</div>
                                      <ul className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                                        {duplicates.map((dup, idx) => (
                                          <li key={idx} className="text-red-300 flex items-start gap-1.5 bg-slate-700/50 p-1.5 rounded">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0"></div>
                                            <span className="leading-tight">{dup}</span>
                                          </li>
                                        ))}
                                      </ul>
                                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 transform rotate-45"></div>
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default DeviceTab;
