namespace MobyLabWebProgramming.Core.Constants;

public static class MailTemplates
{
    public static string UserAddTemplate(string name) => $@"<!DOCTYPE html>
<html lang=""en"" xmlns=""http://www.w3.org/1999/xhtml"">
<head>
    <meta charset=""utf-8"" />
    <title>Welcome Email</title>
    <style type=""text/css"">
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            background-color: #ffffff;
            width: 600px;
            margin: 30px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }}
        .header {{
            border-bottom: 2px solid #3c87be;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }}
        .content {{
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }}
        .footer {{
            margin-top: 30px;
            font-size: 12px;
            color: #999999;
            text-align: center;
        }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h2 style=""color: #3c87be; margin: 0;"">Welcome to PetCare</h2>
        </div>
        <div class=""content"">
            <p><strong>Dear Mr./Ms. {name},</strong></p>
            <p>We are thrilled to have you join us. Your account has been successfully created and you're now part of our community.</p>
            <p>If you have any questions or need assistance, feel free to reach out. We're here to help!</p>
            <p>Warm regards,<br/>The PetCare Team</p>
        </div>
        <div class=""footer"">
            &copy; {DateTime.Now.Year} PetCare. All rights reserved.
        </div>
    </div>
</body>
</html>";
}