import Brevo from '@getbrevo/brevo';

// Initialize the API instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// Configure API key authorization
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export default apiInstance;