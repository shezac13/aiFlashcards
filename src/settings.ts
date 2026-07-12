import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';

export interface AIFLashcardsPluginSettings {
	mySetting: string;
	api: string;
}

export const DEFAULT_SETTINGS: AIFLashcardsPluginSettings = {
	mySetting: 'default',
	api: 'default',
};

export class AIFLashcardsSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('API Endpoint')
			.setDesc("Set your API endpoint for the AI model")
			.addText((text) =>
				text
					.setPlaceholder('Enter your API endpoint')
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Local AI')
			.setDesc("Use local AI model instead of remote API")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.api === 'local')
					.onChange(async (value) => {
						this.plugin.settings.api = value ? 'local' : 'remote';
						await this.plugin.saveSettings();
					}),
			);
	}
}
