import {
	ICredentialType,
	INodeProperties,Icon,ICredentialTestRequest
} from 'n8n-workflow';
export class KimiyiApi implements ICredentialType {
	name = 'kimiyiApi';
	displayName = 'Kimiyi API';
	iconUrl = '/icon/Kimiyi.svg';
	icon: Icon = { light: 'file:../icons/kimiyi.svg', dark: 'file:../icons/kimiyi.dark.svg' };
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
	test: ICredentialTestRequest = {
			request: {
				baseURL: 'https://api.github.com',
				url: '/user',
				method: 'GET',
			},
		};
}