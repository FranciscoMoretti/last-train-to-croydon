import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useQueries } from "@tanstack/react-query";
import { JourneyResponse } from "./api-types";
import { HotkeysProvider } from "@blueprintjs/core";
import { Column, Table2, Cell } from "@blueprintjs/table";

function getJourneys(
  from: string,
  to: string,
  departTime: string
): Promise<JourneyResponse> {
  return fetch(
    `https://api.tfl.gov.uk/Journey/JourneyResults/${from}/to/${to}?mode=national-rail&time=${departTime}&timeIs=departing`
  ).then((res) => res.json());
}

const HOURS = ["2000", "2100", "2200", "2300"];

function App() {
  const [count, setCount] = useState(0);
  const from = "1004756";
  const to = "1001089"; // East Croydon

  const queries = useQueries({
    queries: HOURS.map((hour) => ({
      queryKey: [`journeys-${hour}`],
      queryFn: () => getJourneys(from, to, hour),
    })),
  });

  if (queries.some((result) => result.isLoading)) return "Loading...";

  if (queries.some((result) => result.error)) return "An error has occurred";

  const journeys = queries.flatMap((result) => result.data?.journeys);
  console.log(journeys);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <HotkeysProvider>
        <Table2 numRows={journeys.length}>
          <Column
            name="Depart time"
            cellRenderer={(rowIdx) => (
              <Cell>
                {new Date(journeys[rowIdx].startDateTime).toTimeString()}
              </Cell>
            )}
          />
          <Column
            name="Arrival Time"
            cellRenderer={(rowIdx) => (
              <Cell>
                {new Date(journeys[rowIdx].arrivalDateTime).toTimeString()}
              </Cell>
            )}
          />
          <Column
            name="Duration"
            cellRenderer={(rowIdx) => (
              <Cell>{`${journeys[rowIdx].duration} min`}</Cell>
            )}
          />
        </Table2>
      </HotkeysProvider>
      ,<h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
