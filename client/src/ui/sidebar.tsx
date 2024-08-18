"use client"

import { connectWebsocket } from "@/lib/ws";
import { IPostData } from "@/types/types";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import ClearNotifications from "./clear-notifications";

const localData = localStorage.getItem("tiktok_user_login");
let socket: WebSocket | null = null;
let userData: any;

if (localData) {
  const userData = JSON.parse(localData);
  socket = connectWebsocket(userData.token)
}

export default function Sidebar() {
  const [notifications, setNotifications] = useState<IPostData[]>([]);
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("tiktok_user_login"));

  useEffect(() => {
    let intervalId: any;

    
    if (loggedIn) {
      intervalId = setInterval(() => { 
        console.log("Checking for notifications...");
        const prevNotifications = localStorage.getItem("notifications");
        
        if (prevNotifications) {
          setNotifications(JSON.parse(prevNotifications));
        }

        
        // Check if WebSocket is not open and reconnect if necessary
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          const parsedData = JSON.parse(loggedIn);
          console.log("WebSocket is not open, reconnecting...");
          socket = connectWebsocket(parsedData.token);
        }
      }, 1000);
    } else {
      setLoggedIn(localStorage.getItem("tiktok_user_login"));
    }

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <section 
      id="sidebar" 
      className="w-1/4 h-auto p-4 bg-zinc-900"
    >
      <div className="sidebar-stack mb-6">
        <p className="subheading-text">Navigation</p>
        
        <Link href="/">
          <p className="nav-link">All Posts</p>
        </Link>

        <Link href="/posts/create-post">
          <p className="nav-link">Create Post</p>
        </Link>
      </div>

      <div className="sidebar-stack">
        <p className="subheading-text">Notifications</p>
        
        <ClearNotifications />
        
        {
          loggedIn ? (
            notifications.length > 0 ? 
              notifications.map((notification, index) => (
                <div key={index} className="flex flex-col">
                  <h3>{notification.title}</h3>
                  <p>{notification.content}</p>
                  <small>{notification.user_name}</small>
                  <small>{notification.created_at}</small>
                </div>
              )) 
            :
              <p className="notification">No notifications D:</p>
            )
          :
          <p className="notification">You must be logged in to get notifications!</p>
        }
      </div>
    </section>
  )
}