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
			'square-asterisk',
			'Open AI flashcards',
			() => void this.openFlashcardsView(),
		);
	}

	private async openFlashcardsView(): Promise<void> {
		const leaves = this.app.workspace.getLeavesOfType(
			FLASHCARDS_VIEW_CONFIG.type,
		);
		const leaf =
			leaves[0] ??
			this.app.workspace.getRightLeaf(false) ??
			this.app.workspace.getLeaf();

		await leaf.setViewState({
			type: FLASHCARDS_VIEW_CONFIG.type,
			active: true,
		});
		await this.app.workspace.revealLeaf(leaf);
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
