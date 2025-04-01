import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { useAuth } from "@clerk/clerk-react"; // Import useAuth to check Clerk sign-in state
import { HomeIcon, Library, MessageCircle, Square, UserRoundPen } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  const { isSignedIn } = useAuth(); // Use Clerk's useAuth to check if user is signed in via Clerk

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  console.log({ albums });

  // Check if the user is logged in via email/password
  const isEmailPasswordLoggedIn = !!localStorage.getItem('token');

  return (
    <div className='h-full flex flex-col gap-2'>
      {/* Navigation menu */}
      <div className='rounded-lg bg-gray-900 p-4'>
        <div className='space-y-2'>
          <Link
            to={"/"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-gray-800",
              })
            )}
          >
            <HomeIcon className='mr-2 size-5' />
            <span className='hidden md:inline'>Home</span>
          </Link>
          {/* //about */}
          <Link
            to={"/about"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-gray-800",
              })
            )}
          >
            <Square className='mr-2 size-5' />
            <span className='hidden md:inline'>About us</span>
          </Link>

          {/* Show Messages link if user is signed in via Clerk OR logged in via email/password */}
          {(isSignedIn || isEmailPasswordLoggedIn) && (
            <Link
              to={"/chat"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "w-full justify-start text-white hover:bg-gray-800",
                })
              )}
            >
              <MessageCircle className='mr-2 size-5' />
              <span className='hidden md:inline'>Messages</span>
            </Link>
          )}

          <Link
            to={"/contact"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "w-full justify-start text-white hover:bg-gray-800",
              })
            )}
          >
            <UserRoundPen className='mr-2 size-5' />
            <span className='hidden md:inline'>Contact</span>
          </Link>
        </div>
      </div>

      {/* Library section */}
      <div className='flex-1 rounded-lg bg-gray-900 p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center text-white px-2'>
            <Library className='size-5 mr-2' />
            <span className='hidden md:inline'>Mood playlists</span>
          </div>
        </div>

        <ScrollArea className='h-[calc(100vh-300px)]'>
          <div className='space-y-2'>
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/albums/${album._id}`}
                  key={album._id}
                  className='p-2 hover:bg-gray-800 rounded-md flex items-center gap-3 group cursor-pointer'
                >
                  <img
                    src={album.imageUrl}
                    alt='Playlist img'
                    className='size-12 rounded-md flex-shrink-0 object-cover'
                  />

                  <div className='flex-1 min-w-0 hidden md:block'>
                    <p className='font-medium truncate'>{album.title}</p>
                    <p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LeftSidebar;