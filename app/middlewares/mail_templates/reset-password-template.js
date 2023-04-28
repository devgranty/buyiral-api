const resetPasswordTemplate = (template_vars) => {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Buyiral</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
            <meta name="format-detection" content="telephone=no" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
            <style type="text/css">
                html, body {
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif;
                }
    
                .link-btn {
                    text-decoration: none;
                    background-image: linear-gradient(to bottom right, #1d4ed8, #a855f7) ;
                    padding: 0.7rem 1rem;
                    color: #fff;
                    text-align: center;
                    border-radius: 9999px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    white-space: nowrap;
                }
            </style>
        </head>
    
        <body style="padding: 25px 10px;">
    
            <!-- Header -->
            <div style="text-align: center;">
                <a href="https://buyiral.com" target="_blank" style="text-decoration: none;">
                    <img src="https://api.buyiral.com/static/Buyiral/Logo_1.png" alt="Buyiral" width="160" style="width: 8rem;" />
                </a>
            </div>
            <!-- Header -->
    
            <!-- Body -->
            <div style="max-width: 650px; margin: 30px auto; padding: 20px; border-radius: 2px;">
                <div>
                    <p>Hi ${template_vars.user_name},</p>
                    <p>We're sorry to hear that you're having trouble logging in to your Buyiral account. We've received a message that you've forgotten your password. If this was you, you can reset your password by clicking the button below.</p>
                </div>
    
                <div style="margin: 40px; text-align: center;">
                    <a href="${template_vars.password_reset_link}" target="_blank" class="link-btn">RESET YOUR PASSWORD</a>
                </div>
    
                <div style="font-size: 0.8rem; text-align: center;">
                    <span>If you prefer, copy the following link and paste it into your browser to view: </span>
                    <a href="${template_vars.password_reset_link}" target="_blank">${template_vars.password_reset_link}</a>
                </div>
    
                <div style="font-size: 0.8rem; color: rgb(24, 24, 24); text-align: center;">
                    <p>This link will expire 15 minutes after receipt.</p>
                    <p>If you think this email was wrongly sent to you please ignore.</p>
                </div>
            </div>
            <!-- Body -->
    
            <!-- Footer -->
            <div style="max-width: 650px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 10px;">
                    <a href="https://instagram.com/buyiralhq" target="_blank" style="text-decoration: none; width: 20px;">
                        <img src="https://api.buyiral.com/static/logo/instagram-brands.png" alt="instagram" width="20" />
                    </a>
    
                    <a href="https://www.facebook.com/buyiralhq/" target="_blank" style="text-decoration: none; width: 20px;">
                        <img src="https://api.buyiral.com/static/logo/facebook-brands.png" alt="facebook" width="20" />
                    </a>
    
                    <a href="https://twitter.com/Buyiralhq" target="_blank" style="text-decoration: none; width: 20px;">
                        <img src="https://api.buyiral.com/static/logo/twitter-brands.png" alt="twitter" width="20" />
                    </a>
    
                    <a href="https://linkedin.com/in/buyiralhq" target="_blank" style="text-decoration: none; width: 20px;">
                        <img src="https://api.buyiral.com/static/logo/linkedin.png" alt="linkedin" width="20" />
                    </a>
    
                    <a href="https://www.tiktok.com/@buyiralhq" target="_blank" style="text-decoration: none; width: 20px;">
                        <img src="https://api.buyiral.com/static/logo/tiktok.png" alt="tiktok" width="20" />
                    </a>
                </div>
    
                <div style="text-align: center; font-size: 0.75rem;">
                    <span>&copy; Buyiral, Abuja, AB 10000, Nigeria</span>
                </div>   
            </div>
            <!-- Footer -->
    
        </body>
    
    </html>`
}

module.exports = resetPasswordTemplate;