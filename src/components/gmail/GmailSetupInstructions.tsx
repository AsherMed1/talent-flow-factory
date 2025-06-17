
export const GmailSetupInstructions = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
        <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
        <li>Create a new project or select an existing one</li>
        <li>Enable the Gmail API</li>
        <li>Create OAuth 2.0 credentials (Web application)</li>
        <li>Add these exact redirect URIs:</li>
        <li className="ml-4">• <code>http://localhost:8080/auth/gmail/callback</code></li>
        <li className="ml-4">• <code>https://preview--talent-flow-factory.lovable.app/auth/gmail/callback</code></li>
      </ol>
    </div>
  );
};
