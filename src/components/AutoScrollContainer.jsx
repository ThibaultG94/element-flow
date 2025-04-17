import React, { useEffect, useRef } from "react";

const AutoScrollContainer = ({
  children,
  className = "",
  scrollBehavior = "smooth",
  scrollToBottomOnChange = true,
  scrollThreshold = 100, // distance from bottom from which auto-scroll is enabled
}) => {
  const containerRef = useRef(null);
  const previousHeightRef = useRef(0);

  // Scroll down function
  const scrollToBottom = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Decide whether to scroll automatically
  const shouldAutoScroll = () => {
    if (!containerRef.current) return false;

    const container = containerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      scrollThreshold;

    return isNearBottom;
  };

  // Observe changes in content
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const currentHeight = container.scrollHeight;

    // If the content has changed and you're close to the bottom, scroll down.
    if (
      currentHeight > previousHeightRef.current &&
      (shouldAutoScroll() || scrollToBottomOnChange)
    ) {
      scrollToBottom();
    }

    previousHeightRef.current = currentHeight;
  }, [children, scrollToBottomOnChange]);

  // Configure the mutation observer to monitor DOM changes
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Create an observer that detects changes in the container
    const observer = new MutationObserver(() => {
      const currentHeight = container.scrollHeight;

      if (currentHeight > previousHeightRef.current && shouldAutoScroll()) {
        scrollToBottom();
      }

      previousHeightRef.current = currentHeight;
    });

    // Observe sub-tree changes (addition/deletion of elements)
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Scroll to initial setup if required
    if (scrollToBottomOnChange) {
      scrollToBottom();
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      style={{ scrollBehavior }}
    >
      {children}
    </div>
  );
};

export default AutoScrollContainer;
