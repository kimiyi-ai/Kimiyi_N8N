import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class KimiyiApi implements ICredentialType {
	name = 'kimiyiApi';
	displayName = 'Kimiyi API';
	documentationUrl = ''; // optional, can leave blank
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}
