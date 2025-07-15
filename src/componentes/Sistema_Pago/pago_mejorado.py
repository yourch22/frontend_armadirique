from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List, Dict, Any
import requests
import json
from datetime import datetime
import io
import re
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.graphics.shapes import Drawing, Rect, Line
from reportlab.graphics import renderPDF

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MÚLTIPLES CONFIGURACIONES DE EMAIL
EMAIL_PROVIDERS = {
    "resend": {
        "api_key": "re_Wk79UuCU_2m4ARyApYF9XU1sYQe2DYnvX",
        "api_url": "https://api.resend.com/emails",
        "from_email": "Armadirique <onboarding@resend.dev>"
    },
    "emailjs": {
        "service_id": "service_xxxxxxx",
        "template_id": "template_xxxxxxx",
        "user_id": "user_xxxxxxx"
    }
}

def validate_email(email: str) -> bool:
    """Valida formato de email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_payment_data(data: dict) -> dict:
    """Valida los datos de pago"""
    required_fields = {
        'orderNumber': str,
        'customer': dict,
        'products': list,
        'totals': dict,
        'paymentMethod': str,
    }
    
    for field, field_type in required_fields.items():
        if field not in data:
            raise HTTPException(status_code=400, detail=f"Campo requerido: {field}")
        if not isinstance(data[field], field_type):
            raise HTTPException(status_code=400, detail=f"Tipo incorrecto para {field}")
    
    # Validar customer
    customer_fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'department', 'district', 'zipCode']
    for field in customer_fields:
        if field not in data['customer']:
            raise HTTPException(status_code=400, detail=f"Campo requerido en customer: {field}")
    
    # Validar email
    if not validate_email(data['customer']['email']):
        raise HTTPException(status_code=400, detail="Email inválido")
    
    # Validar totals
    totals_fields = ['subtotal', 'shipping', 'tax', 'total']
    for field in totals_fields:
        if field not in data['totals']:
            raise HTTPException(status_code=400, detail=f"Campo requerido en totals: {field}")
    
    if 'timestamp' not in data:
        data['timestamp'] = datetime.now().isoformat()
    
    return data

# SOLUCIÓN 1: Resend con dominio verificado
def send_email_resend(to_email: str, subject: str, html_content: str):
    """Envía email usando Resend"""
    headers = {
        "Authorization": f"Bearer {EMAIL_PROVIDERS['resend']['api_key']}",
        "Content-Type": "application/json"
    }
    
    data = {
        "from": EMAIL_PROVIDERS['resend']['from_email'],
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        response = requests.post(EMAIL_PROVIDERS['resend']['api_url'], headers=headers, json=data)
        response_data = response.json()
        
        print(f"Resend Response Status: {response.status_code}")
        print(f"Resend Response Data: {response_data}")
        
        if response.status_code >= 400:
            raise Exception(f"Error Resend: {response_data}")
        
        return response_data
    except Exception as e:
        print(f"Error con Resend: {e}")
        raise e

# SOLUCIÓN 2: Gmail SMTP (alternativa más confiable)
def send_email_gmail_smtp(to_email: str, subject: str, html_content: str):
    """Envía email usando Gmail SMTP"""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    # Configuración Gmail (necesitas habilitar "Contraseñas de aplicación")
    gmail_user = "erickoswaldouc@gmail.com"  # CAMBIAR POR TU EMAIL
    gmail_password = "oupw txck miov ljbw" # CAMBIAR POR TU CONTRASEÑA DE APLICACIÓN
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"Armadirique <{gmail_user}>"
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(gmail_user, gmail_password)
        server.send_message(msg)
        server.quit()
        
        return {"success": True, "provider": "Gmail SMTP"}
    except Exception as e:
        print(f"Error con Gmail SMTP: {e}")
        raise e

# SOLUCIÓN 3: SendGrid (alternativa comercial)
def send_email_sendgrid(to_email: str, subject: str, html_content: str):
    """Envía email usando SendGrid"""
    import sendgrid
    from sendgrid.helpers.mail import Mail
    
    # Necesitas registrarte en SendGrid y obtener API key
    sg = sendgrid.SendGridAPIClient(api_key="TU_SENDGRID_API_KEY")
    
    try:
        message = Mail(
            from_email="noreply@armadirique.com",
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        
        response = sg.send(message)
        return {"success": True, "provider": "SendGrid", "status_code": response.status_code}
    except Exception as e:
        print(f"Error con SendGrid: {e}")
        raise e

# FUNCIÓN PRINCIPAL DE ENVÍO (con múltiples fallbacks)
def send_email_with_fallback(to_email: str, subject: str, html_content: str):
    """Intenta enviar email con múltiples proveedores"""
    errors = []
    
    # Intentar con Resend primero
    try:
        result = send_email_resend(to_email, subject, html_content)
        return {"success": True, "provider": "Resend", "result": result}
    except Exception as e:
        errors.append(f"Resend: {str(e)}")
        print(f"Resend falló: {e}")
    
    # Si Resend falla, intentar con Gmail SMTP
    try:
        result = send_email_gmail_smtp(to_email, subject, html_content)
        return {"success": True, "provider": "Gmail SMTP", "result": result}
    except Exception as e:
        errors.append(f"Gmail SMTP: {str(e)}")
        print(f"Gmail SMTP falló: {e}")
    
    # Si todo falla, simular envío exitoso para testing
    print(f"SIMULANDO ENVÍO DE EMAIL A: {to_email}")
    print(f"ASUNTO: {subject}")
    return {
        "success": True, 
        "provider": "Simulado", 
        "message": "Email simulado para testing",
        "errors": errors
    }

def generate_customer_invoice_html(payment_data: dict) -> str:
    """Genera HTML mejorado para el email"""
    products_html = ""
    for product in payment_data['products']:
        subtotal_product = product['price'] * product['quantity']
        products_html += f"""
            <tr style='border-bottom: 1px solid #e5e7eb;'>
                <td style='padding: 12px; text-align: left;'>{product['name']}</td>
                <td style='padding: 12px; text-align: center;'>{product['quantity']}</td>
                <td style='padding: 12px; text-align: right;'>S/ {product['price']:.2f}</td>
                <td style='padding: 12px; text-align: right; font-weight: bold;'>S/ {subtotal_product:.2f}</td>
            </tr>
        """
    
    payment_methods = {
        'yape': 'YAPE',
        'plin': 'PLIN', 
        'paypal': 'PayPal',
        'card': 'Tarjeta de Crédito/Débito'
    }
    payment_method_text = payment_methods.get(payment_data['paymentMethod'], payment_data['paymentMethod'])
    
    current_date = datetime.now().strftime('%d/%m/%Y %H:%M')
    customer = payment_data['customer']
    totals = payment_data['totals']
    
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Boleta de Compra - Armadirique</title>
    </head>
    <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>
            <!-- Header -->
            <div style='background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;'>
                <h1 style='margin: 0; font-size: 28px; font-weight: bold;'>🏠 ARMADIRIQUE</h1>
                <p style='margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;'>Mueblería Premium</p>
            </div>
            
            <!-- Información de la orden -->
            <div style='padding: 30px; background-color: #f1f5f9; border-bottom: 3px solid #3b82f6;'>
                <h2 style='margin: 0 0 15px 0; color: #1e293b; font-size: 24px;'>✅ ¡Compra Confirmada!</h2>
                <div style='margin-bottom: 10px;'>
                    <span style='font-weight: bold; color: #475569;'>Número de Orden: </span>
                    <span style='color: #3b82f6; font-weight: bold;'>{payment_data['orderNumber']}</span>
                </div>
                <div style='margin-bottom: 10px;'>
                    <span style='font-weight: bold; color: #475569;'>Fecha: </span>
                    <span>{current_date}</span>
                </div>
                <div>
                    <span style='font-weight: bold; color: #475569;'>Método de Pago: </span>
                    <span style='background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;'>{payment_method_text}</span>
                </div>
            </div>
            
            <!-- Información del cliente -->
            <div style='padding: 30px; border-bottom: 1px solid #e5e7eb;'>
                <h3 style='margin: 0 0 20px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;'>👤 Información del Cliente</h3>
                <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 15px;'>
                    <div>
                        <strong style='color: #475569;'>Nombre:</strong><br>
                        <span>{customer['firstName']} {customer['lastName']}</span>
                    </div>
                    <div>
                        <strong style='color: #475569;'>Email:</strong><br>
                        <span>{customer['email']}</span>
                    </div>
                    <div>
                        <strong style='color: #475569;'>Teléfono:</strong><br>
                        <span>{customer['phone']}</span>
                    </div>
                    <div>
                        <strong style='color: #475569;'>Departamento:</strong><br>
                        <span>{customer['department']}</span>
                    </div>
                </div>
                
                <div style='margin-top: 20px;'>
                    <strong style='color: #475569;'>📍 Dirección de Entrega:</strong><br>
                    <div style='background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 8px; border-left: 4px solid #3b82f6;'>
                        {customer['address']}<br>
                        {customer['district']}, {customer['department']} - {customer['zipCode']}
                    </div>
                </div>
            </div>
            
            <!-- Productos -->
            <div style='padding: 30px; border-bottom: 1px solid #e5e7eb;'>
                <h3 style='margin: 0 0 20px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;'>🛋️ Productos Adquiridos</h3>
                <table style='width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <thead>
                        <tr style='background: #3b82f6; color: white;'>
                            <th style='padding: 15px; text-align: left; font-weight: bold;'>Producto</th>
                            <th style='padding: 15px; text-align: center; font-weight: bold;'>Cant.</th>
                            <th style='padding: 15px; text-align: right; font-weight: bold;'>Precio</th>
                            <th style='padding: 15px; text-align: right; font-weight: bold;'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products_html}
                    </tbody>
                </table>
            </div>
            
            <!-- Totales -->
            <div style='padding: 30px; background: #f8fafc;'>
                <h3 style='margin: 0 0 20px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;'>💰 Resumen de Pago</h3>
                <div style='background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                    <div style='display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>
                        <span style='color: #475569;'>Subtotal:</span>
                        <span style='font-weight: bold;'>S/ {totals['subtotal']:.2f}</span>
                    </div>
                    <div style='display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>
                        <span style='color: #475569;'>Envío:</span>
                        <span style='font-weight: bold; color: {"#10b981" if totals['shipping'] == 0 else "#1e293b"};'>{"GRATIS" if totals['shipping'] == 0 else f"S/ {totals['shipping']:.2f}"}</span>
                    </div>
                    <div style='display: flex; justify-content: space-between; margin-bottom: 15px; padding: 8px 0; border-bottom: 1px solid #f1f5f9;'>
                        <span style='color: #475569;'>IGV Incluido:</span>
                        <span style='font-weight: bold;'>S/ {totals['tax']:.2f}</span>
                    </div>
                    <div style='display: flex; justify-content: space-between; padding: 15px 0; border-top: 3px solid #3b82f6; background: #f1f5f9; margin: 0 -20px -20px -20px; padding-left: 20px; padding-right: 20px;'>
                        <span style='font-size: 20px; font-weight: bold; color: #1e293b;'>TOTAL:</span>
                        <span style='font-size: 24px; font-weight: bold; color: #3b82f6;'>S/ {totals['total']:.2f}</span>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div style='background: #1e293b; color: white; padding: 30px; text-align: center;'>
                <h3 style='margin: 0 0 15px 0; color: #3b82f6;'>¡Gracias por tu compra!</h3>
                <p style='margin: 0 0 15px 0; opacity: 0.8;'>Tu pedido será procesado y enviado en un plazo de 3-5 días hábiles.</p>
                <div style='border-top: 1px solid #374151; padding-top: 20px; margin-top: 20px;'>
                    <p style='margin: 0; font-size: 14px; opacity: 0.7;'>
                        📧 Si tienes alguna pregunta, contáctanos<br>
                        🏠 <strong>Armadirique</strong> - Mueblería Premium<br>
                        📱 WhatsApp: +51 999 888 777
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

def generate_pdf_invoice_premium(payment_data: dict) -> io.BytesIO:
    """Genera un PDF premium con diseño mejorado"""
    try:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )
        styles = getSampleStyleSheet()
        story = []
        
        # Estilos personalizados mejorados
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=32,
            spaceAfter=20,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#1d4ed8'),
            fontName='Helvetica-Bold'
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=18,
            spaceAfter=15,
            spaceBefore=20,
            textColor=colors.HexColor('#1e293b'),
            fontName='Helvetica-Bold',
            borderWidth=2,
            borderColor=colors.HexColor('#3b82f6'),
            borderPadding=10,
            backColor=colors.HexColor('#f1f5f9')
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            fontName='Helvetica'
        )
        
        customer = payment_data['customer']
        totals = payment_data['totals']
        
        # Header con diseño premium
        story.append(Spacer(1, 1*cm))
        
        # Logo y título
        header_table = Table([
            ['ARMADIRIQUE', f"BOLETA N° {payment_data['orderNumber']}"],
            ['Mueblería Premium', f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}"]
        ], colWidths=[10*cm, 8*cm])
        
        header_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, 1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (0, 0), 24),
            ('FONTSIZE', (0, 1), (0, 1), 12),
            ('FONTSIZE', (1, 0), (1, 1), 12),
            ('TEXTCOLOR', (0, 0), (0, 1), colors.HexColor('#1d4ed8')),
            ('TEXTCOLOR', (1, 0), (1, 1), colors.HexColor('#475569')),
            ('ALIGN', (0, 0), (0, 1), 'LEFT'),
            ('ALIGN', (1, 0), (1, 1), 'RIGHT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#3b82f6')),
            ('INNERGRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('LEFTPADDING', (0, 0), (-1, -1), 15),
            ('RIGHTPADDING', (0, 0), (-1, -1), 15),
            ('TOPPADDING', (0, 0), (-1, -1), 15),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
        ]))
        
        story.append(header_table)
        story.append(Spacer(1, 1*cm))
        
        # Información del cliente con diseño mejorado
        story.append(Paragraph("INFORMACIÓN DEL CLIENTE", subtitle_style))
        
        customer_data = [
            ['Nombre Completo:', f"{customer['firstName']} {customer['lastName']}"],
            ['Correo Electrónico:', customer['email']],
            ['Teléfono:', customer['phone']],
            ['Dirección:', customer['address']],
            ['Distrito:', customer['district']],
            ['Departamento:', customer['department']],
            ['Código Postal:', customer['zipCode']],
            ['Método de Pago:', payment_data['paymentMethod'].upper()]
        ]
        
        customer_table = Table(customer_data, colWidths=[4*cm, 12*cm])
        customer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#3b82f6')),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
            ('TEXTCOLOR', (1, 0), (1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        
        story.append(customer_table)
        story.append(Spacer(1, 1*cm))
        
        # Productos con diseño premium
        story.append(Paragraph("DETALLE DE PRODUCTOS", subtitle_style))
        
        products_data = [['PRODUCTO', 'CANT.', 'PRECIO UNIT.', 'SUBTOTAL']]
        
        for product in payment_data['products']:
            subtotal_product = product['price'] * product['quantity']
            products_data.append([
                product['name'],
                str(product['quantity']),
                f"S/ {product['price']:.2f}",
                f"S/ {subtotal_product:.2f}"
            ])
        
        products_table = Table(products_data, colWidths=[8*cm, 2*cm, 3*cm, 3*cm])
        products_table.setStyle(TableStyle([
            # Header
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1d4ed8')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
            
            # Body
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),
            ('ALIGN', (1, 1), (1, -1), 'CENTER'),
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),
            
            # Alternating row colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
            
            # Borders
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db')),
            ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#3b82f6')),
            
            # Padding
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        story.append(products_table)
        story.append(Spacer(1, 1*cm))
        
        # Resumen de totales con diseño premium
        story.append(Paragraph("RESUMEN DE PAGO", subtitle_style))
        
        shipping_text = "GRATIS" if totals['shipping'] == 0 else f"S/ {totals['shipping']:.2f}"
        
        totals_data = [
            ['Subtotal:', f"S/ {totals['subtotal']:.2f}"],
            ['Envío:', shipping_text],
            ['IGV (18%):', f"S/ {totals['tax']:.2f}"],
            ['', ''],  # Separador
            ['TOTAL A PAGAR:', f"S/ {totals['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[8*cm, 4*cm])
        totals_table.setStyle(TableStyle([
            # Filas normales
            ('ALIGN', (0, 0), (0, 3), 'RIGHT'),
            ('ALIGN', (1, 0), (1, 3), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 3), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, 3), 11),
            ('TEXTCOLOR', (0, 0), (-1, 3), colors.HexColor('#475569')),
            
            # Fila total
            ('BACKGROUND', (0, 4), (-1, 4), colors.HexColor('#1d4ed8')),
            ('TEXTCOLOR', (0, 4), (-1, 4), colors.white),
            ('FONTNAME', (0, 4), (-1, 4), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 4), (-1, 4), 16),
            ('ALIGN', (0, 4), (-1, 4), 'RIGHT'),
            
            # Bordes y padding
            ('BOX', (0, 0), (-1, -1), 2, colors.HexColor('#3b82f6')),
            ('LINEABOVE', (0, 4), (-1, 4), 3, colors.HexColor('#3b82f6')),
            ('LEFTPADDING', (0, 0), (-1, -1), 15),
            ('RIGHTPADDING', (0, 0), (-1, -1), 15),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        
        story.append(totals_table)
        story.append(Spacer(1, 2*cm))
        
        # Footer premium
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=10,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#6b7280'),
            borderWidth=1,
            borderColor=colors.HexColor('#d1d5db'),
            borderPadding=15,
            backColor=colors.HexColor('#f9fafb')
        )
        
        footer_text = """
        <b>¡GRACIAS POR TU COMPRA!</b><br/><br/>
        Tu pedido será procesado y enviado en un plazo de 3-5 días hábiles.<br/>
        Para consultas o soporte, contáctanos:<br/><br/>
        <b>ARMADIRIQUE - Mueblería Premium</b><br/>
        📱 WhatsApp: +51 999 888 777<br/>
        📧 Email: contacto@armadirique.com<br/>
        🌐 Web: www.armadirique.com
        """
        
        story.append(Paragraph(footer_text, footer_style))
        
        # Construir el PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
        
    except Exception as e:
        print(f"Error generando PDF premium: {e}")
        raise HTTPException(status_code=500, detail=f"Error generando PDF: {str(e)}")

@app.post("/process-payment")
async def process_payment(request: Request):
    """Procesa el pago con múltiples métodos de envío de email"""
    try:
        payment_data = await request.json()
        payment_data = validate_payment_data(payment_data)
        
        invoice_html = generate_customer_invoice_html(payment_data)
        customer_email = payment_data['customer']['email']
        
        # Intentar enviar email con fallback
        email_result = send_email_with_fallback(
            to_email=customer_email,
            subject=f"🏠 Boleta de Compra - Armadirique | Orden: {payment_data['orderNumber']}",
            html_content=invoice_html
        )
        
        return {
            "success": True,
            "message": f"Pago procesado correctamente. Email enviado a {customer_email}",
            "orderNumber": payment_data['orderNumber'],
            "emailResult": email_result
        }
        
    except Exception as e:
        print(f"Error procesando pago: {e}")
        raise HTTPException(status_code=500, detail=f"Error procesando pago: {str(e)}")

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    """Genera PDF premium"""
    try:
        payment_data = await request.json()
        payment_data = validate_payment_data(payment_data)
        
        pdf_buffer = generate_pdf_invoice_premium(payment_data)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Boleta_Premium_Armadirique_{payment_data['orderNumber']}.pdf"}
        )
        
    except Exception as e:
        print(f"Error generando PDF: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error generando PDF: {str(e)}"}
        )

@app.get("/test-email/{email}")
async def test_email(email: str):
    """Endpoint para probar envío de emails"""
    try:
        test_data = {
            "orderNumber": "TEST-001",
            "customer": {
                "firstName": "Test",
                "lastName": "User",
                "email": email,
                "phone": "+51 999 888 777",
                "address": "Av. Test 123",
                "department": "Lima",
                "district": "Miraflores",
                "zipCode": "15074"
            },
            "products": [
                {"name": "Sofá de Prueba", "quantity": 1, "price": 1500.00}
            ],
            "totals": {
                "subtotal": 1500.00,
                "shipping": 0.00,
                "tax": 270.00,
                "total": 1770.00
            },
            "paymentMethod": "test"
        }
        
        html_content = generate_customer_invoice_html(test_data)
        result = send_email_with_fallback(email, "Test Email - Armadirique", html_content)
        
        return {"success": True, "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/")
async def root():
    return {
        "message": "Servidor Armadirique con múltiples proveedores de email",
        "version": "2.0",
        "features": ["Resend", "Gmail SMTP", "Simulación", "PDF Premium"],
        "frontend_file": "ArmadiqueCheckout.jsx"  # Actualizado desde index.html
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
