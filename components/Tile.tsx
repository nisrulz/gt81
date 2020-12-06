import { Status } from "@components/globalTypes";
import { css } from "@emotion/react";
import Head from "next/head";
import { useEffect, useState } from "react";

const tileStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 4rem;
  font-weight: 900;
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, 0.75);
  font-feature-settings: "tnum", "lnum", "zero", "ss06";

  @media screen and (max-width: 768px) {
    font-size: 3rem;
  }

  .headline {
    font-size: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;

    color: #aaa;

    @media screen and (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  &.status {
    @extend .tile;
    grid-area: status;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    flex-direction: row;
    justify-content: space-between;
  }

  &.hr {
    grid-area: hr;
    font-size: 13em;
    transition: background-color 250ms linear;

    &.60perc {
      background-color: #66d8ff;
    }

    &.70perc {
      background-color: deepskyblue;
    }

    &.80perc {
      background-color: #ff72be;
    }

    &.90perc {
      background-color: deeppink;
    }

    @media screen and (max-width: 768px) {
      font-size: 9rem;
    }
  }

  &.calories {
    grid-area: calories;
  }

  &.grit {
    grid-area: grit;
  }

  &.timer {
    grid-area: timer;
  }
`;

export type TileProps = {
  emoji?: string;
  headline?: string;
  variant: "status" | "hr" | "calories" | "timer" | "grit" | "controls";
  class?: string;
  value?: number | null;
  children?: JSX.Element | string;
};

export const Tile = (props: TileProps): JSX.Element => {
  return (
    <div css={tileStyle} className={[props.variant, props.class].join(" ")}>
      {props.emoji && <div className="headline">{props.emoji}</div>}
      {props.headline && <div className="headline">{props.headline}</div>}
      {!props.children && (
        <div>
          {typeof props.value === "number" ? Math.floor(props.value) : "--"}
        </div>
      )}
      {props.children}
    </div>
  );
};

export const HRTile = (
  props: Pick<TileProps, Exclude<keyof TileProps, "variant">> & {
    percentage: number;
  }
): JSX.Element => {
  const variant = (perc: number): string | undefined => {
    if (perc > 0.6) {
      const value = Math.floor(Math.min(perc, 0.99) * 10) * 10;
      return `${value}perc`;
    }

    return;
  };

  return (
    <Tile
      emoji="❤️"
      headline="heart rate %"
      variant="hr"
      class={variant(props.percentage)}
    >
      <>
        <div>{Math.min(Math.floor(props.percentage * 100), 100)}</div>
        <div style={{ fontSize: "2rem", color: "rgba(255,255,255,0.75))" }}>
          ♥ {Math.floor(props.value || 0)}
        </div>
      </>
    </Tile>
  );
};

export const TimerTile = (props: {
  status: Status;
  timer: number;
}): JSX.Element => {
  const formatTimer = (timer: number): string => {
    const hours = timer / 3600;
    const minutes = (timer % 3600) / 60;
    const seconds = timer % 60;

    return [hours, minutes, seconds]
      .map((i) => Math.floor(i).toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <Tile headline="elapsed time" emoji="⏱" variant="timer">
      <div
        style={
          props.status === "PAUSED"
            ? { animation: "blinker 1s step-start infinite" }
            : {}
        }
      >
        {formatTimer(props.timer)}
      </div>
    </Tile>
  );
};

export const StatusTile = (props: {
  status: Status;
  setConfigModalOpen(status: boolean): void;
  setAboutModalOpen(status: boolean): void;
}): JSX.Element => {
  const [statusText, setStatusText] = useState("");
  const HEADLINE: { [S in Status]: string } = {
    UNCONFIGURED: "Welcome to GT81! Configure your profile to get started",
    OFFLINE: "Connect to your HR monitor",
    CONNECTING: "Connecting...",
    CONNECTED: "Ready! Let's do this 💪",
    RUNNING: "Workout running",
    PAUSED: "Workout paused",
    ENDED: "Workout completed, well done!",
  };

  const buttonCss = css`
    width: 3.5rem;
    height: 3.5rem;
    margin: 0.25rem;
    text-align: center;
    background-color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #222;

    &:hover {
      background-color: #222;
      cursor: pointer;
    }
  `;

  const headlineCss = css`
    text-align: center;

    @media screen and (max-width: 768px) {
      font-size: 1rem;
    }
  `;

  useEffect(() => {
    setStatusText(HEADLINE[props.status]);
  }, [props.status]);

  return (
    <Tile variant="status">
      <>
        <Head>
          <title>{`GT81${statusText && ` | ${statusText}`}`}</title>
        </Head>
        <div onClick={() => props.setAboutModalOpen(true)} css={buttonCss}>
          👋
        </div>
        <div css={headlineCss}>{statusText}</div>
        <div onClick={() => props.setConfigModalOpen(true)} css={buttonCss}>
          ⚙️
        </div>
      </>
    </Tile>
  );
};
