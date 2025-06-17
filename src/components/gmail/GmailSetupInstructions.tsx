
export const GmailSetupInstructions = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
      <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
        <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
        <li>Create a new project or select an existing one</li>
        <li>Enable the Gmail API</li>
        <li>Create OAuth 2.0 credentials (Web application)</li>
        <li>Add these exact redirect URIs:</li>
      </ol>
      
      <div className="mt-3 space-y-2">
        <div className="bg-white p-2 rounded border">
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono">http://localhost:8080/</code>
            <button 
              onClick={() => copyToClipboard('http://localhost:8080/')}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              Copy
            </button>
          </div>
        </div>
        
        <div className="bg-white p-2 rounded border">
          <div className="flex items-center justify-between">
            <code className="text-xs font-mono">https://preview--talent-flow-factory.lovable.app/</code>
            <button 
              onClick={() => copyToClipboard('https://preview--talent-flow-factory.lovable.app/')}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
