import { App, ItemView, Notice, WorkspaceLeaf, setIcon } from 'obsidian';
import { FLASHCARDS_VIEW_CONFIG } from '../constants';
import type { AIFlashcardsPluginSettings } from '../settings';

interface FlashcardsPluginLike {
	settings: AIFlashcardsPluginSettings;
}

export default class FlashcardsView extends ItemView {
	private readonly plugin: FlashcardsPluginLike;

	constructor(leaf: WorkspaceLeaf, plugin: FlashcardsPluginLike) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return FLASHCARDS_VIEW_CONFIG.type;
	}

	getDisplayText(): string {
		return FLASHCARDS_VIEW_CONFIG.name;
	}

	getIcon(): string {
		return FLASHCARDS_VIEW_CONFIG.icon;
	}

	onOpen(): Promise<void> {
		this.render();
		return Promise.resolve();
	}

	onClose(): Promise<void> {
		this.contentEl.empty();
		return Promise.resolve();
	}

	private render(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.addClass('ai-flashcards-view');

		const shell = contentEl.createDiv({ cls: 'ai-flashcards-shell' });
		const hero = shell.createDiv({ cls: 'ai-flashcards-hero' });
		hero.createDiv({
			cls: 'ai-flashcards-badge',
			text: 'Review workspace',
		});
		hero.createEl('h1', { text: 'AI flashcards' });
		hero.createEl('p', {
			text: 'Build a dedicated review flow for cards generated from your notes. This view is the starting point for generation, study sessions, and future card management.',
		});

		const actions = hero.createDiv({ cls: 'ai-flashcards-actions' });
		this.createButton(actions, 'Open settings', 'primary', () => {
			void (
				this.app as App & {
					commands?: { executeCommandById(commandId: string): void };
				}
			).commands?.executeCommandById('app:open-settings');
		});
		this.createButton(actions, 'Refresh view', 'secondary', () => {
			this.render();
		});
		this.createButton(actions, 'Setup tip', 'secondary', () => {
			new Notice(
				'Set your AI provider in settings, then add generation commands and review cards here.',
			);
		});

		const grid = shell.createDiv({ cls: 'ai-flashcards-grid' });
		this.createInfoCard(
			grid,
			'sparkles',
			'Provider',
			this.getProviderLabel(),
			'The plugin settings are loaded and ready for a cloud or local AI setup.',
		);
		this.createInfoCard(
			grid,
			'layout-dashboard',
			'Study flow',
			'Start here',
			'This is the dedicated leaf that future review cards will render into.',
		);
		this.createInfoCard(
			grid,
			'folder-search',
			'Next step',
			'Connect generation',
			'Add source selection and card generation commands next so the view can show live decks.',
		);
	}

	private createButton(
		container: HTMLElement,
		label: string,
		variant: 'primary' | 'secondary',
		onClick: () => void,
	): void {
		const button = container.createEl('button', {
			cls: ['ai-flashcards-button', `ai-flashcards-button-${variant}`],
			text: label,
		});
		button.addEventListener('click', onClick);
	}

	private createInfoCard(
		container: HTMLElement,
		icon: string,
		title: string,
		value: string,
		description: string,
	): void {
		const card = container.createDiv({ cls: 'ai-flashcards-card' });
		const header = card.createDiv({ cls: 'ai-flashcards-card-header' });
		const iconEl = header.createDiv({ cls: 'ai-flashcards-card-icon' });
		setIcon(iconEl, icon);
		const titleWrap = header.createDiv({
			cls: 'ai-flashcards-card-title-wrap',
		});
		titleWrap.createDiv({ cls: 'ai-flashcards-card-kicker', text: title });
		titleWrap.createEl('h2', { text: value });
		card.createEl('p', {
			cls: 'ai-flashcards-card-body',
			text: description,
		});
	}

	private getProviderLabel(): string {
		if (this.plugin.settings.apiKey === 'local') {
			return 'Local AI';
		}

		if (this.plugin.settings.apiKey === 'remote') {
			return 'Cloud AI';
		}

		return 'Not configured yet';
	}
}
