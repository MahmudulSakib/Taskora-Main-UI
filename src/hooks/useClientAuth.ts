// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface UserProfileResponse {
//   user: {
//     id: string;
//     fullName: string;
//     email: string;
//     mobileNumber: string;
//     profilePicture?: string;
//   };
// }

// export default function useClientAuth() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const checkAuth = async () => {
//     try {
//       const res = await axios.get<UserProfileResponse>(
//         "https://taskora-main-backend.onrender.com/client/profile",
//         {
//           withCredentials: true,
//         }
//       );
//       setUser(res.data.user);
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "https://taskora-main-backend.onrender.com/client/log-out",
//         {},
//         { withCredentials: true }
//       );
//       setUser(null);
//       router.push("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return { user, loading, handleLogout };
// }

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface UserProfileResponse {
//   user: {
//     id: string;
//     fullName: string;
//     email: string;
//     mobileNumber: string;
//     profilePicture?: string;
//   };
// }

// export default function useClientAuth() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const checkAuth = async () => {
//     try {
//       const res = await axios.get<UserProfileResponse>(
//         "https://taskora-main-backend.onrender.com/client/profile",
//         {
//           withCredentials: true,
//         }
//       );
//       setUser(res.data.user);
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false); // fallback if request finishes
//     }
//   };

//   useEffect(() => {
//     let timeout = setTimeout(() => {
//       setLoading(false); // force stop spinner after 1.5s
//     }, 500);

//     checkAuth();

//     return () => clearTimeout(timeout); // cleanup
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "https://taskora-main-backend.onrender.com/client/log-out",
//         {},
//         { withCredentials: true }
//       );
//       setUser(null);
//       router.push("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return { user, loading, handleLogout };
// }

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// interface UserProfileResponse {
//   user: {
//     id: string;
//     fullName: string;
//     email: string;
//     mobileNumber: string;
//     profilePicture?: string;
//   };
// }

// export default function useClientAuth() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const checkAuth = async () => {
//     try {
//       const res = await axios.get<UserProfileResponse>(
//         "https://taskora-main-backend.onrender.com/client/profile",
//         {
//           withCredentials: true,
//         }
//       );
//       setUser(res.data.user);
//     } catch (error) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setLoading(false); // fallback timeout
//     }, 1000);

//     checkAuth();

//     return () => clearTimeout(timeout);
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "https://taskora-main-backend.onrender.com/client/log-out",
//         {},
//         { withCredentials: true }
//       );
//       setUser(null);
//       router.push("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//
//   return { user, loading, handleLogout, setUser, setLoading };
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  profilePicture?: string;
}

export default function useClientAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await axios.get<any>(
          "https://taskora-main-backend.onrender.com/client/profile",
          {
            withCredentials: true,
            timeout: 3000,
          }
        );

        if (active && res.data?.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://taskora-main-backend.onrender.com/client/log-out",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { user, loading, handleLogout, setUser, setLoading };
}
