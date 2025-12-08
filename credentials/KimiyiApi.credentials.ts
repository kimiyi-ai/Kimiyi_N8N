import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KimiyiApi implements ICredentialType {
	name = 'kimiyiApi';
	displayName = 'Kimiyi API';
	documentationUrl = 'https://example.com/docs'; // optional, can leave blank
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: { password: true },
		},
	];
}
