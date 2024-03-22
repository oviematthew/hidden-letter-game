import * as React from "react";

export default function Cell({ row, col, isHidden, letter }) {
  return <div className="cell">{letter}</div>;
}
