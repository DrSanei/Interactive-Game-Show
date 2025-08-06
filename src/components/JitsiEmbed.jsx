import React, { useRef, useEffect } from "react";

const JITSI_DOMAIN = "meet.jit.si";

export default function JitsiEmbed({
  userType = "admin", // "admin", "player", "watcher"
  roomName = "demo-room",
  startWithAudioMuted = false,
  startWithVideoMuted = false,
  height = 400,
  displayName = "Admin"
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    // Cleanup old iframes
    if (containerRef.current) containerRef.current.innerHTML = "";

    // Only run in browser
    if (window.JitsiMeetExternalAPI && containerRef.current && roomName) {
      const api = new window.JitsiMeetExternalAPI(JITSI_DOMAIN, {
        roomName,
        parentNode: containerRef.current,
        userInfo: { displayName },
        configOverwrite: {
          disableDeepLinking: true,
          startWithAudioMuted,
          startWithVideoMuted,
          // Security settings (optional for host)
        },
        interfaceConfigOverwrite: {
          TILE_VIEW_MAX_COLUMNS: 4,
          // Hide all toolbars/buttons except mic, camera, hangup
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "hangup", "fullscreen"
            // Remove everything else for MVP simplicity
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          DISPLAY_WELCOME_PAGE_CONTENT: false,
          DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
          MOBILE_APP_PROMO: false,
        },
      });

      // Remove "embedding disabled" notification by covering it with a CSS overlay (hacky, but for MVP only)
      setTimeout(() => {
        const iframe = containerRef.current.querySelector("iframe");
        if (iframe) {
          // Insert overlay style into iframe
          try {
            const css = `
              div[style*="background-color: rgb(236, 240, 241)"] {
                display: none !important;
              }
              .notice--danger, .notice { display: none !important; }
            `;
            const style = document.createElement("style");
            style.innerHTML = css;
            iframe.contentWindow.document.head.appendChild(style);
          } catch (err) {
            // SecurityError if cross-origin, just ignore (demo only)
          }
        }
      }, 2500);

      return () => api.dispose();
    }
  }, [roomName, userType, displayName, startWithAudioMuted, startWithVideoMuted]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        borderRadius: "14px",
        minHeight: 300,
        overflow: "hidden",
        background: "#181d25"
      }}
      id="jitsi-container"
    />
  );
}
