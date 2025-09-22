// src/hooks/useFirebaseMessaging.ts
import { useEffect, useRef } from "react";
import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

export const useFirebaseMessaging = () => {
  const listenerSet = useRef(false); // Prevent multiple listeners

  useEffect(() => {
    const requestPermission = async () => {
        console.log("1 useFirbaseMessaing called");
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Notification permission granted.");
   
          // Get FCM token
          const currentToken = await getToken(messaging, {
            vapidKey: "BIrqu-G8cdBfGaxbvCwBTfPYuFxcOqCQBfbDqcN1zy_e_lpxej2ehbjjmrAwq1PcjqrOFnsqj_IcpN2ssSbp-jo",
          });

          if (currentToken) {
            console.log("FCM Token (for testing):", currentToken);
          } else {
            console.log("No registration token available.");
          }
        } else {
          console.log("Notification permission denied.");
        }
      } catch (err) {
        console.error("Error retrieving token:", err);
      }
    };

    requestPermission();

    if (!listenerSet.current) {
      // Listen to foreground messages
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        toast.info(
          `${payload.notification?.title || "Notification"}: ${payload.notification?.body || ""}`,
          { position: "top-right", autoClose: 5000 }
        );
      });

      listenerSet.current = true;

      // Cleanup
      return () => {
        unsubscribe();
        listenerSet.current = false;
      };
    }
  }, []);
};
