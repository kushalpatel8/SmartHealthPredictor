import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignUp path="/register" routing="path" signInUrl="/login" />
        </div>
    );
};

export default Register;