<?php

namespace App\Jobs;

use App\Models\WhatsAppChat;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $phoneNumber;
    protected $message;
    protected $template;
    protected $variables;
    protected $userId;

    /**
     * Create a new job instance.
     */
    public function __construct($phoneNumber, $message = null, $template = null, $variables = [], $userId = null)
    {
        $this->phoneNumber = $phoneNumber;
        $this->message = $message;
        $this->template = $template;
        $this->variables = $variables;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(WhatsAppService $whatsAppService): void
    {
        try {
            $result = null;

            if ($this->template) {
                // Send template message
                $result = $whatsAppService->sendTemplate($this->phoneNumber, $this->template, $this->variables);
            } elseif ($this->message) {
                // Send regular message
                $result = $whatsAppService->sendMessage($this->phoneNumber, $this->message);
            }

            if ($result && $result['success']) {
                // Log successful message
                WhatsAppChat::create([
                    'user_id' => $this->userId,
                    'phone_number' => $this->phoneNumber,
                    'whatsapp_message_id' => $result['data']['messages'][0]['id'] ?? null,
                    'message' => $this->message ?: $this->getTemplateMessage(),
                    'direction' => WhatsAppChat::DIRECTION_OUTBOUND,
                    'status' => WhatsAppChat::STATUS_SENT,
                    'metadata' => [
                        'template' => $this->template,
                        'variables' => $this->variables,
                        'api_response' => $result['data']
                    ]
                ]);

                Log::info('WhatsApp notification sent successfully', [
                    'phone' => $this->phoneNumber,
                    'user_id' => $this->userId,
                    'template' => $this->template
                ]);
            } else {
                Log::error('Failed to send WhatsApp notification', [
                    'phone' => $this->phoneNumber,
                    'error' => $result['error'] ?? 'Unknown error'
                ]);
                
                // Mark job as failed
                $this->fail($result['error'] ?? 'Failed to send WhatsApp message');
            }

        } catch (\Exception $e) {
            Log::error('WhatsApp notification job failed', [
                'phone' => $this->phoneNumber,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Re-throw to mark job as failed
            throw $e;
        }
    }

    /**
     * Get the template message with variables replaced
     */
    protected function getTemplateMessage()
    {
        if (!$this->template) {
            return $this->message;
        }

        $template = config("whatsapp.templates.{$this->template}");
        
        if (!$template) {
            return $this->message;
        }

        $message = $template;
        foreach ($this->variables as $key => $value) {
            $message = str_replace("{{$key}}", $value, $message);
        }

        return $message;
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('WhatsApp notification job permanently failed', [
            'phone' => $this->phoneNumber,
            'user_id' => $this->userId,
            'template' => $this->template,
            'error' => $exception->getMessage()
        ]);

        // Optionally, you could create a failed notification record
        // or send an alert to administrators
    }
}