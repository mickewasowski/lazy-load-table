import React, { useRef, useState, useEffect } from "react";
import { data as info } from "./dummy";
import "./Leaderboard.css";

const STEP = 10;
type Row = {
  position: number;
  [key: string]: unknown;
};

export default function Leaderboard({
  tournamentId,
}: {
  tournamentId: number;
}) {
  const [data, setData] = useState<Row[]>([]);
  const [loadingTop, setLoadingTop] = useState(false); //show loader on top
  const [loadingBottom, setLoadingBottom] = useState(false); // show loader at the bottom
  const bodyRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    const initialData = info.slice(0, STEP);
    setData(initialData);
    setLoadingBottom(false);
  }, [tournamentId]);

  useEffect(() => {
    const container = bodyRef.current;
    if (!container) return;

    if (loadingTop) {
      container.scroll({
        top: 0,
        behavior: "smooth",
      });
    } else if (loadingBottom) {
      container.scroll({
        top: container.offsetHeight,
        behavior: "smooth",
      });
    }
  }, [loadingTop, loadingBottom]);

  const handleLoadMoreEntries = (direction: "top" | "bottom") => {
    //TODO: do i need this?
    if (loadingTop || loadingBottom) return;

    if (!bodyRef.current) return;

    setTimeout(() => {
      const position = data[data.length / 2].position;
      // based on the state get the correct elements
      // the below is the actual request I'd have to make
      // loadingBottom means positive count   fetchData(tournamentId, position, STEP);
      // loadingTop means negavite count    fetchData(tournamentId, position, -STEP);

      // this is only for testing
      let newData: Row[] = [];
      if (direction === "top") {
        // get prev data
        const positionBack = position - 1 - STEP;
        const start = positionBack < 0 ? 0 : positionBack;
        if (start === 0 && info[0].position === 0) return;
        newData = info.slice(start, start + STEP);
        setLoadingTop(false);
      } else if (direction === "bottom") {
        // get next data
        newData = info.slice(position - 1, position - 1 + STEP);
        setLoadingBottom(false);
      }

      setData(newData);
    }, 2000);
  };

  const handleOverscrollDesktop = (e) => {
    const el = bodyRef.current;
    if (!el) return;

    if (loadingTop || loadingBottom) return;

    const THRESHOLD = 2; // or 1, depending on your content

    const atTop = el.scrollTop === 0;
    const atBottom =
      Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < THRESHOLD;

    if (atTop && e.deltaY < 0) {
      // User is at the top and tries to scroll up
      console.log("Tried to overscroll at top");
      setLoadingTop(true);
      handleLoadMoreEntries("top");
    } else if (atBottom && e.deltaY > 0) {
      // User is at the bottom and tries to scroll down
      console.log("Tried to overscroll at bottom");
      setLoadingBottom(true);
      handleLoadMoreEntries("bottom");
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    const el = bodyRef.current;
    if (!el) return;

    if (loadingTop || loadingBottom) return;
    if (startYRef.current === null) return;

    const THRESHOLD = 2;

    const atTop = el.scrollTop === 0;
    const atBottom =
      Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < THRESHOLD;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    // At top and swiping down (deltaY > 0)
    if (atTop && deltaY > 0) {
      console.log("Tried to overscroll at top (touch)");
      setLoadingTop(true);
      handleLoadMoreEntries("top");
      startYRef.current = null; // Prevent repeated triggers
    }
    // At bottom and swiping up (deltaY < 0)
    else if (atBottom && deltaY < 0) {
      console.log("Tried to overscroll at bottom (touch)");
      setLoadingBottom(true);
      handleLoadMoreEntries("bottom");
      startYRef.current = null; // Prevent repeated triggers
    }
  };

  const handleTouchEnd = () => {
    startYRef.current = null;
  };

  return (
    <div className="leaderboard-container">
      <h2>Tournament Leaderboard</h2>
      <div className="table">
        <div className="header row">
          <div className="cell">Position</div>
          <div className="cell">Name</div>
          <div className="cell">Score</div>
        </div>
        <div
          className="body"
          ref={bodyRef}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleOverscrollDesktop}
          tabIndex={0}
        >
          {loadingTop && (
            <div className="row skeleton">
              <div className="cell skeleton-cell"></div>
              <div className="cell skeleton-cell"></div>
              <div className="cell skeleton-cell"></div>
            </div>
          )}
          {data.map((entry, index) => (
            <div
              className={`row ${index === data.length - 1 ? "row--last" : ""}`}
              key={entry.position}
              data-pos={entry.position}
            >
              <div className="cell">{entry.position}</div>
              <div className="cell">{entry.text}</div>
              <div className="cell">{entry.score}</div>
            </div>
          ))}
          {loadingBottom && (
            <div className="row skeleton">
              <div className="cell skeleton-cell"></div>
              <div className="cell skeleton-cell"></div>
              <div className="cell skeleton-cell"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
