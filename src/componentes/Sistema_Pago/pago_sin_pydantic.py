from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List, Dict, Any
import requests
import json
from datetime import datetime
import io
import base64
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

app = FastAPI()

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de Resend
RESEND_API_KEY = "re_Wk79UuCU_2m4ARyApYF9XU1sYQe2DYnvX"
RESEND_API_URL = "https://api.resend.com/emails"

def validate_payment_data(data: dict) -> dict:
    """Valida los datos de pago sin usar Pydantic"""
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
    
    # Validar totals
    totals_fields = ['subtotal', 'shipping', 'tax', 'total']
    for field in totals_fields:
        if field not in data['totals']:
            raise HTTPException(status_code=400, detail=f"Campo requerido en totals: {field}")
    
    # Añadir timestamp si no existe
    if 'timestamp' not in data:
        data['timestamp'] = datetime.now().isoformat()
    
    return data

def send_email_with_resend(to_email: str, subject: str, html_content: str):
    """Envía un email usando la API de Resend"""
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "from": "Armadirique <onboarding@resend.dev>",
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }
    
    try:
        response = requests.post(RESEND_API_URL, headers=headers, json=data)
        response_data = response.json()
        
        if response.status_code >= 400:
            print(f"Error en API Resend: {response_data}")
            raise HTTPException(status_code=response.status_code, detail=f"Error enviando email: {response_data.get('message', 'Error desconocido')}")
        
        return response_data
    except requests.exceptions.RequestException as e:
        print(f"Error enviando email: {e}")
        raise HTTPException(status_code=500, detail=f"Error enviando email: {str(e)}")

def generate_customer_invoice_html(payment_data: dict) -> str:
    """Genera el HTML de la boleta para el cliente"""
    
    # Generar HTML de productos
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
    
    # Mapear método de pago
    payment_methods = {
        'yape': 'YAPE',
        'plin': 'PLIN',
        'paypal': 'PayPal',
        'card': 'Tarjeta de Crédito/Débito'
    }
    payment_method_text = payment_methods.get(payment_data['paymentMethod'], payment_data['paymentMethod'])
    
    # Formatear fecha
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
                        <span style='color: #475569;'>IGV (18%):</span>
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

