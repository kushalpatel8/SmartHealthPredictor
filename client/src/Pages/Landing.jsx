import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, HeartPulse, Stethoscope, ImageIcon, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users size={32} className="text-blue-500" />,
      title: 'Patient Management',
      description: 'Easily store and track patient records securely with role-based access.',
    },
    {
      icon: <HeartPulse size={32} className="text-purple-500" />,
      title: 'Risk Prediction',
      description: 'Leverage AI models to analyze health parameters and predict cardiovascular risks.',
    },
    {
      icon: <Stethoscope size={32} className="text-emerald-500" />,
      title: 'Symptom Checker',
      description: 'Evaluate symptoms using our intelligent checker to help guide medical diagnosis.',
    },
    {
      icon: <ImageIcon size={32} className="text-pink-500" />,
      title: 'Medical Image Analysis',
      description: 'Upload scans and X-rays to get automated AI insights and detection.',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 space-y-16 max-w-6xl mx-auto py-12">
      
      {/* Hero Section */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
        <div className="mx-auto bg-primary-100 p-4 rounded-full w-28 h-28 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 relative group cursor-default">
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 animate-ping opacity-75"></div>
          <Activity size={56} className="text-primary-600 group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          Welcome to <span className="text-primary-600">SmartHealth</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
          An AI-powered clinic management system designed to augment your medical workflow with advanced predictions and beautifully organized records.
        </p>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-xl font-bold transition-all shadow-xl shadow-primary-600/30 hover:shadow-2xl hover:shadow-primary-600/40 transform hover:-translate-y-1"
          >
            Go to Dashboard
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mt-16 text-left animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
        {features.map((feature, idx) => (
          <div 
            key={idx} 
            className="group p-8 glass-panel rounded-3xl border border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-3 transition-all duration-300 cursor-default"
          >
            <div className="mb-6 p-4 bg-slate-50/50 rounded-2xl inline-block group-hover:bg-primary-50 transition-colors duration-300">
              <div className="transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
