const orderUpdatesTemplate = (template_vars) => {
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
                    <p>Hi ${template_vars.first_name},</p>
                    <p>Your order ${template_vars.order_number} has been confirmed successfully and is been processed currently.</p>
                    <p>It will be packed and shipped immediately. You will receive a notification from us once your order status changes.</p>
                </div>
    
                <div style="margin: 30px 0; padding: 20px 0; background-color: #8cabff;">
                    <div style="font-size: 0.8rem; text-align: center;">
                        <span style="font-weight: 500; color: #1d4ed8;">Order confirmed</span>
                        <span>></span>
                        <span style="font-weight: 500;">Order shipped</span>
                        <span>></span>
                        <span style="font-weight: 500;">Ready for pickup/delivery</span>
                        <span>></span>
                        <span style="font-weight: 500;">Delivered</span>
                    </div>
                </div>
    
                <div>
                    <p>Your order includes the following package(s):</p>
                    <ul style="list-style-type: none; font-size: 0.8rem;">
                        <li style="border-bottom: 1px #797979 solid;">
                            <p><span style="font-weight: 600;">Item</span> <span aria-hidden="true">&nbsp;</span> ${template_vars.item_name}</p>
                            <p><span style="font-weight: 600;">Price</span> <span aria-hidden="true">&nbsp;</span> ${template_vars.item_price}</p>
                            <p><span style="font-weight: 600;">Quantity</span> <span aria-hidden="true">&nbsp;</span> ${template_vars.item_quantity}</p>
                        </li>
                    </ul>
                </div>
    
                <p style="color: #1d4ed8; font-size: 0.8rem;">If you ordered for multiple items, they may arrive at seperate times.</p>
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

module.exports = orderUpdatesTemplate;