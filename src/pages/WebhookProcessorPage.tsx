
import { WebhookProcessor } from '@/components/WebhookProcessor';

const WebhookProcessorPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Webhook Data Processor</h1>
          <p className="text-gray-600">
            Process failed GoHighLevel webhook data to update candidate statuses.
          </p>
        </div>
        
        <WebhookProcessor />
      </div>
    </div>
  );
};

export default WebhookProcessorPage;
