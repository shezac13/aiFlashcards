import { App, PluginSettingTab, Setting } from 'obsidian';
import type AIFlashcards from 'src/main';

export type AIProviderType = 'unconfigured' | 'cloud' | 'local';

export interface AIFlashcardsPluginSettings {
	providerType: AIProviderType;
	providerName: string;
	modelName: string;
	apiKey: string;
	baseUrl: string;
	localModelPath: string;
	sourceFolders: string[];
	includeSubfolders: boolean;
	excludeRules: string[];
	maxCardsPerRun: number;
	maxSourceCharacters: number;
	temperature: number;
}

export const DEFAULT_SETTINGS: AIFlashcardsPluginSettings = {
	providerType: 'unconfigured',
	providerName: '',
	modelName: '',
	apiKey: '',
	baseUrl: '',
	localModelPath: '',
	sourceFolders: [],
	includeSubfolders: true,
	excludeRules: [],
	maxCardsPerRun: 10,
	maxSourceCharacters: 12000,
	temperature: 0.2,
};

export function getProviderLabel(settings: AIFlashcardsPluginSettings): string {
	if (settings.providerType === 'cloud') {
		return settings.providerName || 'Cloud AI';
	}

	if (settings.providerType === 'local') {
		return settings.providerName || 'Local AI';
	}

	return 'Not configured';
}

function parseListValue(value: string): string[] {
	return value
		.split(/[\n,]/)
		.map((item) => item.trim())
		.filter(Boolean);
}

export class AIFlashcardsSettingTab extends PluginSettingTab {
	private readonly plugin: AIFlashcards;

	constructor(app: App, plugin: AIFlashcards) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'AI Flashcards settings' });

		new Setting(containerEl)
			.setName('Provider type')
			.setDesc(
				'Choose whether generation uses a cloud API or a local model.',
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption('unconfigured', 'Not configured')
					.addOption('cloud', 'Cloud AI')
					.addOption('local', 'Local AI')
					.setValue(this.plugin.settings.providerType)
					.onChange(async (value) => {
						this.plugin.settings.providerType =
							value as AIProviderType;
						await this.plugin.saveSettings();
						this.display();
					}),
			);

		new Setting(containerEl)
			.setName('Provider name')
			.setDesc('A display name for the configured provider.')
			.addText((text) =>
				text
					.setPlaceholder('OpenAI, Claude, Ollama, LM Studio')
					.setValue(this.plugin.settings.providerName)
					.onChange(async (value) => {
						this.plugin.settings.providerName = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Model name')
			.setDesc('The exact model identifier sent to the provider.')
			.addText((text) =>
				text
					.setPlaceholder('gpt-4.1-mini, claude-3-5-sonnet')
					.setValue(this.plugin.settings.modelName)
					.onChange(async (value) => {
						this.plugin.settings.modelName = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('API key or token')
			.setDesc(
				'Used for cloud providers; leave empty for local models that do not require auth.',
			)
			.addText((text) =>
				text
					.setPlaceholder('sk-...')
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Base URL')
			.setDesc('Optional custom API base URL or local endpoint.')
			.addText((text) =>
				text
					.setPlaceholder(
						'https://api.openai.com/v1/chat/completions',
					)
					.setValue(this.plugin.settings.baseUrl)
					.onChange(async (value) => {
						this.plugin.settings.baseUrl = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Local model path')
			.setDesc(
				'Optional local model identifier or path for offline setups.',
			)
			.addText((text) =>
				text
					.setPlaceholder('/path/to/model or local model name')
					.setValue(this.plugin.settings.localModelPath)
					.onChange(async (value) => {
						this.plugin.settings.localModelPath = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Source folders')
			.setDesc('Comma or newline separated vault folders used as input.')
			.addTextArea((text) =>
				text
					.setPlaceholder('Notes\nLearning')
					.setValue(this.plugin.settings.sourceFolders.join('\n'))
					.onChange(async (value) => {
						this.plugin.settings.sourceFolders =
							parseListValue(value);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Include subfolders')
			.setDesc('When enabled, source folders include all nested folders.')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.includeSubfolders)
					.onChange(async (value) => {
						this.plugin.settings.includeSubfolders = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Exclude rules')
			.setDesc('Comma or newline separated path fragments to skip.')
			.addTextArea((text) =>
				text
					.setPlaceholder('archive\ndrafts')
					.setValue(this.plugin.settings.excludeRules.join('\n'))
					.onChange(async (value) => {
						this.plugin.settings.excludeRules =
							parseListValue(value);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Max cards per run')
			.setDesc('Upper limit for a single generation request.')
			.addText((text) => {
				text.inputEl.type = 'number';
				text.inputEl.min = '1';
				text.inputEl.step = '1';
				return text
					.setValue(String(this.plugin.settings.maxCardsPerRun))
					.onChange(async (value) => {
						const parsedValue = Number.parseInt(value, 10);
						if (Number.isFinite(parsedValue) && parsedValue > 0) {
							this.plugin.settings.maxCardsPerRun = parsedValue;
							await this.plugin.saveSettings();
						}
					});
			});

		new Setting(containerEl)
			.setName('Max source characters')
			.setDesc('Trim note input before sending it to the AI.')
			.addText((text) => {
				text.inputEl.type = 'number';
				text.inputEl.min = '1000';
				text.inputEl.step = '500';
				return text
					.setValue(String(this.plugin.settings.maxSourceCharacters))
					.onChange(async (value) => {
						const parsedValue = Number.parseInt(value, 10);
						if (Number.isFinite(parsedValue) && parsedValue > 0) {
							this.plugin.settings.maxSourceCharacters =
								parsedValue;
							await this.plugin.saveSettings();
						}
					});
			});

		new Setting(containerEl)
			.setName('Temperature')
			.setDesc(
				'Lower values favor consistency; higher values favor variety.',
			)
			.addText((text) => {
				text.inputEl.type = 'number';
				text.inputEl.min = '0';
				text.inputEl.max = '2';
				text.inputEl.step = '0.1';
				return text
					.setValue(String(this.plugin.settings.temperature))
					.onChange(async (value) => {
						const parsedValue = Number.parseFloat(value);
						if (Number.isFinite(parsedValue) && parsedValue >= 0) {
							this.plugin.settings.temperature = parsedValue;
							await this.plugin.saveSettings();
						}
					});
			});
	}
}
