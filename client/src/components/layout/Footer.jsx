import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-slate-100">
              Dance For Change
            </h3>
            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
              Promoting mental health and well-being through dance. Join our community and make a positive change, one step at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/room" 
                  className="text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  MindTalk
                </Link>
              </li>
              <li>
                <Link 
                  to="/dancers" 
                  className="text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Our Dancers
                </Link>
              </li>
              <li>
                <Link 
                  to="/videos" 
                  className="text-gray-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Videos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-slate-100">Contact</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
              Email: <a 
                href="mailto:info@danceforchange.org" 
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                info@danceforchange.org
              </a>
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Join our community and be part of the change.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 text-center">
          <p className="text-sm text-gray-600 dark:text-slate-400">
            &copy; 2025 Dance For Change. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

