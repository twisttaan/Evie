import { Embed } from "#reacord/main";
import { HenrikAPIRoot } from "#root/constants/index";
import { colors } from "#root/Enums";
import type { ResponseWrapper } from "#root/types/api/APIResponses";
import type {
  AccountData,
  GetHenrikAPI,
  MatchHistoryDataV3,
} from "#root/types/api/Henrik/HenrikValorant";
import { pluralize } from "#root/utils/builders/stringBuilder";
import ShapedMatchHistory from "#root/utils/valorant/ShapedMatchHistory";
import axios from "axios";
import type { User } from "discord.js";
import React, { useEffect, useState } from "react";

export default function ValorantGameStats(props: {
  user: User;
  accountData: AccountData;
}) {
  const [gameStats, setGameStats] =
    useState<ResponseWrapper<ShapedMatchHistory> | null>();

  useEffect(() => {
    axios
      .get<GetHenrikAPI<MatchHistoryDataV3[]>>(
        `${HenrikAPIRoot}/valorant/v3/matches/${props.accountData.region}/${props.accountData.name}/${props.accountData.tag}`
      )
      .then((res) => {
        if (!res.data.data)
          return setGameStats({
            success: false,
          });
        return setGameStats({
          success: true,
          data: new ShapedMatchHistory(res.data.data, props.accountData.puuid),
        });
      })
      .catch(() => {
        setGameStats({
          success: false,
        });
      });
  }, []);

  const a = "➤";
  const l = "\n";
  const { data, success } = gameStats || {};
  const { overview, trackedGames } = data || {};

  return (
    <>
      <Embed
        color={colors.evieGrey}
        title={`${props.accountData.name}#${props.accountData.tag} Game Stats`}
        footer={{
          text:
            success && data && overview && trackedGames
              ? `Tracked from ${trackedGames} ${pluralize(
                  "game",
                  trackedGames
                )}`
              : "Loading...",
        }}
      >
        {!gameStats ? (
          <>
            <>{a} **Loading...**</>
          </>
        ) : success && data && overview ? (
          <>
            {a} **KD**: {overview.kdr}% {l}
            {a} **Win Ratio**: {overview.winRatio}% ({overview.wins}-
            {overview.losses}) {l}
            {a} **Most Played Agent** {overview.agentsUsed[0].agentName} {l}
          </>
        ) : (
          <>
            {a} **Error**:{" "}
            {gameStats.success
              ? "No data found for this account."
              : "An error occurred."}
          </>
        )}
      </Embed>
    </>
  );
}
