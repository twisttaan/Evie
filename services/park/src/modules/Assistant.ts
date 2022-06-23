import { captureException } from "@sentry/node";
import { googleAssistantCredentials } from "environment";
import { Puppeteer } from "modules";
import {
  Assistant as GAssistant,
  AssistantLanguage,
  AudioOutEncoding,
} from "nodejs-assistant";

export class Assistant {
  private assistant: GAssistant | null = null;

  public constructor() {
    if (!googleAssistantCredentials) return;
    this.assistant = new GAssistant(
      /* required credentials */ {
        type: "authorized_user",
        client_id: googleAssistantCredentials.client_id,
        client_secret: googleAssistantCredentials.client_secret,
        refresh_token: googleAssistantCredentials.refresh_token,
      },
      /* additional, optional options */ {
        locale: AssistantLanguage.ENGLISH, // Defaults to AssistantLanguage.ENGLISH (en-US)
        deviceId: "your device id",
        deviceModelId: "teamevie-evie-zfe5t2",
      }
    );
  }

  public async ask(query: string) {
    if (!this.assistant) throw new Error("Google Assistant not configured.");

    const response = await this.assistant.query(query, {
      audioOutConfig: {
        encoding: AudioOutEncoding.MP3,
        sampleRateHertz: 16000,
        volumePercentage: 100,
      },
    });

    if (!response.html) throw new Error("No response from Google Assistant.");

    try {
      const html = response.html.replace(
        "<html>",
        `<html style="background-image: url('https://evie.pw/assets/Banner.png')">`
      );
      const image = await Puppeteer.RenderHTML(html);
      return { image, audio: response.audio };
    } catch (e) {
      captureException(e);
      throw e;
    }
  }
}
