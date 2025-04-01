import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];
  stats: Stats;

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  deleteSong: (id: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  featuredSongs: [],
  trendingSongs: [],
  stats: {
    totalSongs: 0,
    totalAlbums: 0,
    totalUsers: 0,
    totalArtists: 0,
  },


	deleteSong: async (id) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axiosInstance.delete(`/admin/songs/${id}`);
    console.log("Song deleted:", response.data);
    set((state) => ({
      songs: state.songs.filter((song) => song._id !== id),
      stats: { ...state.stats, totalSongs: state.songs.length - 1 },
    }));
    toast.success("Song deleted successfully");
  } catch (error: any) {
    console.error("Error in deleteSong:", error.response?.data || error.message);
    const errorMessage = error.response?.status === 404
      ? "Song not found or route unavailable"
      : error.response?.data?.message || "Error deleting song";
    toast.error(errorMessage);
    set({ error: errorMessage });
  } finally {
    set({ isLoading: false });
  }
},


deleteAlbum: async (id) => {
  set({ isLoading: true, error: null });
  try {
    const response = await axiosInstance.delete(`/admin/albums/${id}`);
    console.log("Album deleted:", response.data);
    set((state) => {
      const deletedAlbum = state.albums.find((a) => a._id === id);
      console.log(deletedAlbum)
      return {
        albums: state.albums.filter((album) => album._id !== id),
        songs: state.songs.map((song) =>
          song.albumId === id ? { ...song, albumId: null } : song // Fix: Compare with album _id, not title
        ),
        stats: { ...state.stats, totalAlbums: state.albums.length - 1 },
      };
    });
    toast.success("Album deleted successfully");
  } catch (error: any) {
    console.error("Error in deleteAlbum:", error.response?.data || error.message);
    const errorMessage = error.response?.status === 404
      ? "Album not found or server route unavailable. Please try again later."
      : error.response?.data?.message || "Failed to delete album";
    set({ error: errorMessage });
    toast.error(errorMessage);
  } finally {
    set({ isLoading: false });
  }
},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			console.log("Songs fetched:", response.data);
			set({ songs: response.data });
			set((state) => ({
				stats: { ...state.stats, totalSongs: response.data.length || 0 },
			}));
		} catch (error: any) {
			console.error("Error fetching songs:", error.response?.data || error.message);
			set({ error: error.response?.data?.message || "Failed to fetch songs" });
			if (error.response?.status === 401) {
				console.log("401 Unauthorized - User not authenticated for /songs");
				// Let the frontend handle the redirect
			}
		} finally {
			set({ isLoading: false });
		}
	},
	
	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			console.log("Stats fetched:", response.data);
			set({ stats: response.data });
		} catch (error: any) {
			console.error("Error fetching stats:", error.response?.data || error.message);
			set({ error: error.response?.data?.message || "Failed to fetch stats" });
			if (error.response?.status === 401) {
				console.log("401 Unauthorized - User not authenticated for /stats");
				// Let the frontend handle the redirect
			}
		} finally {
			set({ isLoading: false });
		}
	},
  
	
	fetchAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/albums");
			console.log("Albums fetched:", response.data);
			set({ albums: response.data });
			set((state) => ({
				stats: { ...state.stats, totalAlbums: response.data.length || 0 },
			}));
		} catch (error: any) {
			console.error("Error fetching albums:", error.response?.data || error.message);
			set({ error: error.response?.data?.message || "Failed to fetch albums" });
			if (error.response?.status === 401) {
				console.log("401 Unauthorized - User not authenticated for /albums");
			}
		} finally {
			set({ isLoading: false });
		}
	},

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      console.error("Error fetching album by ID:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Failed to fetch album" });
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - User not authenticated for /albums/:id");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/featured");
      set({ featuredSongs: response.data });
    } catch (error: any) {
      console.error("Error fetching featured songs:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Failed to fetch featured songs" });
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - User not authenticated for /songs/featured");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/made-for-you");
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      console.error("Error fetching made-for-you songs:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Failed to fetch made-for-you songs" });
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - User not authenticated for /songs/made-for-you");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTrendingSongs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/songs/trending");
      set({ trendingSongs: response.data });
    } catch (error: any) {
      console.error("Error fetching trending songs:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Failed to fetch trending songs" });
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - User not authenticated for /songs/trending");
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));