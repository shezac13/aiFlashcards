import { App, PluginSettingTab, Setting } from 'obsidian';
import AIFlashcards from './main';

export interface AIFlashcardsPluginSettings {
	mySetting: string;
	api: 'none' | 'local' | 'remote';
}

export const DEFAULT_SETTINGS: AIFlashcardsPluginSettings = {
	mySetting: 'default',
	api: 'none',
};

export class AIFlashcardsSettingTab extends PluginSettingTab {
	private plugin: AIFlashcards;

	constructor(
		app: App, 
		plugin: AIFlashcards
	) {
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
			.setDesc('Use a local AI model instead of a remote API')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.api === 'local')
					.onChange(async (value) => {
						this.plugin.settings.api = value ? 'local' : 'none';
						await this.plugin.saveSettings();
						this.display();
					}),
			);

		new Setting(containerEl)
			.setName('Cloud AI')
			.setDesc('Use a remote AI model instead of a local one')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.api === 'remote')
					.onChange(async (value) => {
						this.plugin.settings.api = value ? 'remote' : 'none';
						await this.plugin.saveSettings();
						this.display();
					}),
			);
	}
}
