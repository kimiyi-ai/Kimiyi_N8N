import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionTypes } from 'n8n-workflow';

export class Kimiyi implements INodeType {

	description: INodeTypeDescription = {
		displayName: 'Kimiyi',
		name: 'kimiyi',
		icon: 'file:svgexport-3.svg',
		group: ['transform'],
		version: 1,
		description: 'Kimiyi AI Node',

		defaults: {
			name: 'Kimiyi',
		},

		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'kimiyiApi',
				required: true,
			},
		],

		properties: [
			// ----------------------------------
			//         Operations
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'uploadDocument',
				noDataExpression: true,
				options: [
					// Actions
					{
						name: 'Upload Document (Train)',
						value: 'uploadDocument',
					},
					{
						name: 'Update Document (Retrain)',
						value: 'updateDocument',
					},
					{
						name: 'Auto Reply Messenger',
						value: 'autoReplyMessenger',
					},
				],
			},

			// Upload Document Fields
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				default: 'Dropbox',
				options: [
					{ name: 'Dropbox', value: 'Dropbox' },
					{ name: 'OneDrive', value: 'OneDrive' },
					{ name: 'Google Drive', value: 'Google Drive' },
				],
				required: true,
				displayOptions: {
					show: { operation: ['uploadDocument'] },
				},
			},
			{
				displayName: 'Document Link',
				name: 'doc_link',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://...',
				displayOptions: {
					show: { operation: ['uploadDocument'] },
				},
			},
			{
				displayName: 'File Name',
				name: 'file_name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: { operation: ['uploadDocument'] },
				},
			},
			{
				displayName: 'File Type (MIME)',
				name: 'file_type',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: { operation: ['uploadDocument'] },
				},
			},
			{
				displayName: 'File Size (Bytes)',
				name: 'file_size',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: { operation: ['uploadDocument'] },
				},
			},
			// ----------------------
			// Update Document Fields
			// ----------------------
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				default: 'Dropbox',
				options: [
					{ name: 'Dropbox', value: 'Dropbox' },
					{ name: 'OneDrive', value: 'OneDrive' },
					{ name: 'Google Drive', value: 'Google Drive' },
				],
				required: true,
				displayOptions: {
					show: {
						operation: ['updateDocument'],
					},
				},
			},
			{
				displayName: 'Document Link',
				name: 'doc_link',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'https://...',
				displayOptions: {
					show: {
						operation: ['updateDocument'],
					},
				},
			},
			{
				displayName: 'File Name',
				name: 'file_name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['updateDocument'],
					},
				},
			},
			{
				displayName: 'File Type (MIME)',
				name: 'file_type',
				type: 'string',
				default: '',
				placeholder: 'application/pdf',
				required: true,
				displayOptions: {
					show: {
						operation: ['updateDocument'],
					},
				},
			},
			{
				displayName: 'File Size (Bytes)',
				name: 'file_size',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						operation: ['updateDocument'],
					},
				},
			},
			// ----------------------
			// Auto Reply Messenger Fields
			// ----------------------
			{
				displayName: 'PSID (Facebook User ID)',
				name: 'psid',
				type: 'string',
				default: '',
				required: true,
				placeholder: '123456789012345',
				displayOptions: {
					show: {
						operation: ['autoReplyMessenger'],
					},
				},
			},
			{
				displayName: 'Sender Name',
				name: 'sender',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'John Doe',
				displayOptions: {
					show: {
						operation: ['autoReplyMessenger'],
					},
				},
			},
			{
				displayName: 'Message Text',
				name: 'textInput',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 4,
				},
				required: true,
				placeholder: 'Hello! How can I help you?',
				displayOptions: {
					show: {
						operation: ['autoReplyMessenger'],
					},
				},
			},

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		let returnItems: INodeExecutionData[] = [];

		const itemIndex = 0;
		const operation = this.getNodeParameter('operation', itemIndex) as string;

		const credentials = await this.getCredentials('kimiyiApi');
		const apiKey = credentials.apiKey as string;

		// ========== UPLOAD DOCUMENT ==========
		if (operation === 'uploadDocument') {

			const platform  = this.getNodeParameter('platform', itemIndex) as string;
			const doc_link  = this.getNodeParameter('doc_link', itemIndex) as string;
			const file_name = this.getNodeParameter('file_name', itemIndex) as string;
			const file_type = this.getNodeParameter('file_type', itemIndex) as string;
			const file_size = this.getNodeParameter('file_size', itemIndex) as number;

			const body = {
				platform,
				doc_link,
				file_name,
				file_type,
				file_size,
			};

			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: 'https://internalwebapi-dev.kimiyi.ai/api/N8N/UploadFile',
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': apiKey,
				},
				body,
				json: true,
			});

			returnItems.push({ json: response });
		}

		// ========== UPDATE DOCUMENT ==========
		if (operation === 'updateDocument') {

			const platform  = this.getNodeParameter('platform', itemIndex) as string;
			const doc_link  = this.getNodeParameter('doc_link', itemIndex) as string;
			const file_name = this.getNodeParameter('file_name', itemIndex) as string;
			const file_type = this.getNodeParameter('file_type', itemIndex) as string;
			const file_size = this.getNodeParameter('file_size', itemIndex) as number;

			const body = {
				platform,
				doc_link,
				file_name,
				file_type,
				file_size,
			};

			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: 'https://internalwebapi-dev.kimiyi.ai/api/Zapier/UpdateFile',
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': apiKey,
				},
				body,
				json: true,
			});

			returnItems.push({ json: response });
		}

		// ========== AUTO REPLY MESSENGER ==========
		if (operation === 'autoReplyMessenger') {

			const psid = this.getNodeParameter('psid', itemIndex) as string;
			const sender = this.getNodeParameter('sender', itemIndex) as string;
			const textInput = this.getNodeParameter('textInput', itemIndex) as string;

			const body = {
				psid,
				sender,
				textInput,
			};

			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: 'https://internalwebapi-dev.kimiyi.ai/api/Zapier/AutoReply',
				headers: {
					'Content-Type': 'application/json',
					'X-API-KEY': apiKey,
				},
				body,
				json: true,
			});

			returnItems.push({ json: response });
		}

		return this.prepareOutputData(returnItems);
	}
}
