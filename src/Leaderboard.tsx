import React, { useRef, useState, useEffect } from "react";
import { data as info } from "./dummy";
import "./Leaderboard.css";

const STEP = 10;
const BUFFER_ROWS = 1;

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
  const [loading, setLoading] = useState(false);
  // const [scrollLock, setScrollLock] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialData = info.slice(0, STEP);
    setData(initialData);
    setLoading(false);
  }, [tournamentId]);

  const handleLoadMoreEntries = () => {
    if (loading) return;
    if (!bodyRef.current) return;

    const container: HTMLDivElement = bodyRef.current;
    const row: HTMLDivElement = container.querySelector(
      ".row--last"
    ) as HTMLDivElement;

    const rowRect = row.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const isVisible = rowRect.bottom <= containerRect.bottom && rowRect.top >= containerRect.top;

    if (!isVisible) return;

    const oldRowOffsetTop = row.offsetTop;
    const newRowOffsetTop = oldRowOffsetTop / 2;
    const delta = newRowOffsetTop - oldRowOffsetTop;
    setLoading(true);
    console.log('before', container.scrollTop);
    // container.scrollTop += 4 * BUFFER_ROWS * row.offsetHeight;
    // console.log('after', container.scrollTop);

    setTimeout(() => {
      setLoading(false);
      const entry = data[data.length / 2].position;
      const newData = info.slice(entry - 1, entry - 1 + STEP);
      setData(newData);
      container.scrollTop += delta;
    }, 2000);
  }

  const handleScroll = async () => {
    // if (loading || scrollLock) return;
    // if (!bodyRef.current) return;
    //
    // const container: HTMLDivElement = bodyRef.current;
    // const row: HTMLDivElement = container.querySelector(
    //   ".row--last"
    // ) as HTMLDivElement;
    //
    // const rowRect = row.getBoundingClientRect();
    // const containerRect = container.getBoundingClientRect();
    // const isVisible = rowRect.bottom <= containerRect.bottom && rowRect.top >= containerRect.top;
    //
    // if (!isVisible) return;
    //
    // const oldRowOffsetTop = row.offsetTop;
    // const newRowOffsetTop = oldRowOffsetTop / 2;
    // const delta = newRowOffsetTop - oldRowOffsetTop;
    // setLoading(true);
    // container.scrollTop += 2 * BUFFER_ROWS * row.offsetHeight;
    //
    // setTimeout(() => {
    //   setLoading(false);
    //   const entry = data[data.length / 2].position;
    //   const newData = info.slice(entry - 1, entry - 1 + STEP);
    //   setData(newData);
    //   container.scrollTop += delta;
    // }, 2000);
    
    // const buffer = rowHeight * BUFFER_ROWS;

    // if (
    //   container.scrollTop + container.clientHeight >=
    //   container.scrollHeight - buffer
    // ) {
    //   setLoading(true);
    //
    //   const middleIdx = Math.floor(data.length / 2);
    //   const middlePosition = data[middleIdx]?.position || 1;
    //
    //   const rows = container.querySelectorAll(".row");
    //   const middleRow = rows[middleIdx];
    //   const middleRowOffset = middleRow
    //     ? middleRow.getBoundingClientRect().top -
    //       container.getBoundingClientRect().top
    //     : 0;
    //
    //   const newData = info.slice(middleIdx - 1, middleIdx - 1 + STEP);
    //
    //   setScrollLock(true);
    //   setData(newData);
    //
    //   setTimeout(() => {
    //     const newRows = container.querySelectorAll(".row");
    //     const newMiddleIdx = Math.floor(newData.length / 2);
    //     const newMiddleRow = newRows[newMiddleIdx];
    //     const newMiddleRowOffset = newMiddleRow
    //       ? newMiddleRow.getBoundingClientRect().top -
    //         container.getBoundingClientRect().top
    //       : 0;
    //
    //     container.scrollTop += newMiddleRowOffset - middleRowOffset;
    //     setScrollLock(false);
    //     setLoading(false);
    //   }, 0);
    // }
  };

  //TODO: probably it would be better to have two separate handlers for each event
  // also maybe check if you're on a mobile device
  const handleOverscroll = (e) => {
    //touchmove => mobile
    const el = bodyRef.current;
    const atTop = el.scrollTop === 0;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

    if (e.touches && ((atTop && e.touches[0].clientY > 0) || 
        (atBottom && e.touches[0].clientY < 0))) {
      console.log('User is trying to overscroll');
    }

    //wheel => desktop
    const before = el.scrollTop;
    el.scrollTop += e.deltaY;
    if (el.scrollTop === before) {
      console.log('Tried to scroll past bounds');

      // call the function here
      handleLoadMoreEntries();
    }
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
          onScroll={handleScroll}
          onTouchMove={handleOverscroll}
          onWheel={handleOverscroll}
          tabIndex={0}
        >
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
          {loading &&
            Array.from({ length: BUFFER_ROWS }).map((_, i) => (
              <div className="row skeleton" key={`skeleton-${i}`}>
                <div className="cell skeleton-cell"></div>
                <div className="cell skeleton-cell"></div>
                <div className="cell skeleton-cell"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
