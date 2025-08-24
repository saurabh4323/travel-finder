"use client";
export default function Counter() {
  let count = 0;
  const handleClick = () => {
    count++;
    document.getElementById("cv").innerText = count;
  };
  const handleClickk = () => {
    count--;
    document.getElementById("cv").innerText = count;
  };
  return (
    <div>
      <button onClick={handleClick} style={{ backgroundColor: "green" }}>
        +1
      </button>
      <span id="cv" style={{ backgroundColor: "red" }}>
        0
      </span>{" "}
      <button onClick={handleClickk} style={{ backgroundColor: "yellow" }}>
        -1
      </button>
    </div>
  );
}
