import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Edit2, 
  Check, 
  FileText, 
  Plus, 
  PlayCircle, 
  AlertCircle, 
  File, 
  Loader2, 
  X, 
  Settings, 
  Info, 
  Zap, 
  Briefcase,
  UploadCloud,
  ChevronDown
} from 'lucide-react';
import { FileItem, Template, PageType } from '../../types';
import { ALL_CHECK_TYPES, ALL_CREDIT_ITEMS, ALL_TECH_ITEMS, ALL_ECONOMIC_ITEMS, ALL_DEVICE_ITEMS } from '../../constants';
import { handleCheckTypeToggle } from '../../utils/checkTypeUtils';

import { CustomSelect } from '../ui/CustomSelect';

interface ProjectProps {
  setCurrentPage: (page: PageType) => void;
  isEditingName: boolean;
  setIsEditingName: (val: boolean) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  files: FileItem[];
  formatSize: (size: number) => string;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartComparisonClick: () => void;
  errorMsg: string | null;
  removeFile: (id: string) => void;
  updateSubFileCategory: (fileId: string, subFileId: string, category: any) => void;
  activeTemplateId: string;
  applyTemplate: (id: string) => void;
  templates: Template[];
  availableCheckTypes: string[];
  selectedCheckTypes: string[];
  setSelectedCheckTypes: (types: string[]) => void;
  selectedCreditItems: string[];
  setSelectedCreditItems: (items: string[]) => void;
  selectedTechItems: string[];
  setSelectedTechItems: (items: string[]) => void;
  disabledItems: string[];
  selectedEconomicItems: string[];
  setSelectedEconomicItems: (items: string[]) => void;
  selectedDeviceItems: string[];
  setSelectedDeviceItems: (items: string[]) => void;
  sentenceThreshold: number;
  setSentenceThreshold: (val: number) => void;
  riskThreshold: number;
  setRiskThreshold: (val: number) => void;
  filterBiddingDoc: boolean;
  setFilterBiddingDoc: (val: boolean) => void;
  excludeTableHeaders: boolean;
  setExcludeTableHeaders: (val: boolean) => void;
  excludeTableTitles: boolean;
  setExcludeTableTitles: (val: boolean) => void;
  biddingDocFile: { id: string; name: string; size: number } | null;
  biddingDocError: string | null;
  handleBiddingDocInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeBiddingDoc: () => void;
  economicRegion: { province: string; city: string };
  setEconomicRegion: (val: { province: string; city: string }) => void;
  economicListType: string;
  setEconomicListType: (val: string) => void;
}

