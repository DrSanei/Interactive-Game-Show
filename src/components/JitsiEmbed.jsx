import React, { useRef, useEffect } from "react";
const JITSI_DOMAIN = "meet.jit.si";

export default function JitsiEmbed({ userType, roomName, startWithAudioMuted = false, startWithVideoMuted = false }) {
  const jitsiContainer = useRef(null);

  useEffect(() => {
    if (window.JitsiMeetExternalAPI && jitsiContainer.current && roomName) {
      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName,
        parentNode: jitsiContainer.current,
        userInfo: { displayName: userType },
        configOverwrite: {
          startWithAudioMuted,
          startWithVideoMuted,
        },
        interfaceConfigOverwrite: {
          TILE_VIEW_MAX_COLUMNS: 4,
        },
      });
      return () => api.dispose();
    }
  }, [userType, roomName, startWithAudioMuted, startWithVideoMuted]);

  return <div ref={jitsiContainer} style={{ height: "500px", width: "100%" }} />;
}
