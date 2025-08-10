using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MRP_API.Models;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

public class EmailService
{
    private readonly EmailSettings _emailSettings;

    public EmailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendTicketEmailAsync(TicketDto ticket)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
        message.To.Add(MailboxAddress.Parse(ticket.Email));
        message.Subject = $"Booking Confirmed! 🎬 {ticket.MovieName}";

        message.Body = new TextPart("html")
        {
            Text = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Booking Confirmation</title>
</head>
<body style='font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;'>
    <div style='max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);'>

      <!-- Header -->
<div style=""background-color: #000000; width: 100%; height: 60px; overflow: hidden;"">
  <img src=""https://i.imghippo.com/files/OM4131GCc.jpg"" alt=""Logo""
       style=""width: 100%; height: 100%; object-fit: cover;"">
</div>



</div>


        <!-- Content -->
        <div style='padding: 25px;'>
            <table width='100%'>
                <tr>
                    <!-- Movie Poster -->
                    <td style='width: 150px; vertical-align: top;'>
                        <img src='{ticket.MovieImg}' alt='{ticket.MovieName}' style='width: 120px; border-radius: 8px;'>
                    </td>
                    <!-- Ticket Details -->
                    <td style='padding-left: 20px; vertical-align: top; color: #333;'>
                        <h2 style='margin: 0 0 10px 0;'>{ticket.MovieName}</h2>
                        <p style='margin: 5px 0;'><strong>Booking ID:</strong> {ticket.BookingId}</p>
                        <p style='margin: 5px 0;'>Hello <strong>{ticket.UserName}</strong>,</p>
                        <p style='margin: 5px 0;'><strong>Theater:</strong> {ticket.TheaterName}</p>
                        <p style='margin: 5px 0;'><strong>Date:</strong> {ticket.Date}</p>
                        <p style='margin: 5px 0;'><strong>Time:</strong> {ticket.Time}</p>
                        <p style='margin: 5px 0;'><strong>Seats:</strong> {ticket.Seats}</p>
                    </td>
                </tr>
            </table>

            <!-- Confirmation Button -->
            <div style='text-align: center; margin: 30px 0;'>
                <a href='#' style='background: #ffffff; color: #28a745; border: 2px solid #28a745; padding: 12px 30px; text-decoration: none; border-radius: 30px; font-weight: bold;'>
                    BOOKING CONFIRMED
                </a>
            </div>

            <!-- Footer Message -->
            <p style='text-align: center; color: #555; font-size: 14px;'>
                Thank you for booking with <strong>GetMyPadam!</strong> 🎬<br>
                Enjoy your show and don’t forget to grab some popcorn 🍿
            </p>

           
        </div>
    </div>
</body>
</html>"
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}