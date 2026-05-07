import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  X, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { PdfPreviewState } from '../../types';
import PdfView from '../report/PdfView';

interface PdfPreviewProps {
  pdfPreviewState: PdfPreviewState;
  setPdfPreviewState: (state: PdfPreviewState | null) => void;
  activeSensitiveLoc: number | null;
  setActiveSensitiveLoc: (loc: number) => void;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfPreviewState,
  setPdfPreviewState,
  activeSensitiveLoc,
  setActiveSensitiveLoc,
}) => {
  const [activeDuplicateIndex, setActiveDuplicateIndex] = useState(0);
  const [showDuplicateSelect, setShowDuplicateSelect] = useState(false);

  useEffect(() => {
    if (pdfPreviewState?.isOpen) {
      setActiveDuplicateIndex(0);
      setShowDuplicateSelect(false);
    }
  }, [pdfPreviewState?.isOpen]);

  if (!pdfPreviewState || !pdfPreviewState.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                {pdfPreviewState.fileName}
                {pdfPreviewState.internalFile && (
                  <>
                    <span className="text-slate-400 mx-2 font-normal text-sm">/</span>
                    <span className="text-indigo-600">{pdfPreviewState.internalFile}</span>
                  </>
                )}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <span className="bg-slate-200 px-2 py-0.5 rounded text-xs font-medium text-slate-700">{pdfPreviewState.type}</span>
                {pdfPreviewState.item?.page ? (
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-medium border border-amber-200">
                    第 {pdfPreviewState.item.page} 页
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setPdfPreviewState(null)} 
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto bg-slate-100 flex justify-center ${pdfPreviewState.contentType === 'sensitive' ? 'p-0' : 'p-8'}`}>
          {pdfPreviewState.contentType === 'sensitive' ? (
            <div className="flex w-full h-full">
              {/* Left: Extracted Sensitive Info List */}
              <div className="w-80 border-r border-slate-200 bg-slate-50 flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-orange-500"/> 
                    提取的敏感信息
                  </h3>
                  <span className="text-xs text-slate-500">
                    共 {pdfPreviewState.item?.count || 0} 处
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {(pdfPreviewState.item?.locations || []).map((loc: number, idx: number) => {
                     const mockValue = pdfPreviewState.item?.keyword === '联系方式' ? `138${(loc * 12345678).toString().padStart(8, '0').slice(0, 8)}` : `11010519900101${(loc * 1234).toString().padStart(4, '0').slice(0, 4)}`;
                     return (
                      <button 
                        key={idx}
                        onClick={() => setActiveSensitiveLoc(loc)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${activeSensitiveLoc === loc ? 'bg-orange-50 border-orange-300 shadow-sm ring-1 ring-orange-500/20' : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-sm'}`}
                      >
                        <div className="font-bold text-sm text-slate-800 mb-2">{mockValue}</div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500">位置</span>
                          <span className="font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">第 {loc} 页</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Right: PDF View */}
              <div className="flex-1 min-w-0 h-full overflow-y-auto bg-slate-200 p-8 flex justify-center">
                <div className="w-full max-w-3xl">
                  <PdfView 
                    fileName={pdfPreviewState.fileName || ''} 
                    internalFile={pdfPreviewState.internalFile}
                    value={pdfPreviewState.value || ''} 
                    type={pdfPreviewState.type || ''} 
                    isDuplicate={false} 
                    contentType={pdfPreviewState.contentType} 
                    activeSensitiveLoc={activeSensitiveLoc} 
                    occurrencesCount={pdfPreviewState.occurrencesCount}
                  />
                </div>
              </div>
            </div>
          ) : pdfPreviewState.duplicates && pdfPreviewState.duplicates.length > 0 ? (
            <div className="flex gap-8 w-full max-w-[1600px]">
              {/* Original File */}
              <div className="flex-1 min-w-0">
                <div className="mb-2 font-bold text-slate-700 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-200">当前文件</span>
                  <span className="truncate">
                    {pdfPreviewState.fileName}
                    {pdfPreviewState.internalFile && (
                      <>
                        <span className="text-slate-400 mx-1 font-normal text-sm">/</span>
                        <span className="text-indigo-600">{pdfPreviewState.internalFile}</span>
                      </>
                    )}
                  </span>
                </div>
                <PdfView 
                  fileName={pdfPreviewState.fileName || ''} 
                  internalFile={pdfPreviewState.internalFile}
                  value={pdfPreviewState.value || ''} 
                  type={pdfPreviewState.type || ''} 
                  isDuplicate={false} 
                  contentType={pdfPreviewState.contentType}
                  occurrencesCount={pdfPreviewState.occurrencesCount} 
                />
              </div>
              
              {/* Duplicate File */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-700 w-full">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs border border-red-200 shrink-0">重复文件</span>
                    
                    {pdfPreviewState.duplicates.length > 1 ? (
                      <div className="relative flex-1 min-w-0">
                        <button 
                          onClick={() => setShowDuplicateSelect(!showDuplicateSelect)}
                          className="flex items-center justify-between w-full text-left bg-white border border-slate-200 rounded px-2 py-1 text-sm hover:border-slate-300 focus:outline-none"
                        >
                          <span className="truncate">
                            <span className="font-medium mr-1 text-slate-500">({activeDuplicateIndex + 1}/{pdfPreviewState.duplicates.length})</span>
                            {pdfPreviewState.duplicates[activeDuplicateIndex].fileName}
                            {pdfPreviewState.duplicates[activeDuplicateIndex].internalFile && (
                              <>
                                <span className="text-slate-400 mx-1 font-normal text-sm">/</span>
                                <span className="text-indigo-600">{pdfPreviewState.duplicates[activeDuplicateIndex].internalFile}</span>
                              </>
                            )}
                          </span>
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                        </button>
                        
                        {showDuplicateSelect && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setShowDuplicateSelect(false)}
                            />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-lg z-20 max-h-60 overflow-y-auto">
                              {pdfPreviewState.duplicates.map((dup, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    setActiveDuplicateIndex(idx);
                                    setShowDuplicateSelect(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg ${idx === activeDuplicateIndex ? 'bg-red-50 text-red-700 font-medium' : 'text-slate-700'}`}
                                >
                                  <div className="truncate">
                                    {dup.fileName}
                                    {dup.internalFile && (
                                      <>
                                        <span className="text-slate-400 mx-1 font-normal text-xs">/</span>
                                        <span className={idx === activeDuplicateIndex ? 'text-red-600' : 'text-indigo-600'}>{dup.internalFile}</span>
                                      </>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="truncate text-sm">
                        {pdfPreviewState.duplicates[0].fileName}
                        {pdfPreviewState.duplicates[0].internalFile && (
                          <>
                            <span className="text-slate-400 mx-1 font-normal text-sm">/</span>
                            <span className="text-indigo-600">{pdfPreviewState.duplicates[0].internalFile}</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <PdfView 
                    fileName={pdfPreviewState.duplicates[activeDuplicateIndex].fileName} 
                    internalFile={pdfPreviewState.duplicates[activeDuplicateIndex].internalFile}
                    value={pdfPreviewState.duplicates[activeDuplicateIndex].value} 
                    type={pdfPreviewState.type || ''} 
                    isDuplicate={true} 
                    contentType={pdfPreviewState.contentType} 
                    occurrencesCount={pdfPreviewState.duplicates[activeDuplicateIndex].occurrencesCount}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl">
               <PdfView 
                 fileName={pdfPreviewState.fileName || ''} 
                 internalFile={pdfPreviewState.internalFile}
                 value={pdfPreviewState.value || ''} 
                 type={pdfPreviewState.type || ''} 
                 isDuplicate={false} 
                 contentType={pdfPreviewState.contentType} 
                 occurrencesCount={pdfPreviewState.occurrencesCount}
               />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfPreview;
