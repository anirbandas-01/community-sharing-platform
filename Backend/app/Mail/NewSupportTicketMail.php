<?php

namespace App\Mail;

use App\Models\SupportTicket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewSupportTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    public SupportTicket $ticket;

    public function __construct(SupportTicket $ticket)
    {
        $this->ticket = $ticket;
    }

    public function envelope(): Envelope
    {
        $prefix = $this->ticket->type === 'community' ? '[Community Support]' : '[Support]';
        return new Envelope(
            subject: "{$prefix} New message from {$this->ticket->name}",
            replyTo: [$this->ticket->email],
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlView: 'emails.support.new-ticket',
            with: [
                'ticket' => $this->ticket,
            ],
        );
    }
}
