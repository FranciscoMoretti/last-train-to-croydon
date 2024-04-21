import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Journey, JourneyResponse } from "./api-types";
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

function App() {
  const [lastTrain, setLastTrain] = useState("");
  const from = "1004756"; // London Bridge
  const to = "1001089"; // East Croydon
  const now = new Date();

  const { data, fetchNextPage, error } = useInfiniteQuery({
    queryKey: ["journeys"],
    queryFn: async ({ pageParam }) => await getJourneys(from, to, pageParam),
    initialPageParam: String(now.getHours() * 100 + now.getMinutes()),
    getNextPageParam: (lastPage) => {
      // Return next page number or null if there are no more hours
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
  const journeys = useMemo(() => {
    return data
      ? data.pages.flatMap((page) => (page as { journeys: Journey[] }).journeys)
      : [];
  }, [data]);

  useEffect(() => {
    if (journeys.length) {
      if (
        new Date(journeys[journeys.length - 1].startDateTime).getDay() ==
        new Date().getDay()
      ) {
        fetchNextPage();
      } else {
        if (!lastTrain) {
          const lastJourney = journeys
            .slice()
            .reverse()
            .find(
              (journey) =>
                new Date(journey.startDateTime).getDay() == new Date().getDay()
            );
          if (lastJourney) {
            const starTime = new Date(lastJourney.startDateTime);
            setLastTrain(dateToHHmm(starTime));
          }
        }
      }
    }
  }, [journeys, fetchNextPage, lastTrain]);

  if (!data) return "Loading...";
  if (error) return "An error has occurred";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        textAlign: "start",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "semibold",
          }}
        >
          London Bridge to East Croydon
        </h1>
        <p
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
          }}
        >{`Last Train: ${lastTrain ? lastTrain : "..."}`}</p>
      </div>
      <h2>Next trains</h2>
      <Table2 numRows={journeys.length}>
        <Column
          name="Depart time"
          cellRenderer={(rowIdx) => (
            <Cell>{dateToHHmm(new Date(journeys[rowIdx].startDateTime))}</Cell>
          )}
        />
        <Column
          name="Arrival Time"
          cellRenderer={(rowIdx) => (
            <Cell>
              {dateToHHmm(new Date(journeys[rowIdx].arrivalDateTime))}
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
    </div>
  );
}

export default App;
function dateToHHmm(startTime: Date) {
  return `${startTime.toTimeString().split(" ")[0]}`;
}
