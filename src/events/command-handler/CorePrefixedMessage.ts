import type { PieceContext } from '@sapphire/pieces';
import type { Message } from 'discord.js';
import { Event, EventOptions } from '../../lib/structures/Event';
import { Events } from '../../lib/types/Events';

export class CoreEvent extends Event<Events.PrefixedMessage> {
	public constructor(context: PieceContext, options: EventOptions = {}) {
		super(context, { ...options, event: Events.PrefixedMessage });
	}

	public run(message: Message, prefix: string) {
		// Retrieve the command name and validate:
		const prefixLess = message.content.slice(prefix.length).trim();
		const commandName = /.+\b/.exec(prefixLess)?.[0];
		if (!commandName) {
			this.client.emit(Events.UnknownCommandName, message, prefix);
			return;
		}

		// Retrieve the command and validate:
		const command = this.client.commands.get(commandName);
		if (!command) {
			this.client.emit(Events.UnknownCommand, message, commandName, prefix);
			return;
		}

		// Run the last stage before running the command:
		this.client.emit(Events.PreCommandRun, message, command, commandName, prefix);
	}
}