def generate_pdf_invoice(payment_data: dict) -> io.BytesIO:
    """Genera un PDF de la boleta usando ReportLab"""
    try:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Estilo personalizado para el título
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.HexColor('#3b82f6')
        )
        
        # Estilo para subtítulos
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.HexColor('#1e293b')
        )
        
        customer = payment_data['customer']
        totals = payment_data['totals']
        
        # Título principal
        story.append(Paragraph("ARMADIRIQUE", title_style))
        story.append(Paragraph("Mueblería Premium", styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Información de la orden
        story.append(Paragraph("BOLETA DE VENTA", subtitle_style))
        order_info = [
            [f"Número de Orden: {payment_data['orderNumber']}"],
            [f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}"],
            [f"Método de Pago: {payment_data['paymentMethod'].upper()}"]
        ]
        
        order_table = Table(order_info, colWidths=[4*inch])
        order_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#3b82f6'))
        ]))
        
        story.append(order_table)
        story.append(Spacer(1, 20))
        
        # Información del cliente
        story.append(Paragraph("INFORMACIÓN DEL CLIENTE", subtitle_style))
        customer_info = [
            ["Nombre:", f"{customer['firstName']} {customer['lastName']}"],
            ["Email:", customer['email']],
            ["Teléfono:", customer['phone']],
            ["Dirección:", customer['address']],
            ["Distrito:", customer['district']],
            ["Departamento:", customer['department']],
            ["Código Postal:", customer['zipCode']]
        ]
        
        customer_table = Table(customer_info, colWidths=[1.5*inch, 3*inch])
        customer_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e5e7eb')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        
        story.append(customer_table)
        story.append(Spacer(1, 20))
        
        # Productos
        story.append(Paragraph("PRODUCTOS ADQUIRIDOS", subtitle_style))
        
        # Encabezados de la tabla de productos
        products_data = [["Producto", "Cantidad", "Precio Unit.", "Total"]]
        
        # Agregar productos
        for product in payment_data['products']:
            subtotal_product = product['price'] * product['quantity']
            products_data.append([
                product['name'],
                str(product['quantity']),
                f"S/ {product['price']:.2f}",
                f"S/ {subtotal_product:.2f}"
            ])
        
        products_table = Table(products_data, colWidths=[2.5*inch, 0.8*inch, 1*inch, 1*inch])
        products_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('ALIGN', (0, 1), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
        ]))
        
        story.append(products_table)
        story.append(Spacer(1, 20))
        
        # Totales
        story.append(Paragraph("RESUMEN DE PAGO", subtitle_style))
        
        shipping_text = "GRATIS" if totals['shipping'] == 0 else f"S/ {totals['shipping']:.2f}"
        
        totals_data = [
            ["Subtotal:", f"S/ {totals['subtotal']:.2f}"],
            ["Envío:", shipping_text],
            ["IGV (18%):", f"S/ {totals['tax']:.2f}"],
            ["", ""],  # Línea separadora
            ["TOTAL:", f"S/ {totals['total']:.2f}"]
        ]
        
        totals_table = Table(totals_data, colWidths=[2*inch, 1.5*inch])
        totals_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 0), (-1, 3), 'Helvetica'),
            ('FONTNAME', (0, 4), (-1, 4), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 3), 10),
            ('FONTSIZE', (0, 4), (-1, 4), 14),
            ('TEXTCOLOR', (0, 4), (-1, 4), colors.HexColor('#3b82f6')),
            ('LINEABOVE', (0, 4), (-1, 4), 2, colors.HexColor('#3b82f6')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        story.append(totals_table)
        story.append(Spacer(1, 30))
        
        # Footer
        footer_text = """
        <para align=center>
        <b>¡Gracias por tu compra!</b><br/>
        Tu pedido será procesado y enviado en un plazo de 3-5 días hábiles.<br/><br/>
        Si tienes alguna pregunta, contáctanos<br/>
        <b>Armadirique</b> - Mueblería Premium<br/>
        WhatsApp: +51 999 888 777
        </para>
        """
        story.append(Paragraph(footer_text, styles['Normal']))
        
        # Construir el PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
    except Exception as e:
        print(f"Error generando PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Error generando PDF: {str(e)}")

@app.post("/process-payment")
async def process_payment(request: Request):
    """Procesa el pago y envía el email al cliente"""
    try:
        # Obtener datos JSON del request
        payment_data = await request.json()
        
        # Validar datos
        payment_data = validate_payment_data(payment_data)
        
        # Generar HTML de la boleta
        invoice_html = generate_customer_invoice_html(payment_data)
        
        # Enviar email al cliente (CORREGIDO: ahora se envía al email del cliente)
        customer_email = payment_data['customer']['email']
        email_result = send_email_with_resend(
            to_email=customer_email,
            subject=f"🏠 Boleta de Compra - Armadirique | Orden: {payment_data['orderNumber']}",
            html_content=invoice_html
        )
        
        return {
            "success": True,
            "message": f"Pago procesado y email enviado correctamente a {customer_email}",
            "orderNumber": payment_data['orderNumber'],
            "emailId": email_result.get("id")
        }
        
    except Exception as e:
        print(f"Error procesando pago: {e}")
        raise HTTPException(status_code=500, detail=f"Error procesando pago: {str(e)}")

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    """Genera y retorna un PDF de la boleta"""
    try:
        # Obtener datos JSON del request
        payment_data = await request.json()
        
        # Validar datos
        payment_data = validate_payment_data(payment_data)
        
        # Generar PDF
        pdf_buffer = generate_pdf_invoice(payment_data)
        
        # Retornar el PDF como respuesta de streaming
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Boleta_Armadirique_{payment_data['orderNumber']}.pdf"}
        )
        
    except Exception as e:
        print(f"Error generando PDF: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error generando PDF: {str(e)}"}
        )

@app.get("/")
async def root():
    return {"message": "Servidor de pagos Armadirique funcionando correctamente - SIN PYDANTIC"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)