import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
	WorkspaceLeaf,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	AIFlashcardsPluginSettings,
	AIFlashcardsSettingTab,
} from './settings';
import {
	FLASHCARDS_VIEW_CONFIG,
} from "./constants";


export default class AIFlashcards extends Plugin {
	settings!: AIFlashcardsPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new AIFlashcardsSettingTab(this.app, this));

		this.addRibbonIcon(
			"square-asterisk",
			"Open AI flashcards",
			async () => {
				const leafs = this.app.workspace.getLeavesOfType(
					FLASHCARDS_VIEW_CONFIG.type
				);
				let leaf: WorkspaceLeaf;
				if (leafs.length === 0) {
					leaf =
						this.app.workspace.getRightLeaf(false) ??
						this.app.workspace.getLeaf();
					await leaf.setViewState({
						type: FLASHCARDS_VIEW_CONFIG.type,
					});
				} else {
					leaf = leafs.first()!;
				}
				await this.app.workspace.revealLeaf(leaf);
			}
		);

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(activeDocument, 'click', (_evt: MouseEvent) => {
		// 	new Notice('Click');
		// });

	}

	onunload() {
		const leaves = this.app.workspace.getLeavesOfType(
			FLASHCARDS_VIEW_CONFIG.type,
		);
		for (const leaf of leaves) {
			leaf.detach();
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<AIFlashcardsPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
