"use client";

import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg">
          <div className="bg-black dark:bg-white p-1 rounded-md text-white dark:text-black">
            <Sparkles size={16} fill="currentColor" />
          </div>
          Auth
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-black dark:hover:text-white transition">
            Home
          </Link>
          <Link href="/login" className="hover:text-black dark:hover:text-white transition">
            Login
          </Link>
          <Link href="/signup" className="hover:text-black dark:hover:text-white transition">
            Sign Up
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/KaranBhosale8585"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full hover:scale-110 transition-transform"
          >
            <Image src="/github.png" alt="github" width={20} height={20} className="dark:invert" />
          </a>

          <a
            href="mailto:karanbhosale8586@email.com"
            className="p-2 bg-gray-50 dark:bg-gray-900 rounded-full hover:scale-110 transition-transform"
          >
            <Mail size={18} className="text-gray-900 dark:text-white" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-500 border-t border-gray-100 dark:border-gray-900 pt-8">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} Auth. All rights reserved.
        </p>
        <p>Built with precision by Karan Bhosale</p>
      </div>
    </footer>
  );
}
