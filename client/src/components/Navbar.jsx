import React from 'react';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="glass-panel shadow-sm  border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">SmartHealth</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
                            <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Sign up</Link>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;