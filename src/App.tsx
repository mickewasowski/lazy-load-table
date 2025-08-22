import { useEffect, useState } from "react";
import { data } from "./dummy";
import "./App.css";

type Row = {
  position: number;
  text: string;
};

const step = 10 as const;

function App() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (rows.length === 0) {
      const newRows: Row[] = data.slice(0, step);
      setRows(newRows);
    }
  }, []);

  const handleClick = () => {
    //TODO: kinda what I'd actually have to do
    const position = rows[rows.length / 2 - 1].position;
    const newData = data.slice(position, position + step);
    setRows(newData);
  };

  return (
    <div>
      <table
        style={{
          backgroundColor: "rgba(23, 255, 111, 0.3)",
          width: "200px",
          borderCollapse: "collapse",
          border: "2px solid black",
        }}
      >
        <thead style={{ display: "block" }}>
          <tr>
            <th style={{ height: "40px", lineHeight: "40px" }}>Position</th>
            <th style={{ height: "40px", lineHeight: "40px" }}>Text</th>
          </tr>
        </thead>
        <tbody
          style={{
            display: "block",
            height: "70px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {rows.map(({ position, text }, index) => {
            return (
              <tr key={index}>
                <td>{position}</td>
                <td>{text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button onClick={handleClick}>change</button>
    </div>
  );
}

export default App;
