import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Leaderboard from '../components/Leaderboard';
import PlayerStats from '../components/PlayerStats';
import GameManagement from '../components/GameManagement';
import AdminPanel from '../components/AdminPanel';
import BlogList from '../components/blog/BlogList';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from '../types/user';
import type { BlogPost } from '../types/blog';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isBlogLoading, setIsBlogLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    // Set active tab from location state if provided
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to prevent persisting
      window.history.replaceState({}, document.title);
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as User);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate, location]);

  // Fetch blog posts when blog tab is active
  useEffect(() => {
    if (activeTab === 'blog') {
      const fetchBlogPosts = async () => {
        setIsBlogLoading(true);
        try {
          const postsQuery = query(
            collection(db, 'blog-posts'),
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
          );

          const snapshot = await getDocs(postsQuery);
          const postsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedAt: doc.data().publishedAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          })) as BlogPost[];

          setBlogPosts(postsData);
        } catch (err: any) {
          console.error('Error fetching blog posts:', err);
        } finally {
          setIsBlogLoading(false);
        }
      };

      fetchBlogPosts();
    }
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !userData) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Please sign in to access the dashboard
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'players', label: 'Players' },
    { id: 'games', label: 'Games' },
    { id: 'blog', label: 'Blog' },
    ...(userData?.isAdmin ? [{ id: 'admin', label: 'Admin' }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ruff Ryders Cup
            </h1>
            <div className="flex items-center space-x-4">
              <ThemeSwitcher />
              <span className="hidden sm:inline text-gray-600 dark:text-gray-300">
                {userData?.name || currentUser?.email}
              </span>
              <button
                onClick={() => navigate('/profile')}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max sm:min-w-0 space-x-1 sm:space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'leaderboard' && <Leaderboard />}
        {activeTab === 'players' && <PlayerStats />}
        {activeTab === 'games' && <GameManagement userId={currentUser?.uid} />}
        {activeTab === 'blog' && (
          isBlogLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <BlogList posts={blogPosts} />
          )
        )}
        {activeTab === 'admin' && userData?.isAdmin && <AdminPanel />}
      </main>
    </div>
  );
}