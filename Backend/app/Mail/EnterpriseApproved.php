<?php

namespace App\Mail;

use App\Models\Enterprise;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EnterpriseApproved extends Mailable
{
    use Queueable, SerializesModels;

    public Enterprise $enterprise;
    public string $notes;

    /**
     * Create a new message instance.
     */
    public function __construct(Enterprise $enterprise, string $notes = '')
    {
        $this->enterprise = $enterprise;
        $this->notes      = $notes;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 Your Business Has Been Approved — CommunitySharing',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlView: 'emails.enterprise.approved',
            with: [
                'enterprise' => $this->enterprise,
                'ownerName'  => $this->enterprise->user->name,
                'notes'      => $this->notes,
                'dashboardUrl' => config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173'))
                    . '/business/dashboard',
            ],
        );
    }
}