/** @format */

import { Context, Scenes } from "telegraf";

interface ExtWizardSession extends Scenes.WizardSessionData {
	promocode: string; // к примеру
}
interface SessionData extends Scenes.WizardSession<ExtWizardSession> {
	last_message_id: number | undefined;
}

export interface IBotContext extends Context {
	session: SessionData;
	scene: Scenes.SceneContextScene<IBotContext, ExtWizardSession>;
	wizard: Scenes.WizardContextWizard<IBotContext>;
}
