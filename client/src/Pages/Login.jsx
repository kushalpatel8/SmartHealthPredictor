import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SignIn path="/login" routing="path" signUpUrl="/register" />
        </div>
    );
};

export default Login;
