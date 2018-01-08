"use strict";

const React = require("react");
const data = require("./logo.json");

const colors = ["#56B3B4", "#EA5E5E", "#F7BA3E", "#BF85BF"];

const { total, lines } = data;

// Some manual CSS injection.
const dashStyle = `
.dash {
  stroke: #4D616E;
  stroke-linecap: round;
  stroke-width: 10;
  transition-timing-function: cubic-bezier(0.43, 0.12, 0.44, 1);
  transition-property: stroke-dashoffset;
  transition-duration: 0.9s;
  opacity: 0.5;
}
`;

const linesStyles = lines
  .map((_, i) => `.l${i} .dash { transition-delay: ${70 * i}ms; }`)
  .join("\n");

const dashesStyles = lines
  .map(({ dashes, initialOffset }, row) =>
    dashes
      .map(
        ({ length, start }, index) =>
          `
.l${row} .p${index} {
  stroke-dasharray: ${`${length},${total - length}`};
  stroke-dashoffset: ${-start};
}
.initial .l${row} .p${index} { stroke-dashoffset: ${-start - initialOffset}; }
`
      )
      .join("\n")
  )
  .join("\n");

const colorsStyles = colors
  .map((c, i) => `.c${i + 1} { stroke: ${c}; opacity: 1; }`)
  .join("\n");

const styles = [dashStyle, linesStyles, dashesStyles, colorsStyles].join(
  "\n\n"
);

const Dash = ({ color, index, row, total }) => (
  <path
    className={`dash p${index} c${color}`}
    d={`m 5 ${row * 20 + 5} l ${total} 0`}
  />
);

const Line = ({ row, dashes, total }) => (
  <g className={`l${row}`}>
    {dashes.map((props, index) => (
      <Dash {...props} total={total} key={index} index={index} row={row} />
    ))}
  </g>
);

const Logo = ({ active }) => {
  const height = lines.length * 20;
  const width = total;
  return (
    <div>
      <style type="text/css" dangerouslySetInnerHTML={{ __html: styles }} />
      <svg
        id="animatedLogo"
        className="initial"
        height={height}
        width={width}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
      >
        {lines.map(({ dashes }, row) => (
          <Line key={row} total={total} dashes={dashes} row={row} />
        ))}
      </svg>
    </div>
  );
};

module.exports = Logo;
