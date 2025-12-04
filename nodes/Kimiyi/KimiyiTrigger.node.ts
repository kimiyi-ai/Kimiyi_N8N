import type { INodeType, INodeTypeDescription, ITriggerFunctions } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class KimiyiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kimiyi Trigger',
		name: 'kimiyiTrigger',
		icon: 'file:svgexport-3.svg',
		group: ['trigger'],
		version: 1,
		description: 'Kimiyi trigger node',
		defaults: {
			name: 'Kimiyi Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'kimiyiApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'sendMessageTrigger',
				noDataExpression: true,
				options: [
					{
						name: 'Trigger: Send Message',
						value: 'sendMessageTrigger',
					},
					{
						name: 'Trigger: Welcome Message',
						value: 'welcomeMessageTrigger',
					},
					{
						name: 'Trigger: Survey Message',
						value: 'surveyMessageTrigger',
					},
					{
						name: 'Trigger: Fallback Message',
						value: 'fallbackMessageTrigger',
					},
				],
			},
			{
				displayName: 'Interval',
				name: 'interval',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'e.g. 5m or 1h',
			},
		],
	};

	async trigger(this: ITriggerFunctions) {
		const operation = this.getNodeParameter('operation', 0) as string;
		const interval = this.getNodeParameter('interval', 0) as string;

		const credentials = await this.getCredentials('kimiyiApi');
		const apiKey = credentials.apiKey as string;

		const endpoints: Record<string, string> = {
			sendMessageTrigger: 'https://internalwebapi-dev.kimiyi.ai/api/Zapier/SendMessage',
			welcomeMessageTrigger: 'https://internalwebapi-dev.kimiyi.ai/api/Zapier/NewWelcomeMessage',
			surveyMessageTrigger: 'https://internalwebapi-dev.kimiyi.ai/api/Zapier/NewSurveyMessage',
			fallbackMessageTrigger: 'https://internalwebapi-dev.kimiyi.ai/api/Zapier/Fallback',
		};

		const url = endpoints[operation];

		if (!url) {
			throw new Error(`Unsupported operation: ${operation}`);
		}

		const runOnce = async () => {
			const response = await this.helpers.httpRequest({
				method: 'POST',
				url,
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': apiKey,
				},
				body: { interval },
				json: true,
			});

			this.emit([[{ json: response }]]);
		};

		if (this.getMode() === 'trigger') {
			await runOnce();
		}

		return {
			manualTriggerFunction: async () => {
				await runOnce();
			},
		};
	}
}
