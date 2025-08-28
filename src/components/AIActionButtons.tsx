import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Calendar,
  Send,
  Check,
  X,
  AlertCircle,
  Loader
} from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { aiService } from '../services/aiService';

interface AIActionButtonsProps {
  emailContent?: {
    subject: string;
    body: string;
  };
  onRefresh?: () => void;
  onSchedule?: () => void;
  onSend?: () => void;
  loading?: boolean;
  className?: string;
}

export const AIActionButtons: React.FC<AIActionButtonsProps> = ({
  emailContent,
  onRefresh,
  onSchedule,
  onSend,
  loading = false,
  className = ''
}) => {
  const [aiStatus, setAiStatus] = useState<'checking' | 'available' | 'fallback' | 'error'>('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check AI status on mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    setAiStatus('checking');
    try {
      const isAvailable = await aiService.isAvailable();
      setAiStatus(isAvailable ? 'available' : 'fallback');
    } catch (error) {
      console.error('Failed to check AI status:', error);
      setAiStatus('error');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await checkAIStatus();
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSchedule = () => {
    if (onSchedule) {
      onSchedule();
    } else {
      // Default schedule action
      console.log('Schedule campaign with content:', emailContent);
      // This could open a scheduling modal or redirect to campaign creation
    }
  };

  const handleSend = () => {
    if (onSend) {
      onSend();
    } else {
      // Default send action
      console.log('Send email with content:', emailContent);
      // This could open the send modal or redirect to the send page
    }
  };

  const getStatusBadge = () => {
    switch (aiStatus) {
      case 'checking':
        return (
          <Badge className="bg-gray-100 text-gray-600">
            <Loader className="w-3 h-3 mr-1 animate-spin" />
            Checking AI...
          </Badge>
        );
      case 'available':
        return (
          <Badge className="bg-green-100 text-green-700">
            <Check className="w-3 h-3 mr-1" />
            AI Available
          </Badge>
        );
      case 'fallback':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertCircle className="w-3 h-3 mr-1" />
            Fallback Mode
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-red-100 text-red-700">
            <X className="w-3 h-3 mr-1" />
            AI Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Actions</h3>
        </div>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Refresh AI Content */}
        <Button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          variant="outline"
          className="flex items-center justify-center gap-2 h-12"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <div className="text-center">
            <div className="font-medium">Refresh</div>
            <div className="text-xs text-gray-500">Regenerate content</div>
          </div>
        </Button>

        {/* Schedule Campaign */}
        <Button
          onClick={handleSchedule}
          disabled={loading || !emailContent}
          className="flex items-center justify-center gap-2 h-12 bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="w-4 h-4" />
          <div className="text-center">
            <div className="font-medium">Schedule</div>
            <div className="text-xs opacity-90">Plan campaign</div>
          </div>
        </Button>

        {/* Send Now */}
        <Button
          onClick={handleSend}
          disabled={loading || !emailContent}
          className="flex items-center justify-center gap-2 h-12 bg-green-600 hover:bg-green-700"
        >
          <Send className="w-4 h-4" />
          <div className="text-center">
            <div className="font-medium">Send Now</div>
            <div className="text-xs opacity-90">Immediate send</div>
          </div>
        </Button>
      </div>

      {/* Status Information */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          {aiStatus === 'available' && (
            <span>✅ AI services are fully operational and ready to assist.</span>
          )}
          {aiStatus === 'fallback' && (
            <span>⚠️ Using fallback mode. Some features may be limited.</span>
          )}
          {aiStatus === 'error' && (
            <span>❌ AI services are currently unavailable. Please try again later.</span>
          )}
          {aiStatus === 'checking' && (
            <span>🔄 Checking AI service availability...</span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AIActionButtons;
