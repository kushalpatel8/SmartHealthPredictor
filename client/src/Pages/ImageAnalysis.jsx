import React, { useState, useRef } from 'react';
import { imageAnalysisAPI } from '../services/api';
import { UploadCloud, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const ImageAnalysis = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (!selected.type.startsWith('image/')) {
                setError("Please select a valid image file (PNG, JPG).");
                return;
            }
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (!droppedFile.type.startsWith('image/')) {
                setError("Please select a valid image file (PNG, JPG).");
                return;
            }
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const res = await imageAnalysisAPI.analyze(formData);
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to analyze image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Medical Image Analysis</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Upload an X-ray or MRI scan for automated AI analysis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="glass-panel dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upload Scan</h3>
                    
                    <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10' : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                        />
                        
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Scan preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                                <div className="mt-4 text-sm font-medium text-primary-600 dark:text-primary-400">Click or drag to replace image</div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400">
                                    <UploadCloud size={32} />
                                </div>
                                <div>
                                    <p className="text-slate-700 dark:text-slate-300 font-medium">Click to upload or drag and drop</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">SVG, PNG, JPG or GIF (max. 10MB)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                            <AlertCircle className="text-red-500 mt-0.5" size={20} />
                            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <button 
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className="w-full mt-6 bg-primary-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-primary-700 focus:outline-none disabled:bg-slate-300 dark:disabled:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Analyzing Image...
                            </>
                        ) : (
                            <>
                                <ImageIcon size={20} />
                                Analyze Image
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="glass-panel dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Analysis Results</h3>
                    
                    {result ? (
                        <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Detected Anomaly</p>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                                    {result.diagnosis || 'No anomalies detected'}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                                    <span>Confidence Score</span>
                                    <span className="font-bold">{((result.confidence || 0) * 100).toFixed(1)}%</span>
                                </p>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="bg-primary-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${(result.confidence || 0) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mt-auto">
                                <CheckCircle2 className="text-blue-500 mt-0.5" size={20} />
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Analysis complete. The AI model identified patterns with the displayed confidence score.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                            <ImageIcon size={48} className="mb-4 opacity-50" />
                            <p>Upload and analyze an image to view the detailed findings here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageAnalysis;
