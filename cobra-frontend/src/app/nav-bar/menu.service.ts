import { Injectable } from '@angular/core';
import { Menu } from '../models/menu.model';

@Injectable()
export class MenuService {

  public static menuSistema: Menu[] = [
    {
      "title": "Resumen de Cuenta",
      "link": "/summary",
      "class": "menuFirst",
      "submenus": []
    },
    {
      "title": "Pagos",
      "class": "menuMedium",
      "submenus": [
        {
          "title": "Pagar",
          "link": "/payments",
          "class": "menuMedium"
        },
        {
          "title": "Adelantar cuotas",
          "link": "/advance-payments",
          "class": "menuMedium"
        },
        // {
        //   "title": "Débito Automatico",
        //   "link": "/automatic-debit",
        //   "class": "menuMedium"
        // }
      ]
    },
    {
      "title": "Cotizaciones",
      "link": "/quotations-table",
      "class": "",
      "submenus": []
    },
    {
      "title": "Administración",
      "class": "menuLarge",
      "submenus": [
        {
          "title": "Gestión de Clientes",
          "link": "/accounts-state",
          "class": "menuLarge"
        },
        {
          "title": "Soporte",
          "link": "/support",
          "class": "menuLarge"
        },
        {
          "title": "Configuración",
          "link": "/templates",
          "class": "menuLarge"
        },
        {
          "title": "Cotizaciones",
          "link": "/quotations",
          "class": "menuLarge"
        },
        {
          "title": "Cotizaciones por fecha",
          "link": "/publish-date-quotes",
          "class": "menuLarge"
        },
        {
          "title": "Publicaciones de Deuda",
          "link": "/debt-posts",
          "class": "menuLarge"
        },
        {
          "title": "Debin",
          "link": "/debin",
          "class": "menuLarge"
        },
        {
          "title": "Echeq",
          "link": "/echeq",
          "class": "menuLarge"
        },
        {
          "title": "Solicitudes de Adelantos",
          "link": "/manage-advance-payments",
          "class": "menuLarge"
        },         
        {
          "title": "Libre Deuda",
          "link": "/debt-free",
          "class": "menuLarge"
        }
      ]
    },
    {
      "title": "Reportes",
      "class": "menuLarge menuBreak",
      "submenus": [
          {
            "title": "Rendiciones",
            "link": "/report-render-account",
            "class": "menuLarge"
          },
          {
            "title": "Rechazos Santander",
            "link": "/report-rejected-santander",
            "class": "menuLarge"
          },
          {
            "title": "Login Usuarios",
            "link": "/report-login",
            "class": "menuLarge"
          },
          {
            "title": "Site repetidos",
            "link": "/report-site-repeated",
            "class": "menuLarge"
          },
          {
            "title": "Emails duplicados",
            "link": "/report-duplicate-mails",
            "class": "menuLarge"
          },          {
            "title": "Usuarios creados",
            "link": "/report-created-user",
            "class": "menuLarge"
          },          {
            "title": "Publicaciones de Deuda",
            "link": "/report-published-debt-files",
            "class": "menuLarge"
          }
      ]
    },
    {
      "title": "Web Rápida Cotizaciones",
      "link": "/quick-access-quotations",
      "class": "",
      "submenus": []
    },
    {
      "title": "Preguntas frecuentes",
      "class": "menuBeforeLast",
      "link": "/frequent-questions",
      "submenus": []
    },
    {
      "title": "Contacto",
      "link": "/contact",
      "class": "menuLast",
      "icon": "mail_outline",
      "submenus": []
    }
  ];


  public static menuUsuario: Menu[] = [
    {
      "title": "Configuración",
      "link": "/configuration",
      "icon": "settings"
    },
    {
      "title": "Volver a mi usuario",
      "link": "",
      "icon": "manage_accounts"
    },
    {
      "title": "Mis productos",
      "link": "/products",
      "icon": "store"
    },
    {
      "title": "Mis cuentas",
      "link": "/accounts",
      "icon": "credit_card"
    },
    {
      "title": "Cerrar Sesión",
      "icon": "exit_to_app"
    }
  ];

}
