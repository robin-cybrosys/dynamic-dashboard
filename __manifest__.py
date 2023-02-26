# -*- coding: utf-8 -*-
#############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2021-TODAY Cybrosys Technologies(<https://www.cybrosys.com>)
#    Author: Cybrosys Techno Solutions(<https://www.cybrosys.com>)
#
#    You can modify it under the terms of the GNU LESSER
#    GENERAL PUBLIC LICENSE (LGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU LESSER GENERAL PUBLIC LICENSE (LGPL v3) for more details.
#
#    You should have received a copy of the GNU LESSER GENERAL PUBLIC LICENSE
#    (LGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
#############################################################################
{
    'name': "Odoo Dynamic Dashboard Test",
    'version': '16.0.1.0.0',
    'category': 'Extra Tools',
    'summary': """Create Configurable Dashboards Easily""",
    'description': """Create Configurable Dashboard Dynamically to get the information that are relevant to your business, department, or a specific process or need, Dynamic Dashboard, Dashboard, Dashboard Odoo""",
    'author': 'Cybrosys Techno Solutions',
    'website': "https://www.cybrosys.com",
    'company': 'Cybrosys Techno Solutions',
    'maintainer': 'Cybrosys Techno Solutions',
    'depends': ['base', 'web'],
    'data': [
        'views/dashboard_view.xml',
        'views/dynamic_block_view.xml',
        'views/dashboard_menu_view.xml',
        'security/ir.model.access.csv',
    ],
    'assets': {
        'web.assets_backend': [
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
            'dynamic_odoo_dashboard/static/lib/css/gridstack.min.css',
            'dynamic_odoo_dashboard/static/src/css/dynamic_dashboard.css',
            'dynamic_odoo_dashboard/static/src/css/dynamic_dashboard.scss',
            "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css",
            'dynamic_odoo_dashboard/static/lib/js/gridstack.min.js',
            'dynamic_odoo_dashboard/static/lib/js/gridstack.jQueryUI.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.js',
            "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js",
            "https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js",
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js',
            'dynamic_odoo_dashboard/static/src/js/dynamic_dashboard.js',
            'dynamic_odoo_dashboard/static/src/xml/dynamic_dashboard_template.xml',
            'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700'
        ],
    },
    'images': ['static/description/banner.png'],
    'license': "AGPL-3",
    'installable': True,
    'auto_install': False,
    'application': True,
}
