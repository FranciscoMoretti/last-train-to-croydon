import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import { JourneyResponse } from "./api-types";
import { HotkeysProvider } from "@blueprintjs/core";
import { Column, Table2, Cell } from "@blueprintjs/table";

export type CellLookup = (rowIndex: number, columnIndex: number) => any;

export type SortCallback = (
  columnIndex: number,
  comparator: (a: any, b: any) => number
) => void;

export interface SortableColumn {
  getColumn(
    getCellData: CellLookup,
    sortColumn: SortCallback
  ): React.JSX.Element;
}

function getJourneys(
  from: string,
  to: string,
  departTime: string
): Promise<JourneyResponse> {
  return fetch(
    `https://api.tfl.gov.uk/Journey/JourneyResults/${from}/to/${to}?mode=national-rail&time=${departTime}&timeIs=departing`
  ).then((res) => res.json());
}

function App() {
  const [count, setCount] = useState(0);
  const from = "1004756";
  const to = "1001089"; // East Croydon

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["journeys"],
    queryFn: async ({ pageParam }) => await getJourneys(from, to, pageParam),
    initialPageParam: "2000",
    getNextPageParam: (lastPage, allPages) => {
      // Return next page number or null if there are no more hours
      const nextPageIndex = allPages.length;
      const lastJourney = lastPage.journeys[lastPage.journeys.length - 1];
      const lastStartDate = new Date(lastJourney.startDateTime);

      return lastStartDate.getDay() == new Date().getDay()
        ? (
            lastStartDate.getHours() * 100 +
            lastStartDate.getMinutes() +
            1
          ).toString()
        : null;
    },
  });
  const journeys = data ? data.pages.flatMap((page) => page.journeys) : [];

  useEffect(() => {
    if (journeys.length) {
      if (
        new Date(journeys[journeys.length - 1].startDateTime).getDay() ==
        new Date().getDay()
      ) {
        fetchNextPage();
      }
    }
  }, [journeys, fetchNextPage]);

  if (!data) return "Loading...";
  if (error) return "An error has occurred";

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
      {/* <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "Nothing more to load"}
      </button> */}
    </>
  );
}

export default App;
