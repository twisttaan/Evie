/* 
Copyright 2022 Team Evie

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as Sentry from "@sentry/node";
import type { Guild } from "discord.js";
import { dbUtils } from ".";

/** Gets the embed color for the specified guild */
async function getEmbedColor(guild: Guild | null): Promise<string> {
  if (!guild) return "#f47fff";
  try {
    const result = await dbUtils.getGuild(guild);
    return result?.color || "#f47fff";
  } catch (error) {
    Sentry.captureException(error);
    return "#f47fff";
  }
}

export const MiscDB = {
  getEmbedColor,
};
