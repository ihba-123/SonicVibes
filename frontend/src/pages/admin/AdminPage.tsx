import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";

const AdminPage = () => {
  const { isAdmin} = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();
  const { isSignedIn } = useAuth();

  const isEmailPasswordLoggedIn = !!localStorage.getItem("token") && !isSignedIn;
  const isAuthenticated = isSignedIn || isEmailPasswordLoggedIn;

  console.log("AdminPage - isSignedIn:", isSignedIn, "isEmailPasswordLoggedIn:", isEmailPasswordLoggedIn, "isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin);

 

  // Redirect to home if not an admin
  if (!isAdmin ) {
    console.log("User is not an admin, redirecting to /");
    return <Navigate to="/" replace />;
  }

  // Fetch data only if authenticated and an admin
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated && isAdmin ) {
      console.log("Fetching data for AdminPage...");
      const fetchData = async () => {
        if (isMounted) {
          await Promise.all([
            fetchSongs(),
            fetchStats(),
            fetchAlbums(),
          ]);
        }
      };
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isAdmin, fetchSongs, fetchStats, fetchAlbums]);

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-zinc-100 p-8">
      <Header />
      <DashboardStats />
      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-gray-900">
          <TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
            <Album className="mr-2 size-4" />
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>
        <TabsContent value="albums">
          <AlbumsTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;