const Project: React.FC<ProjectProps> = ({
  setCurrentPage,
  isEditingName,
  setIsEditingName,
  projectName,
  setProjectName,
  nameInputRef,
  files,
  formatSize,
  handleFileInput,
  handleStartComparisonClick,
  errorMsg,
  removeFile,
  updateSubFileCategory,
  activeTemplateId,
  applyTemplate,
  templates,
  availableCheckTypes,
  selectedCheckTypes,
  setSelectedCheckTypes,
  selectedCreditItems,
  setSelectedCreditItems,
  selectedTechItems,
  setSelectedTechItems,
  disabledItems,
  selectedEconomicItems,
  setSelectedEconomicItems,
  selectedDeviceItems,
  setSelectedDeviceItems,
  sentenceThreshold,
  setSentenceThreshold,
  riskThreshold,
  setRiskThreshold,
  filterBiddingDoc,
  setFilterBiddingDoc,
  excludeTableHeaders,
  setExcludeTableHeaders,
  excludeTableTitles,
  setExcludeTableTitles,
  biddingDocFile,
  biddingDocError,
  handleBiddingDocInput,
  removeBiddingDoc,
  economicRegion,
  setEconomicRegion,
  economicListType,
  setEconomicListType,
}) => {
  const [expandedFiles, setExpandedFiles] = React.useState<Record<string, boolean>>({});

  const toggleExpand = (fileId: string) => {
    setExpandedFiles(prev => ({ ...prev, [fileId]: !prev[fileId] }));
  };

  return (
    <motion.div 
      key="project"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Project Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setCurrentPage('home')}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-3">
          {isEditingName ? (
            <div className="flex items-center gap-2 w-full max-w-md">
              <input
                ref={nameInputRef}
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="flex-1 text-2xl font-bold text-slate-900 bg-white border border-indigo-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                onBlur={() => setIsEditingName(false)}
              />
              <button onClick={() => setIsEditingName(false)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md">
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h1 className="text-2xl font-bold text-slate-900">{projectName}</h1>
              <button 
                onClick={() => setIsEditingName(true)}
                className="p-1.5 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. File List */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm relative">
          <div className="sticky top-16 z-10 px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/95 backdrop-blur-md shadow-sm rounded-t-xl">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                待比对文件
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                共 {files?.length || 0} 份文件，总大小 {formatSize(files?.reduce((acc, f) => acc + f.size, 0) || 0)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" />
                添加文件
                <input type="file" multiple className="hidden" onChange={handleFileInput} accept=".doc,.docx,.pdf,.xls,.xlsx,.xml" />
              </label>
              <button 
                onClick={handleStartComparisonClick}
                disabled={!files || files.length < 2 || files.every(f => f.status === '比对中')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle className="w-4 h-4" />
                开始比对
              </button>
            </div>
          </div>
          
          {errorMsg && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div className="p-2">
            {(!files || files.length === 0) ? (
              <div className="text-center py-12">
                <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">暂无文件，请点击下方悬浮按钮添加</p>
              </div>
            ) : (
              <div className="space-y-2">
                {files.map(file => (
                  <div key={file.id} className="flex flex-col border-b border-slate-100 last:border-0">
                    <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <File className="w-5 h-5 text-slate-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 pl-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                          file.status === '已完成' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          file.status === '比对中' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {file.status === '比对中' && <Loader2 className="w-3 h-3 animate-spin" />}
                          {file.status}
                        </span>
                        <button 
                          onClick={() => removeFile(file.id)} 
                          disabled={file.status === '比对中'}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all disabled:opacity-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {file.subFiles && file.subFiles.length > 0 && (
                      <div className="ml-10 mb-3 pl-3 border-l-2 border-slate-100 space-y-2">
                        {file.subFiles.slice(0, expandedFiles[file.id] ? undefined : 3).map(subFile => (
                          <div key={subFile.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-xs text-slate-600 truncate" title={subFile.name}>{subFile.name}</span>
                            </div>
                            <select
                              value={subFile.category}
                              onChange={(e) => updateSubFileCategory(file.id, subFile.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="credit">资信标</option>
                              <option value="tech">技术标</option>
                              <option value="economic">经济标</option>
                              <option value="other">其他</option>
                            </select>
                          </div>
                        ))}
                        {file.subFiles.length > 3 && (
                          <div className="relative mt-4 mb-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <button
                                onClick={() => toggleExpand(file.id)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-offset-2"
                              >
                                {expandedFiles[file.id] ? (
                                  <><span>收起</span><ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform" /></>
                                ) : (
                                  <><span>展开全部 {file.subFiles.length} 个文件</span><ChevronDown className="w-3.5 h-3.5 transition-transform" /></>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Configuration */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800">比对规则配置</h2>
          </div>
          <div className="p-6 space-y-8">
            {/* 检查类型 */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-600 pl-3 leading-none">检查类型</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-medium">应用规则模板:</span>
                  <select 
                    value={activeTemplateId}
                    onChange={(e) => applyTemplate(e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700 font-semibold shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
                  >
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-8 ml-4">
                {ALL_CHECK_TYPES.map(type => {
                  const isSupported = availableCheckTypes.includes(type);
                  const isSelected = selectedCheckTypes?.includes(type);
                  return (
                  <label key={type} className={`flex items-center gap-3 ${isSupported ? 'cursor-pointer group' : 'cursor-not-allowed opacity-50'}`}>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                        checked={isSelected}
                        disabled={!isSupported}
                        onChange={() => {
                          const isTurningOn = !isSelected;
                          handleCheckTypeToggle(type, selectedCheckTypes || [], setSelectedCheckTypes);
                          if (isTurningOn) {
                            if (type === '资信标比对') setSelectedCreditItems(ALL_CREDIT_ITEMS);
                            if (type === '技术标比对') setSelectedTechItems(ALL_TECH_ITEMS);
                            if (type === '经济标比对') setSelectedEconomicItems(ALL_ECONOMIC_ITEMS);
                            if (type === '文件设备特征比对') setSelectedDeviceItems(ALL_DEVICE_ITEMS);
                          }
                        }}
                      />
                      <Check className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-500'} group-hover:text-slate-900 transition-colors`}>
                      {type}
                    </span>
                    {!isSupported && (
                      <div className="group/tip relative">
                        <Info className="w-3.5 h-3.5 text-slate-300" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-10">
                          当前上传的文件格式不支持此项检查
                        </div>
                      </div>
                    )}
                  </label>
                )})}
              </div>
            </div>

            {/* 详细检查项 */}
            <div className="space-y-10">
              {/* 资信标 */}
              <div className={`space-y-4 ${!selectedCheckTypes.includes('资信标比对') ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <h3 className="text-sm font-bold text-slate-800 border-l-4 border-blue-500 pl-3 leading-none">资信标比对项</h3>
                <div className="bg-slate-50/80 rounded-lg p-5 border border-slate-100 flex flex-wrap gap-x-10 gap-y-4">
                  {ALL_CREDIT_ITEMS.map(item => {
                    const isSelected = selectedCreditItems?.includes(item);
                    return (
                    <div key={item} className={`flex items-center gap-2.5 ${isSelected ? '' : 'opacity-40'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  )})}
                </div>
              </div>

              {/* 技术标 */}
              <div className={`space-y-4 ${!selectedCheckTypes?.includes('技术标比对') ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 leading-none">技术标比对项</h3>
                  {selectedCheckTypes?.includes('技术标比对') && (
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                          checked={excludeTableHeaders}
                          onChange={(e) => setExcludeTableHeaders(e.target.checked)}
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                          不对表格中的表头进行查重
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                          checked={excludeTableTitles}
                          onChange={(e) => setExcludeTableTitles(e.target.checked)}
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                          不对表格标题进行查重
                        </span>
                      </label>
                    </div>
                  )}
                </div>
                <div className="bg-slate-50/80 rounded-lg p-5 border border-slate-100 flex flex-wrap gap-x-10 gap-y-4">
                  {ALL_TECH_ITEMS.map(item => {
                    const isDisabled = disabledItems?.includes(item);
                    const isSelected = selectedTechItems?.includes(item);
                    const active = isSelected && !isDisabled;
                    return (
                    <div key={item} className={`flex items-center gap-2.5 ${active ? '' : 'opacity-40'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                      {isDisabled && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded ml-1">敬请期待</span>}
                    </div>
                  )})}
                </div>
              </div>

              {/* 经济标 */}
              <div className={`space-y-4 ${!selectedCheckTypes?.includes('经济标比对') ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-bold text-slate-800 border-l-4 border-amber-500 pl-3 leading-none flex items-center gap-2">
                    经济标比对项
                    {selectedCheckTypes?.includes('经济标比对') && !biddingDocFile && (
                      <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-100 animate-pulse">
                        需导入招标文件
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-medium">
                    仅山东、江苏地区清单支持。其余地区逐步完善中，敬请期待~
                  </span>
                </div>

                {selectedCheckTypes?.includes('经济标比对') && (
                  <div className="flex items-center gap-6 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 shrink-0">比对地区:</span>
                      <CustomSelect
                        value={economicRegion.province}
                        onChange={(val) => setEconomicRegion({...economicRegion, province: val})}
                        options={[
                          { label: '山东省', value: '山东省' },
                          { label: '江苏省', value: '江苏省' },
                        ]}
                        className="w-24"
                      />
                      <CustomSelect
                        value={economicRegion.city}
                        onChange={(val) => setEconomicRegion({...economicRegion, city: val})}
                        options={[
                          { label: '淄博市', value: '淄博市' },
                          { label: '济南市', value: '济南市' },
                          { label: '青岛市', value: '青岛市' },
                          { label: '南京市', value: '南京市' },
                          { label: '苏州市', value: '苏州市' },
                        ]}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600 shrink-0">清单类型:</span>
                      <CustomSelect
                        value={economicListType}
                        onChange={(val) => setEconomicListType(val)}
                        options={[
                          { label: '房建', value: '房建' },
                          { label: '交通', value: '交通' },
                          { label: '水利', value: '水利' },
                          { label: '公路', value: '公路' },
                        ]}
                        className="w-24"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-slate-50/80 rounded-lg p-5 border border-slate-100 flex flex-wrap gap-x-10 gap-y-4">
                  {ALL_ECONOMIC_ITEMS.map(item => {
                    const isSelected = selectedEconomicItems?.includes(item);
                    return (
                    <div key={item} className={`flex items-center gap-2.5 ${isSelected ? '' : 'opacity-40'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-500' : 'bg-slate-300'}`} />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  )})}
                </div>
              </div>

              {/* 设备特征 */}
              <div className={`space-y-4 ${!selectedCheckTypes?.includes('文件设备特征比对') ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                <h3 className="text-sm font-bold text-slate-800 border-l-4 border-purple-500 pl-3 leading-none">文件设备特征比对项</h3>
                <div className="bg-slate-50/80 rounded-lg p-5 border border-slate-100 flex flex-wrap gap-x-10 gap-y-4">
                  {ALL_DEVICE_ITEMS.map(item => {
                    const isSelected = selectedDeviceItems?.includes(item);
                    return (
                    <div key={item} className={`flex items-center gap-2.5 ${isSelected ? '' : 'opacity-40'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-500' : 'bg-slate-300'}`} />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  )})}
                </div>
              </div>
            </div>

            {/* 高级设置与招标文件 */}
            <div className="pt-8 border-t border-slate-100 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 阈值设置 */}
                <div className="space-y-6 col-span-2">
                  <h3 className="text-sm font-bold text-slate-800 border-l-4 border-slate-400 pl-3 leading-none">雷同判定阈值</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
                    {/* 语句雷同判定阈值 */}
                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">语句雷同判定阈值 <span className="text-slate-400 font-normal text-xs">(推荐 80%，仅作用于技术标)</span></span>
                          <div className="relative flex items-center cursor-help">
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-800 text-white text-[11px] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                              该阈值决定了技术标中单句或段落内容重复百分之多少才被判定为“雷同”。<br/><br/>
                              例如设置为80%：一句话中如有80%以上内容与另一份标书完全一致，才会被标记为雷同段落。<br/>
                              <span className="text-indigo-300">适用场景：若不希望常规套话(如法律声明)被标红，可适当调高此值。此阈值仅在技术标比对中生效。</span>
                              <div className="absolute w-2 h-2 bg-slate-800 rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{sentenceThreshold}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="60" 
                        max="100" 
                        value={sentenceThreshold} 
                        onChange={(e) => setSentenceThreshold(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-400 font-medium">60% (严格，容错度低)</span>
                        <span className="text-[10px] text-slate-400 font-medium">100% (宽松，必须完全一致)</span>
                      </div>
                    </div>

                    {/* 重复风险阈值 */}
                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700">整体重复风险阈值 <span className="text-slate-400 font-normal text-xs">(仅作用于技术标)</span></span>
                          <div className="relative flex items-center cursor-help">
                            <Info className="w-3.5 h-3.5 text-slate-400" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-800 text-white text-[11px] rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                              该阈值决定了技术标整份文件的综合重复率达到多少时，系统会将其判定为“高风险”并标红预警。<br/><br/>
                              例如设置为30%：只有当两份标书的技术标部分整体雷同内容超过30%时，才会在报告中提示高风险(红色)。<br/>
                              <span className="text-indigo-300">适用场景：根据各地区、各行业的查重要求调整红线预警标准。此阈值仅在技术标比对中生效。</span>
                              <div className="absolute w-2 h-2 bg-slate-800 rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                            </div>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{riskThreshold}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="80" 
                        value={riskThreshold} 
                        onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-400 font-medium">30% (极易触发红线)</span>
                        <span className="text-[10px] text-slate-400 font-medium">80% (极难触发红线)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 招标文件导入 */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 border-l-4 border-slate-400 pl-3 leading-none">招标文件导入</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">过滤招标文件内容</span>
                    <div className="group relative">
                      <Info className="w-3.5 h-3.5 text-slate-300" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        上传招标文件，系统将自动排除标书中引用的招标文件原文，减少误报。
                      </div>
                    </div>
                    <button 
                      onClick={() => setFilterBiddingDoc(!filterBiddingDoc)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${filterBiddingDoc ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${filterBiddingDoc ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${biddingDocFile ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-100/50'}`}>
                    {biddingDocFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <FileText className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{biddingDocFile.name}</p>
                            <p className="text-[11px] text-slate-500">{formatSize(biddingDocFile.size)}</p>
                          </div>
                        </div>
                        <button onClick={removeBiddingDoc} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block py-4">
                        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-600">点击或拖拽上传招标文件</p>
                        <p className="text-[10px] text-slate-400 mt-1">支持 .doc, .docx, .pdf 格式</p>
                        <input type="file" className="hidden" onChange={handleBiddingDocInput} accept=".doc,.docx,.pdf" />
                      </label>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center p-6 bg-slate-50/30 rounded-xl border border-slate-100 border-dashed">
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      <span className="font-bold text-amber-600 not-italic block mb-1">重要提示：</span>
                      导入招标文件不仅可以开启“内容过滤”功能，也是进行“经济标比对”的必要前提。系统将基于招标文件中的清单项进行深度一致性校验。
                    </p>
                  </div>
                </div>
                {biddingDocError && <p className="text-[10px] text-red-500 font-medium pl-5">{biddingDocError}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Floating Action Bar removed */}
    </motion.div>
  );
};

export default Project;
