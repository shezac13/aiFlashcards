import { App, PluginSettingTab, Setting } from 'obsidian';
import AIFlashcards from 'src/main';
export interface AIFlashcardsPluginSettings {
	apiEndpoint: string;
	apiKey: 'none' | 'local' | 'remote';
}

export const DEFAULT_SETTINGS: AIFlashcardsPluginSettings = {
	apiEndpoint: 'default',
	apiKey: 'none',
};

export class AIFlashcardsSettingTab extends PluginSettingTab {
	private plugin: AIFlashcards;

	constructor(app: App, plugin: AIFlashcards) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('API endpoint')
			.setDesc('Set your API endpoint for the AI model')
			.addText((text) =>
				text
					.setPlaceholder('Enter your API endpoint')
					.setValue(this.plugin.settings.apiEndpoint)
					.onChange(async (value) => {
						this.plugin.settings.apiEndpoint = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Local AI')
			.setDesc('Use a local AI model instead of a remote API')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.apiKey === 'local')
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value ? 'local' : 'none';
						await this.plugin.saveSettings();
						this.display();
					}),
			);

		new Setting(containerEl)
			.setName('Cloud AI')
			.setDesc('Use a remote AI model instead of a local one')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.apiKey === 'remote')
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value ? 'remote' : 'none';
						await this.plugin.saveSettings();
						this.display();
					}),
			);
	}
}
