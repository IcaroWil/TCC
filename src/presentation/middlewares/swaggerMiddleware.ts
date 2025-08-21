import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import { swaggerSpec } from '../../infrastructure/docs/swagger.config';

export class SwaggerMiddleware {
  static setup(app: Application): void {
    const swaggerOptions = {
      explorer: true,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
      },
      customCss: `
        body {
          background: #0f1419 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        html {
          background: #0f1419 !important;
        }
        
        .swagger-ui {
          background: #0f1419 !important;
          color: #ffffff !important;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        }
        
        .swagger-ui .swagger-container {
          background: #0f1419 !important;
        }
        
        .swagger-ui .swagger-ui-wrap {
          background: #0f1419 !important;
        }
        
        #swagger-ui {
          background: #0f1419 !important;
        }
        
        .swagger-ui .wrapper {
          padding: 0 !important;
        }
        
        .swagger-ui .topbar { display: none; }
        
        .swagger-ui .info .title {
          color: #00d4ff !important;
          font-size: 2.5rem !important;
          font-weight: 700 !important;
          text-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
          margin-bottom: 20px !important;
        }
        .swagger-ui .info .description {
          color: #e6e6e6 !important;
          background: linear-gradient(135deg, #1a2332, #243447) !important;
          padding: 25px !important;
          border-radius: 12px !important;
          border: 1px solid #2d4a63 !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
          line-height: 1.6 !important;
          font-size: 1rem !important;
        }
        
        .swagger-ui .wrapper {
          background: #0f1419 !important;
          max-width: 1400px !important;
          margin: 0 auto !important;
          padding: 20px !important;
        }
        
        .swagger-ui .information-container {
          background: #0f1419 !important;
          padding: 20px 0 !important;
        }
        
        .swagger-ui .information-container .info {
          margin: 0 !important;
        }
        .swagger-ui .scheme-container {
          background: linear-gradient(135deg, #1a2332, #243447) !important;
          border: 1px solid #2d4a63 !important;
          padding: 20px !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
        }
        
        .swagger-ui .btn.authorize {
          background: linear-gradient(135deg, #00d4ff, #0099cc) !important;
          border: none !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3) !important;
          transition: all 0.3s ease !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .swagger-ui .btn.authorize:hover {
          background: linear-gradient(135deg, #0099cc, #00d4ff) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4) !important;
        }
        
        .swagger-ui .opblock-tag {
          color: #ffffff !important;
          background: linear-gradient(135deg, #1a2332, #243447) !important;
          border: 1px solid #2d4a63 !important;
          border-radius: 8px !important;
          padding: 20px !important;
          margin-bottom: 20px !important;
          font-size: 1.2rem !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
        }
        .swagger-ui .opblock-tag:hover {
          background: linear-gradient(135deg, #243447, #2d4a63) !important;
          transform: translateY(-1px) !important;
        }
        .swagger-ui .opblock-tag small {
          color: #b3d9ff !important;
          font-weight: 400 !important;
        }
        
        .swagger-ui .opblock {
          background: linear-gradient(135deg, #1a2332, #243447) !important;
          border: 1px solid #2d4a63 !important;
          border-radius: 12px !important;
          margin-bottom: 20px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
          overflow: hidden !important;
        }
        .swagger-ui .opblock .opblock-summary {
          background: rgba(45, 74, 99, 0.3) !important;
          border-bottom: 1px solid #2d4a63 !important;
          padding: 15px 20px !important;
        }
        .swagger-ui .opblock .opblock-summary-description {
          color: #ffffff !important;
          font-weight: 500 !important;
        }
        .swagger-ui .opblock .opblock-summary-path {
          color: #ffffff !important;
          font-weight: 600 !important;
        }
        
        .swagger-ui .opblock-body {
          background: #1a2332 !important;
          color: #ffffff !important;
        }
        
        .swagger-ui .opblock-description-wrapper {
          color: #ffffff !important;
        }
        
        .swagger-ui .opblock-description-wrapper p {
          color: #ffffff !important;
        }
        
        .swagger-ui .opblock-section-header {
          background: #243447 !important;
          color: #ffffff !important;
        }
        
        .swagger-ui .opblock-section-header h4 {
          color: #ffffff !important;
        }
        
        .swagger-ui .tab li {
          color: #ffffff !important;
        }
        
        .swagger-ui .tab li.tabitem {
          background: #243447 !important;
          color: #ffffff !important;
        }
        
        .swagger-ui .tab li.tabitem.active {
          background: #00d4ff !important;
          color: #000000 !important;
        }
        
        .swagger-ui .opblock.opblock-post {
          border-left: 5px solid #28a745 !important;
        }
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #28a745 !important;
          color: #ffffff !important;
        }
        
        .swagger-ui .opblock.opblock-get {
          border-left: 5px solid #007bff !important;
        }
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #007bff !important;
          color: #ffffff !important;
        }
        
        .swagger-ui .opblock.opblock-put {
          border-left: 5px solid #ffc107 !important;
        }
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #ffc107 !important;
          color: #000000 !important;
        }
        
        .swagger-ui .opblock.opblock-delete {
          border-left: 5px solid #dc3545 !important;
        }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #dc3545 !important;
          color: #ffffff !important;
        }
        
        .swagger-ui .parameters-container {
          background: rgba(26, 35, 50, 0.8) !important;
          border-radius: 8px !important;
          padding: 15px !important;
        }
        .swagger-ui .parameter__name {
          color: #00d4ff !important;
          font-weight: 600 !important;
        }
        .swagger-ui .parameter__type {
          color: #ffc107 !important;
          font-weight: 500 !important;
        }
        .swagger-ui .parameter__in {
          color: #28a745 !important;
        }
        .swagger-ui .response-col_status {
          color: #28a745 !important;
          font-weight: 600 !important;
        }
        
        .swagger-ui .parameters-container .parameter__name {
          color: #00d4ff !important;
        }
        
        .swagger-ui .parameters-container .parameter__type {
          color: #ffc107 !important;
        }
        
        .swagger-ui .parameters-container .parameter__deprecated {
          color: #dc3545 !important;
        }
        
        .swagger-ui .parameters-container .parameter__extension {
          color: #ffffff !important;
        }
        
        .swagger-ui .parameter-item {
          background: rgba(36, 52, 71, 0.6) !important;
          border: 1px solid #2d4a63 !important;
          border-radius: 6px !important;
          margin-bottom: 10px !important;
          padding: 10px !important;
        }
        
        .swagger-ui .parameter-item .parameter__name {
          color: #00d4ff !important;
          font-weight: 600 !important;
        }
        
        .swagger-ui .parameter-item .parameter__type {
          color: #ffc107 !important;
        }
        
        .swagger-ui .parameter-item .parameter__in {
          color: #28a745 !important;
        }
        
        .swagger-ui .parameter-item .renderedMarkdown p {
          color: #ffffff !important;
        }
        
        .swagger-ui .parameter-item .parameter__extension {
          color: #ffffff !important;
        }
        
        .swagger-ui .table-container {
          background: rgba(26, 35, 50, 0.8) !important;
        }
        
        .swagger-ui table {
          background: rgba(26, 35, 50, 0.8) !important;
        }
        
        .swagger-ui table thead tr td,
        .swagger-ui table thead tr th {
          color: #ffffff !important;
          background: #243447 !important;
          border-bottom: 1px solid #2d4a63 !important;
        }
        
        .swagger-ui table tbody tr td {
          color: #ffffff !important;
          background: rgba(26, 35, 50, 0.6) !important;
          border-bottom: 1px solid #2d4a63 !important;
        }
        
        .swagger-ui .renderedMarkdown p {
          color: #ffffff !important;
        }
        
        .swagger-ui .markdown p {
          color: #ffffff !important;
        }
        
        .swagger-ui .markdown code {
          background: #1a2332 !important;
          color: #00d4ff !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
        
        .swagger-ui input[type=text],
        .swagger-ui input[type=password],
        .swagger-ui textarea,
        .swagger-ui select {
          background: #243447 !important;
          border: 2px solid #2d4a63 !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          padding: 12px !important;
          font-size: 14px !important;
        }
        .swagger-ui input[type=text]:focus,
        .swagger-ui input[type=password]:focus,
        .swagger-ui textarea:focus,
        .swagger-ui select:focus {
          border-color: #00d4ff !important;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2) !important;
          outline: none !important;
        }
        
        .swagger-ui .btn.try-out__btn {
          background: #28a745 !important;
          border: none !important;
          color: #ffffff !important;
          padding: 8px 16px !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
        }
        .swagger-ui .btn.try-out__btn:hover {
          background: #218838 !important;
        }
        
        .swagger-ui .btn.execute {
          background: #007bff !important;
          border: none !important;
          color: #ffffff !important;
          padding: 12px 24px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
        }
        .swagger-ui .btn.execute:hover {
          background: #0056b3 !important;
        }
        
        .swagger-ui .responses-inner {
          background: rgba(26, 35, 50, 0.5) !important;
          border-radius: 8px !important;
          padding: 15px !important;
        }
        .swagger-ui .response {
          border: 1px solid #2d4a63 !important;
          border-radius: 8px !important;
          margin-bottom: 10px !important;
        }
        .swagger-ui .highlight-code {
          background: #1a2332 !important;
          border-radius: 6px !important;
          padding: 15px !important;
        }
        .swagger-ui .highlight-code pre {
          color: #e6e6e6 !important;
        }
        
        .swagger-ui .model-container {
          background: rgba(26, 35, 50, 0.5) !important;
          border-radius: 8px !important;
          padding: 15px !important;
        }
        .swagger-ui .model {
          color: #ffffff !important;
        }
        .swagger-ui .prop-type {
          color: #ffc107 !important;
          font-weight: 600 !important;
        }
        .swagger-ui .prop-name {
          color: #00d4ff !important;
          font-weight: 600 !important;
        }
        .swagger-ui .prop-format {
          color: #28a745 !important;
        }
        
        .swagger-ui .filter-container input {
          background: #243447 !important;
          border: 2px solid #2d4a63 !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          padding: 12px !important;
        }
        .swagger-ui .filter-container input:focus {
          border-color: #00d4ff !important;
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2) !important;
        }
        
        .swagger-ui ::-webkit-scrollbar {
          width: 12px;
        }
        .swagger-ui ::-webkit-scrollbar-track {
          background: #1a2332;
          border-radius: 6px;
        }
        .swagger-ui ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00d4ff, #0099cc);
          border-radius: 6px;
          border: 2px solid #1a2332;
        }
        .swagger-ui ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0099cc, #00d4ff);
        }
        
        .swagger-ui .opblock,
        .swagger-ui .opblock-tag,
        .swagger-ui .btn {
          transition: all 0.3s ease !important;
        }
        
        * {
          box-sizing: border-box !important;
        }
        
        .swagger-ui .swagger-ui-wrap {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .swagger-ui .swagger-container {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .swagger-ui .footer {
          background: #0f1419 !important;
          color: #ffffff !important;
        }
        
        .swagger-ui * {
          outline: none !important;
        }
        
        .swagger-ui .swagger-ui-wrap .block {
          background: #0f1419 !important;
        }
        
        .swagger-ui .swagger-ui-wrap {
          min-height: 100vh !important;
        }
        
        .swagger-ui .swagger-ui-wrap .swagger-container-wrapper {
          background: #0f1419 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .swagger-ui .swagger-ui-wrap .swagger-container-wrapper .swagger-container {
          background: #0f1419 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
      `,
      customSiteTitle: 'SaaS Barbearia - API Documentation',
      customfavIcon: '/favicon.ico',
    };

    app.get('/docs/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    app.use('/docs', swaggerUi.serve);
    app.get('/docs', swaggerUi.setup(swaggerSpec, swaggerOptions));

    app.get('/api-docs', (req, res) => {
      res.redirect('/docs');
    });

    console.log('📚 Swagger documentation available at /docs');
  }

  static getInfo() {
    const spec = swaggerSpec as any;
    return {
      title: spec.info?.title || 'API Documentation',
      version: spec.info?.version || '1.0.0',
      description: spec.info?.description || 'API Documentation',
      docsUrl: '/docs',
      jsonUrl: '/docs/swagger.json',
    };
  }
}