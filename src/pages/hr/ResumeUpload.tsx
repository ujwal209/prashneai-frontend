import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../lib/api';
import { 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  X,
  FileCheck,
  FileWarning,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onUploadSuccess?: (data: any) => void;
}

const ResumeUpload: React.FC<Props> = ({ onUploadSuccess }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadResults, setUploadResults] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setFiles(acceptedFiles);
    setUploadResults([]);
    setStatus('uploading');
    setErrorMsg('');

    const formData = new FormData();
    acceptedFiles.forEach(file => {
        formData.append('files', file);
    });

    try {
      setTimeout(() => setStatus('analyzing'), 1500);
      
      const response = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = response.data.uploaded || [];
      setUploadResults(uploaded);
      
      const hasErrors = uploaded.some((r: any) => r.error);
      
      if (hasErrors) {
           setStatus('error');
           const errorItem = uploaded.find((r: any) => r.error);
           setErrorMsg(errorItem ? "Some files failed to process." : "Upload failed.");
      } else {
           setStatus('success');
      }

      if (onUploadSuccess) {
          onUploadSuccess(uploaded.filter((r: any) => !r.error));
      }
      
      if (!hasErrors) {
          setTimeout(() => {
              setStatus('idle');
              setFiles([]);
          }, 4000);
      }

    } catch (err: any) {
      console.error("Upload failed", err);
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || "System Error: Upload process failed.");
    } 
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'application/pdf': ['.pdf']},
    multiple: true,
    disabled: status === 'uploading' || status === 'analyzing'
  });

  const getStatusStyles = () => {
      switch(status) {
          case 'success': return 'border-emerald-200 bg-emerald-50';
          case 'error': return 'border-rose-200 bg-rose-50';
          case 'uploading': 
          case 'analyzing': return 'border-indigo-200 bg-indigo-50 cursor-wait ring-2 ring-indigo-100';
          default: return isDragActive 
            ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100' 
            : 'border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50 hover:shadow-md';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-4xl mx-auto space-y-8 px-4 md:px-0">
             
             {/* --- Header --- */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8">
                <div>
                    <button 
                      onClick={() => navigate('/hr/talent')} 
                      className="group flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-2"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                      Back to Talent Pool
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Data Ingestion</h1>
                    <p className="text-slate-500 mt-1 font-medium">
                        Upload resumes to auto-populate your candidate database using AI.
                    </p>
                </div>
             </div>

             {/* --- Main Dropzone --- */}
             <div 
                {...getRootProps()} 
                className={`
                    relative rounded-xl border-2 border-dashed p-12 sm:p-16
                    flex flex-col items-center justify-center text-center
                    transition-all duration-300 ease-out shadow-sm
                    ${getStatusStyles()}
                `}
            >
                <input {...getInputProps()} />
                
                {/* IDLE STATE */}
                {status === 'idle' && (
                    <div className="space-y-6 pointer-events-none">
                        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-bold text-slate-900">
                                {isDragActive ? 'Drop files to upload' : 'Drag & Drop Resumes'}
                            </p>
                            <p className="text-slate-500 text-base font-medium">
                                or <span className="text-indigo-600 underline decoration-2 decoration-indigo-200 underline-offset-4">browse files</span> from your computer
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-4 opacity-70">
                             <div className="px-3 py-1 bg-slate-100 rounded border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                PDF Format
                             </div>
                             <div className="px-3 py-1 bg-slate-100 rounded border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                Max 10MB
                             </div>
                        </div>
                    </div>
                )}

                {/* LOADING / ANALYZING STATE */}
                {(status === 'uploading' || status === 'analyzing') && (
                    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                        <div className="relative w-20 h-20 mx-auto">
                             <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                             <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                {status === 'uploading' ? (
                                    <UploadCloud className="w-8 h-8 text-indigo-600" />
                                ) : (
                                    <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                                )}
                             </div>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900 mb-2">
                                {status === 'uploading' ? 'Uploading Documents...' : 'AI Analysis in Progress'}
                            </p>
                            <p className="text-indigo-700 font-medium bg-indigo-100 px-4 py-1 rounded-full inline-block text-sm">
                                {status === 'uploading' 
                                    ? `Transferring ${files.length} file(s) securely` 
                                    : 'Extracting skills, experience, and contact info'}
                            </p>
                        </div>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {status === 'success' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div>
                             <p className="text-xl font-bold text-slate-900">Processing Complete!</p>
                             <p className="text-emerald-700 font-medium mt-1">
                                {files.length} candidate{files.length !== 1 ? 's' : ''} added to the talent pool.
                             </p>
                        </div>
                        <div className="h-1 w-32 bg-emerald-200 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-[progress_2s_ease-in-out]"></div>
                        </div>
                    </div>
                )}

                {/* ERROR STATE */}
                {status === 'error' && (
                    <div className="space-y-6 animate-in shake">
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <AlertCircle className="w-10 h-10" />
                        </div>
                        <div>
                             <p className="text-xl font-bold text-slate-900">Upload Failed</p>
                             <p className="text-rose-600 font-medium mt-1 max-w-md mx-auto">{errorMsg}</p>
                        </div>
                        <button 
                             type="button"
                             onClick={(e) => { e.stopPropagation(); setStatus('idle'); setFiles([]); }}
                             className="px-6 py-2 bg-white border border-rose-200 text-rose-700 font-bold rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                        >
                            Try Again
                        </button>
                    </div>
                )}
             </div>

             {/* --- File Queue List --- */}
             {files.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white border border-slate-200 rounded shadow-sm">
                                <FileText className="w-4 h-4 text-slate-500" />
                            </div>
                            <h3 className="font-bold text-slate-700 text-sm">File Queue</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-200">
                            {files.length} Documents
                        </span>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                        {files.map((file, idx) => {
                            const result = uploadResults.find(r => r.filename === file.name);
                            const isSuccess = result && !result.error;
                            const isError = result && result.error;
                            
                            return (
                                <div key={idx} className="px-6 py-3 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors group last:border-0">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                                            isError ? 'bg-rose-50 text-rose-600' : 
                                            isSuccess ? 'bg-emerald-50 text-emerald-600' : 
                                            'bg-indigo-50 text-indigo-600'
                                        }`}>
                                            {isError ? <FileWarning className="w-5 h-5" /> : 
                                             isSuccess ? <FileCheck className="w-5 h-5" /> : 
                                             <FileText className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                {(file.size / 1024).toFixed(0)} KB • PDF
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        {(!result && (status === 'uploading' || status === 'analyzing')) && (
                                            <div className="flex items-center gap-2 text-indigo-600">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-xs font-bold hidden sm:inline">Processing...</span>
                                            </div>
                                        )}
                                        {isSuccess && (
                                            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">Parsed</span>
                                            </div>
                                        )}
                                        {isError && (
                                            <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100" title={result.error}>
                                                <X className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold">Failed</span>
                                            </div>
                                        )}
                                        {!result && status === 'idle' && (
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
             )}
        </div>
    </div>
  );
};

export default ResumeUpload;