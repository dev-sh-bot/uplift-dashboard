import { useEffect } from "react";
import Pusher from "pusher-js";
import { useSelector } from "react-redux";
import { selectUser } from "../reducers/authSlice";
import { triggerToast } from "../utils/helper";

const Notification = () => {
  const user = useSelector(selectUser)

  useEffect(() => {
    if (!user) return; // Ensure user is available before proceeding

    // Initialize Pusher with the correct app key and configuration
    const pusher = new Pusher("241ac235018673f40eed", {
      cluster: "ap2",
      forceTLS: true,
      authEndpoint: "https://eeman.zetdigi.com/api/broadcasting/auth", // Correct URL for authentication
      auth: {
        headers: {
          Authorization: `Bearer ${user.access_token}`, // Ensure the token is correctly set
        },
      },
    });

    const channelName = "private-notification." + user.userInfo.id; // Ensure to use the correct channel name

    // Subscribe to the private channel (Note: private channels are prefixed with 'private-')
    const channel = pusher.subscribe(channelName); // Ensure 'private-' is added

    // Log when subscribed
    console.log("Subscribed to channel:", channelName);

    // Listen for the 'NotificationSent' event on the channel
    channel.bind("NotificationSent", function (data) {
      console.log("API message received:", data);
      triggerToast(data.message, 'success');
    });

    // Clean up on component unmount
    return () => {
      console.log("Unsubscribing from channel");
      pusher.unsubscribe(channelName); // Ensure to unsubscribe from the correct channel
      pusher.disconnect(); // Disconnect Pusher when the component unmounts
      console.log("Pusher disconnected");
    };
  }, [user]);
};

export default Notification;